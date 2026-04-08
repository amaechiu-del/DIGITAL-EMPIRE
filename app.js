/**
 * app.js – PWA Bootstrap
 * Registers the service worker, handles install prompt, and online/offline state.
 */

'use strict';

// ── Service Worker ─────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        console.log('[SW] Registered. Scope:', reg.scope);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.showToast?.(
                'Update available',
                'Refresh the page to get the latest version.',
                'info',
              );
            }
          });
        });
      })
      .catch((err) => console.warn('[SW] Registration failed:', err));
  });
}

// ── Install Prompt ─────────────────────────────────────────────────────────
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;

  const prompt = document.getElementById('install-prompt');
  if (prompt && !localStorage.getItem('de_install_dismissed')) {
    prompt.style.display = 'block';
  }
});

document.getElementById('install-btn')?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.getElementById('install-prompt').style.display = 'none';
  if (outcome === 'accepted') {
    window.showToast?.('App installed!', 'DIGITAL-EMPIRE added to home screen.', 'success');
  }
});

document.getElementById('dismiss-install-btn')?.addEventListener('click', () => {
  document.getElementById('install-prompt').style.display = 'none';
  localStorage.setItem('de_install_dismissed', '1');
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  document.getElementById('install-prompt').style.display = 'none';
});

// ── Online / Offline ───────────────────────────────────────────────────────
function updateOnlineStatus() {
  if (!navigator.onLine) {
    document.body.classList.add('offline');
  } else {
    document.body.classList.remove('offline');
  }
}

window.addEventListener('online',  () => {
  updateOnlineStatus();
  window.showToast?.('Back online', 'Your connection has been restored.', 'success');
});
window.addEventListener('offline', () => {
  updateOnlineStatus();
  window.showToast?.('You are offline', 'Payment requires an internet connection.', 'warning');
});

updateOnlineStatus();
