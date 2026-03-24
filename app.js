// Digital Empire – app.js
// Service Worker registration, install prompt, and app logic

(function () {
  'use strict';

  // ── Service Worker Registration ────────────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then((registration) => {
          console.log('[App] Service Worker registered:', registration.scope);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showToast('🔄 A new version is available. Refresh to update.');
              }
            });
          });
        })
        .catch((err) => console.warn('[App] Service Worker registration failed:', err));
    });

    // Detect controller change (new SW activated after refresh)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  // ── PWA Install Prompt ─────────────────────────────────────────────────────
  let deferredPrompt = null;
  const installBtn = document.getElementById('install-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[App] Install prompt outcome:', outcome);
      deferredPrompt = null;
      installBtn.style.display = 'none';
      if (outcome === 'accepted') {
        showToast('✅ Digital Empire installed successfully!');
      }
    });
  }

  // Hide install button once app is installed
  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
    deferredPrompt = null;
    showToast('🎉 App installed! Find it on your home screen.');
  });

  // ── Online / Offline Detection ─────────────────────────────────────────────
  const offlineBanner = document.getElementById('offline-banner');

  function updateOnlineStatus() {
    if (!navigator.onLine) {
      if (offlineBanner) offlineBanner.classList.add('show');
      showToast('📡 You are offline. Cached content will be served.');
    } else {
      if (offlineBanner) offlineBanner.classList.remove('show');
    }
  }

  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus(); // Run on page load

  // ── Toast Notification ─────────────────────────────────────────────────────
  function showToast(message, duration) {
    duration = duration || 3500;
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  // Expose showToast globally for use from other scripts if needed
  window.showToast = showToast;

  // ── Performance Metrics (optional) ────────────────────────────────────────
  if (window.performance && window.PerformanceObserver) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('[Perf] LCP:', entry.startTime.toFixed(0), 'ms');
          }
        });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Observer not supported – silently ignore
    }
  }
})();
