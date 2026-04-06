/**
 * payment.js – Paystack Payment Handler
 *
 * Handles:
 *  - Checkout form validation
 *  - Paystack inline popup initialisation
 *  - Payment reference generation
 *  - Server-side verification call
 *  - Success / failure UI feedback
 */

'use strict';

// ── Configuration ──────────────────────────────────────────────────────────
// Public key is safe to expose in the browser.
// Read from a <meta> tag so the build pipeline can inject it without
// hardcoding it in source control.
const META_KEY = document
  .querySelector('meta[name="paystack-public-key"]')
  ?.getAttribute('content');

if (!META_KEY) {
  console.error(
    '[payment] Paystack public key not found. ' +
    'Add <meta name="paystack-public-key" content="pk_..."> to your HTML.',
  );
}

const PAYSTACK_PUBLIC_KEY = META_KEY || '';
const VERIFY_ENDPOINT     = '/api/payment/verify';   // your backend route
const MAX_RETRIES         = 3;

// ── CSRF Token Helper ──────────────────────────────────────────────────────
/**
 * Fetch a fresh CSRF token from the backend and populate the hidden input.
 * Falls back gracefully if the endpoint is unavailable (e.g. static hosting).
 */
async function fetchCsrfToken() {
  try {
    const res = await fetch('/api/csrf-token', { credentials: 'same-origin' });
    if (!res.ok) return;
    const data = await res.json();
    const input = document.getElementById('csrf-token');
    if (input && data.csrfToken) input.value = data.csrfToken;
  } catch {
    /* endpoint not available – proceed without CSRF (acceptable for static hosting) */
  }
}

// ── Form Validation ────────────────────────────────────────────────────────
function validateField(id, errorId, check) {
  const field = document.getElementById(id);
  const errEl = document.getElementById(errorId);
  if (!field) return true;

  const valid = check(field.value.trim());
  field.classList.toggle('invalid', !valid);
  errEl?.classList.toggle('visible', !valid);
  return valid;
}

function validateCheckoutForm() {
  const firstNameOk = validateField(
    'first-name', 'first-name-error',
    (v) => v.length >= 1,
  );
  const lastNameOk = validateField(
    'last-name', 'last-name-error',
    (v) => v.length >= 1,
  );
  const emailOk = validateField(
    'email', 'email-error',
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  );
  return firstNameOk && lastNameOk && emailOk;
}

// ── UI Helpers ─────────────────────────────────────────────────────────────
function setPayButtonLoading(loading) {
  const btn    = document.getElementById('pay-btn');
  const txtEl  = document.getElementById('pay-btn-text');
  if (!btn || !txtEl) return;

  btn.disabled = loading;

  if (loading) {
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    spinner.id = 'pay-spinner';
    btn.insertBefore(spinner, txtEl);
    txtEl.textContent = 'Processing…';
  } else {
    document.getElementById('pay-spinner')?.remove();
    const total = window.Cart?.total() ?? 0;
    txtEl.textContent = total > 0 ? `Pay ${window.formatPrice(total)}` : 'Pay Now';
  }
}

// ── Verification ──────────────────────────────────────────────────────────
/**
 * Call the backend to verify the transaction reference with Paystack API.
 * Returns { status: 'success'|'failed', data?: object }
 */
async function verifyPayment(reference, attempt = 1) {
  const csrfToken = document.getElementById('csrf-token')?.value ?? '';

  const headers = {
    'Content-Type': 'application/json',
  };
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: 'POST',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify({ reference }),
    });

    if (!res.ok) {
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
        return verifyPayment(reference, attempt + 1);
      }
      return { status: 'failed', error: `Server error (${res.status})` };
    }

    const data = await res.json();
    return data.status === 'success'
      ? { status: 'success', data }
      : { status: 'failed', error: data.message || 'Verification failed' };
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 800 * attempt));
      return verifyPayment(reference, attempt + 1);
    }
    return { status: 'failed', error: err.message };
  }
}

