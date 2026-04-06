/**
 * server.js – Express backend for DIGITAL-EMPIRE PWA
 *
 * Responsibilities:
 *  - Serve static PWA files
 *  - Provide CSRF token endpoint
 *  - Verify Paystack transactions (POST /api/payment/verify)
 *  - Handle Paystack webhooks (POST /api/payment/webhook)
 *  - Apply security headers (Helmet), CORS, and rate limiting
 */

'use strict';

require('dotenv').config();

const path        = require('path');
const crypto      = require('crypto');
const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');

const app  = express();
const PORT = process.env.APP_PORT || 3000;

// ── Environment guards ─────────────────────────────────────────────────────
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

if (!PAYSTACK_SECRET_KEY || !PAYSTACK_PUBLIC_KEY) {
  console.error(
    '[startup] Missing PAYSTACK_SECRET_KEY or PAYSTACK_PUBLIC_KEY in environment.\n' +
      'Copy .env.example → .env and fill in your Paystack keys.',
  );
  process.exit(1);
}

// ── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.APP_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

const corsOptions = {
  origin(origin, cb) {
    // Allow same-origin (no origin header) and explicitly allowed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
};

// ── Security headers (Helmet) ──────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:  ["'self'", 'https://js.paystack.co', "'unsafe-inline'"],
        connectSrc: ["'self'", 'https://api.paystack.co'],
        frameSrc:   ['https://checkout.paystack.com'],
        imgSrc:     ["'self'", 'data:', 'https:'],
        styleSrc:   ["'self'", "'unsafe-inline'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  }),
);

// ── In-memory CSRF token store ─────────────────────────────────────────────
// In production, use express-session + csurf or a stateless JWT-signed token.
const CSRF_TOKENS = new Map();   // token → expiry timestamp
const CSRF_TTL    = 30 * 60 * 1000; // 30 minutes

function generateCsrfToken() {
  const token = crypto.randomBytes(32).toString('hex');
  CSRF_TOKENS.set(token, Date.now() + CSRF_TTL);
  // Clean up expired tokens
  for (const [t, exp] of CSRF_TOKENS) {
    if (exp < Date.now()) CSRF_TOKENS.delete(t);
  }
  return token;
}

function validateCsrfToken(token) {
  if (!token) return false;
  const exp = CSRF_TOKENS.get(token);
  if (!exp || exp < Date.now()) return false;
  CSRF_TOKENS.delete(token); // one-time use
  return true;
}

// ── Rate limiters ──────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many payment requests, please wait before retrying.' },
});

// ── Webhook body must be raw Buffer for HMAC verification ─────────────────
app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
);

// ── Standard middleware ────────────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Static files ───────────────────────────────────────────────────────────
app.use(
  express.static(path.join(__dirname), {
    index: 'index.html',
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('service-worker.js')) {
        res.setHeader('Service-Worker-Allowed', '/');
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }),
);

// ── CSRF token endpoint ────────────────────────────────────────────────────
app.get('/api/csrf-token', apiLimiter, cors(corsOptions), (req, res) => {
  res.json({ csrfToken: generateCsrfToken() });
});

// ── Payment verification ───────────────────────────────────────────────────
app.post('/api/payment/verify', paymentLimiter, cors(corsOptions), async (req, res) => {
  const { reference } = req.body;
  const csrfToken     = req.headers['x-csrf-token'] || req.body._csrf;

  // Validate CSRF
  if (!validateCsrfToken(csrfToken)) {
    return res.status(403).json({ status: 'error', message: 'Invalid or expired CSRF token.' });
  }

  if (!reference || typeof reference !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Missing payment reference.' });
  }

  // Sanitise reference – Paystack refs are alphanumeric + hyphens
  if (!/^[A-Za-z0-9_-]{5,100}$/.test(reference)) {
    return res.status(400).json({ status: 'error', message: 'Invalid payment reference format.' });
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(400).json({ status: 'failed', message: data.message || 'Verification failed.' });
    }

    const txn = data.data;
    if (txn.status !== 'success') {
      return res.status(400).json({
        status: 'failed',
        message: `Transaction status: ${txn.status}`,
      });
    }

    // Return safe fields to the client (never expose full Paystack payload)
    return res.json({
      status: 'success',
      message: 'Payment verified successfully.',
      data: {
        reference: txn.reference,
        amount:    txn.amount,
        currency:  txn.currency,
        email:     txn.customer?.email,
        paidAt:    txn.paid_at,
      },
    });
  } catch (err) {
    console.error('[payment/verify] Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Internal server error during verification.' });
  }
});

// ── Paystack Webhook ───────────────────────────────────────────────────────
app.post('/api/payment/webhook', (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const body      = req.body; // raw Buffer (see middleware above)

  if (!signature || !Buffer.isBuffer(body)) {
    return res.status(400).send('Bad Request');
  }

  // Verify HMAC-SHA512 signature
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    console.warn('[webhook] Invalid Paystack signature.');
    return res.status(401).send('Unauthorized');
  }

  let event;
  try {
    event = JSON.parse(body.toString('utf8'));
  } catch {
    return res.status(400).send('Bad Request');
  }

  // Acknowledge immediately, process asynchronously
  res.sendStatus(200);

  switch (event.event) {
    case 'charge.success':
      handleChargeSuccess(event.data);
      break;
    case 'transfer.success':
    case 'transfer.failed':
    case 'transfer.reversed':
      handleTransferEvent(event);
      break;
    default:
      // Ignore unhandled events
      break;
  }
});

function handleChargeSuccess(data) {
  // TODO: persist order to database, send confirmation email, etc.
  console.log('[webhook] charge.success – ref:', data?.reference, '| amount:', data?.amount);
}

function handleTransferEvent(event) {
  console.log('[webhook] transfer event:', event.event, '| ref:', event.data?.reference);
}

// ── SPA fallback – serve index.html for unmatched GET routes ──────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[error]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred.' : err.message,
  });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] DIGITAL-EMPIRE running on http://localhost:${PORT}`);
  console.log(`[server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // exported for testing
