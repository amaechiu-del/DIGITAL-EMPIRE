# DIGITAL-EMPIRE – DOMISLINK INTERNATIONAL PWA

A **Progressive Web App** built for DOMISLINK INTERNATIONAL with full **Paystack payment integration** for selling digital products and services.

---

## 🚀 Features

| Feature | Status |
|---------|--------|
| Progressive Web App (installable) | ✅ |
| Offline support via Service Worker | ✅ |
| Paystack inline checkout | ✅ |
| CSRF & CORS protection | ✅ |
| Webhook signature verification | ✅ |
| Cart & order management | ✅ |
| Payment success / failure pages | ✅ |
| Rate limiting | ✅ |
| GitHub Actions CI/CD | ✅ |

---

## 🛠️ Quick Start

### 1. Clone & install

```bash
git clone https://github.com/amaechiu-del/DIGITAL-EMPIRE.git
cd DIGITAL-EMPIRE
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your Paystack keys:

```env
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
APP_PORT=3000
APP_URL=http://localhost:3000
NODE_ENV=development
```

> **Where to get your keys:** [https://dashboard.paystack.com/#/settings/developers](https://dashboard.paystack.com/#/settings/developers)

### 3. Run the server

```bash
npm start          # production
npm run dev        # development (nodemon)
```

Open **http://localhost:3000** in your browser.

---

## 💳 Paystack Setup

### Test Keys (development)

Use Paystack **test keys** during development. All transactions are simulated – no real money is charged.

- Test card: `4084 0840 8408 4081` | Expiry: any future date | CVV: `408`

### Live Keys (production)

1. Complete your Paystack business verification
2. Get live keys from the Paystack dashboard
3. Update your production environment variables (never commit live keys to git)

### Webhook Configuration

1. In the [Paystack dashboard](https://dashboard.paystack.com/#/settings/developer), set the webhook URL to:
   ```
   https://your-domain.com/api/payment/webhook
   ```
2. The server automatically verifies Paystack's HMAC-SHA512 signature on every webhook event.

---

## 🌐 Deploy to GitHub Pages (static / frontend-only)

1. Go to **Settings → Pages → Source → GitHub Actions**
2. Push to `main` – the workflow deploys automatically
3. Your app is live at: `https://amaechiu-del.github.io/DIGITAL-EMPIRE/`

> ⚠️ GitHub Pages is a static host and **cannot run the Node.js backend**. For payment verification and webhooks you need a Node.js-capable host (see below).

## 🖥️ Deploy Node.js backend

For full payment processing, deploy `server.js` to:
- **Railway** – `railway up`
- **Render** – connect your repo, set env vars, deploy
- **Heroku** – `git push heroku main`
- **VPS** – `npm start` behind nginx/Caddy

Set the following environment variables on your host:
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `APP_URL` (your live domain)
- `CORS_ORIGINS` (your live domain)
- `NODE_ENV=production`

---

## 🔒 Security

- **Secret key** is never exposed to the browser – only used in `server.js`
- **CSRF tokens** protect the `/api/payment/verify` endpoint
- **Webhook signatures** (HMAC-SHA512) are verified before processing events
- **Rate limiting** prevents brute-force and abuse
- **Helmet** adds secure HTTP headers (CSP, HSTS, etc.)
- **Input validation** sanitises all user-supplied data

---

## 📁 Project Structure

```
DIGITAL-EMPIRE/
├── index.html              # PWA app shell with Paystack checkout
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline caching
├── app.js                  # SW registration + install prompt
├── offline.html            # Offline fallback page
├── payment-success.html    # Payment success page
├── payment-failed.html     # Payment failure page
├── js/
│   ├── cart.js             # Cart & order management
│   └── payment.js          # Paystack payment handler
├── server.js               # Express backend (verification + webhooks)
├── package.json
├── .env.example            # Environment variable template
├── .htaccess               # Apache security & rewrite rules
├── robots.txt
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD pipeline
```

---

## 📄 License

MIT © DOMISLINK INTERNATIONAL