// ── On Payment Success ────────────────────────────────────────────────────
function handlePaymentSuccess(reference, verificationData) {
  // Clear cart
  window.Cart?.clear();

  // Persist order to localStorage for order history
  const order = {
    reference,
    items: window.Cart?.items() ?? [],
    total: verificationData?.data?.data?.amount ?? 0,
    date: new Date().toISOString(),
    status: 'paid',
  };
  try {
    const orders = JSON.parse(localStorage.getItem('de_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('de_orders', JSON.stringify(orders.slice(0, 50)));
  } catch { /* ignore storage errors */ }

  // Navigate to success page
  const params = new URLSearchParams({
    ref: reference,
    status: 'success',
  });
  window.location.href = `/payment-success.html?${params.toString()}`;
}

// ── On Payment Failure ────────────────────────────────────────────────────
function handlePaymentFailure(reason) {
  setPayButtonLoading(false);
  window.showToast?.('Payment failed', reason || 'Please try again.', 'error');
}

// ── Paystack Popup Init ───────────────────────────────────────────────────
function initiatePaystackPayment({ email, firstName, lastName, phone, amountKobo, orderRef }) {
  if (!PAYSTACK_PUBLIC_KEY) {
    handlePaymentFailure('Payment is not configured. Please contact support.');
    setPayButtonLoading(false);
    return;
  }
  if (typeof PaystackPop === 'undefined') {
    handlePaymentFailure('Paystack SDK could not be loaded. Check your internet connection.');
    setPayButtonLoading(false);
    return;
  }

  const popup = new PaystackPop();
  popup.newTransaction({
    key:       PAYSTACK_PUBLIC_KEY,
    email,
    amount:    amountKobo,               // Paystack expects kobo (₦1 = 100 kobo)
    currency:  'NGN',
    ref:       orderRef,
    label:     `${firstName} ${lastName}`,
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name',  value: `${firstName} ${lastName}` },
        { display_name: 'Phone',         variable_name: 'customer_phone', value: phone || 'N/A' },
        { display_name: 'App',           variable_name: 'app',            value: 'DIGITAL-EMPIRE PWA' },
      ],
      cart: (window.Cart?.items() ?? []).map((i) => ({
        id:    i.id,
        name:  i.name,
        price: i.price,
        qty:   i.qty,
      })),
    },

    onSuccess(transaction) {
      // transaction.reference is confirmed by Paystack
      verifyPayment(transaction.reference).then((result) => {
        if (result.status === 'success') {
          handlePaymentSuccess(transaction.reference, result);
        } else {
          handlePaymentFailure(result.error || 'Verification failed. Contact support.');
        }
      });
    },

    onLoad() {
      setPayButtonLoading(false);
    },

    onCancel() {
      setPayButtonLoading(false);
      window.showToast?.('Payment cancelled', 'You closed the payment window.', 'warning');
    },

    onError(error) {
      setPayButtonLoading(false);
      handlePaymentFailure(error.message || 'An error occurred during payment.');
    },
  });
}

// ── Form Submit ───────────────────────────────────────────────────────────
function handleCheckoutSubmit(e) {
  e.preventDefault();

  // Must be online to pay
  if (!navigator.onLine) {
    window.showToast?.('No internet', 'Payment requires an internet connection.', 'error');
    return;
  }

  if (!validateCheckoutForm()) return;

  const total = window.Cart?.total() ?? 0;
  if (total === 0) {
    window.showToast?.('Empty cart', 'Add items to your cart before paying.', 'warning');
    return;
  }

  const firstName = document.getElementById('first-name').value.trim();
  const lastName  = document.getElementById('last-name').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const orderRef  = window.generateOrderRef?.() ?? `DE-${Date.now()}`;

  setPayButtonLoading(true);

  initiatePaystackPayment({
    email,
    firstName,
    lastName,
    phone,
    amountKobo: Math.round(total * 100),  // convert Naira to kobo (round to avoid float precision errors)
    orderRef,
  });
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchCsrfToken();

  const form = document.getElementById('checkout-form');
  form?.addEventListener('submit', handleCheckoutSubmit);

  // Live validation feedback
  ['first-name', 'last-name', 'email'].forEach((id) => {
    document.getElementById(id)?.addEventListener('blur', () => {
      const errorMap = {
        'first-name': ['first-name', 'first-name-error', (v) => v.length >= 1],
        'last-name':  ['last-name',  'last-name-error',  (v) => v.length >= 1],
        email:        ['email',      'email-error',       (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)],
      };
      const [fId, eId, check] = errorMap[id];
      validateField(fId, eId, check);
    });
  });
});
