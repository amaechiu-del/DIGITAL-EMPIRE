# 🌐 Digital Empire – DOMISLINK International PWA

A fully production-ready **Progressive Web App (PWA)** by DOMISLINK International.

[![Deploy](https://github.com/amaechiu-del/DIGITAL-EMPIRE/actions/workflows/deploy.yml/badge.svg)](https://github.com/amaechiu-del/DIGITAL-EMPIRE/actions/workflows/deploy.yml)

---

## ✨ Features

- 📲 **Installable** on Android, iOS, Windows, and macOS
- 🔌 **Works offline** via service worker caching
- ⚡ **Lightning fast** with pre-cached app shell
- 🔔 **Push notifications** support
- 🔒 **HTTPS enforced** with strict security headers
- 🚀 **Auto-deploy** to GitHub Pages via GitHub Actions

---

## 📁 Project Structure

```
DIGITAL-EMPIRE/
├── index.html          # App shell entry point
├── offline.html        # Offline fallback page
├── app.js              # SW registration & app logic
├── service-worker.js   # Caching, sync, push notifications
├── manifest.json       # PWA manifest
├── .htaccess           # Apache HTTPS & security headers
├── robots.txt          # SEO crawler rules
├── sitemap.xml         # Site structure for search engines
├── package.json        # Node.js metadata
├── .gitignore          # Ignored files
├── icons/              # App icons (72–512px)
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── generate-icons.js  # Script to regenerate icons
└── .github/
    └── workflows/
        └── deploy.yml  # CI/CD → GitHub Pages
```

---

## 🚀 Quick Start

### Run locally

```bash
# Using Node.js serve
npx serve . -l 3000
# Open http://localhost:3000
```

### Generate real icons (optional)

Replace the placeholder icons with your brand icons:

```bash
# Install canvas
npm install canvas

# Generate icons
node icons/generate-icons.js
```

---

## 🛠 PWA Caching Strategy

| Request type  | Strategy               |
|---------------|------------------------|
| Navigation    | Network-first + offline fallback |
| Static assets | Cache-first            |
| API calls     | Network-first          |
| Everything else | Stale-while-revalidate |

---

## 🚢 Deployment

The app is automatically deployed to **GitHub Pages** on every push to `main`.

> To enable GitHub Pages: **Settings → Pages → Source → GitHub Actions**

---

## 📄 License

MIT © DOMISLINK International
