/**
 * cart.js – Order / Cart Management
 * Handles product catalog, cart state, and order reference generation.
 */

'use strict';

// ── Product Catalogue ──────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'de-001',
    name: 'Business Website Package',
    description: 'Professional 5-page business website with hosting setup guide.',
    price: 25000,
    emoji: '🌐',
    badge: 'Bestseller',
    category: 'web',
  },
  {
    id: 'de-002',
    name: 'Logo & Brand Identity',
    description: 'Custom logo design + brand style guide (color palette, fonts, usage rules).',
    price: 15000,
    emoji: '🎨',
    badge: 'Popular',
    category: 'design',
  },
  {
    id: 'de-003',
    name: 'Social Media Setup',
    description: 'Complete social media setup for 3 platforms with branded graphics.',
    price: 10000,
    emoji: '📱',
    badge: 'New',
    category: 'social',
  },
  {
    id: 'de-004',
    name: 'E-Commerce Store',
    description: 'Full online store with product listings, checkout & payment integration.',
    price: 45000,
    emoji: '🛍️',
    badge: 'Premium',
    category: 'web',
  },
  {
    id: 'de-005',
    name: 'SEO Optimization',
    description: 'On-page SEO audit + keyword strategy + Google Business Profile setup.',
    price: 12000,
    emoji: '🔍',
    badge: 'Essential',
    category: 'marketing',
  },
  {
    id: 'de-006',
    name: 'Content Writing Bundle',
    description: '10 professionally written blog posts optimised for your niche.',
    price: 20000,
    emoji: '✍️',
    badge: 'Value',
    category: 'content',
  },
];

// ── Cart State ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'de_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable – continue in-memory only */
  }
}

let cartItems = loadCart();

// ── Cart API ───────────────────────────────────────────────────────────────
const Cart = {
  /** Add a product or increment its quantity. */
  add(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existing = cartItems.find((i) => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push({ ...product, qty: 1 });
    }
    saveCart(cartItems);
    Cart.render();
    showToast('Added to cart', product.name, 'success');
  },

  /** Decrement or remove an item. */
  remove(productId) {
    const idx = cartItems.findIndex((i) => i.id === productId);
    if (idx === -1) return;
    if (cartItems[idx].qty > 1) {
      cartItems[idx].qty -= 1;
    } else {
      cartItems.splice(idx, 1);
    }
    saveCart(cartItems);
    Cart.render();
  },

  /** Completely remove a product regardless of quantity. */
  delete(productId) {
    cartItems = cartItems.filter((i) => i.id !== productId);
    saveCart(cartItems);
    Cart.render();
  },

  /** Empty the entire cart. */
  clear() {
    cartItems = [];
    saveCart(cartItems);
    Cart.render();
  },

  /** Total number of individual items (sum of qty). */
  count() {
    return cartItems.reduce((acc, i) => acc + i.qty, 0);
  },

  /** Total price in Naira (kobo = × 100 when sending to Paystack). */
  total() {
    return cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  },

  /** Current cart line items. */
  items() {
    return [...cartItems];
  },

  /** Re-render all cart-related DOM elements. */
  render() {
    updateCartBadge();
    renderCartItems();
    updateCartFooter();
    updateOrderSummary();
    updatePayButton();
  },
};

// ── DOM Helpers ────────────────────────────────────────────────────────────
function formatPrice(kobo) {
  return '₦' + kobo.toLocaleString('en-NG');
}

function updateCartBadge() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = Cart.count();
}

function renderCartItems() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
      </div>`;
    return;
  }

  container.innerHTML = cartItems
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-details">
        <div class="cart-item-name">${escapeHtml(item.name)}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="Cart.remove('${item.id}')" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="Cart.add('${item.id}')" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item-btn" onclick="Cart.delete('${item.id}')" aria-label="Remove ${escapeHtml(item.name)} from cart">🗑️</button>
    </div>`,
    )
    .join('');
}

function updateCartFooter() {
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-display');
  if (!footer || !totalEl) return;

  if (cartItems.length === 0) {
    footer.style.display = 'none';
  } else {
    footer.style.display = '';
    totalEl.textContent = formatPrice(Cart.total());
  }
}

function updateOrderSummary() {
  const container = document.getElementById('order-summary-lines');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = '<div class="order-line"><span>No items</span></div>';
    return;
  }

  const lines = cartItems.map(
    (item) => `
    <div class="order-line">
      <span>${escapeHtml(item.name)} × ${item.qty}</span>
      <span>${formatPrice(item.price * item.qty)}</span>
    </div>`,
  );

  lines.push(`
    <div class="order-line total">
      <span>Total</span>
      <span class="amount">${formatPrice(Cart.total())}</span>
    </div>`);

  container.innerHTML = lines.join('');
}

function updatePayButton() {
  const btn = document.getElementById('pay-btn');
  const txtEl = document.getElementById('pay-btn-text');
  if (!btn || !txtEl) return;
  const total = Cart.total();
  txtEl.textContent = total > 0 ? `Pay ${formatPrice(total)}` : 'Pay Now';
  btn.disabled = total === 0;
}

/** Generate a unique order reference. */
function generateOrderRef() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DE-${ts}-${rand}`;
}

/** Minimal HTML escaping – prevents XSS in dynamic content. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Show a toast notification. */
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      ${message ? `<div class="toast-msg">${escapeHtml(message)}</div>` : ''}
    </div>`;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

// ── Render Product Cards ───────────────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="product-card" data-product-id="${p.id}">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <span class="product-badge">${escapeHtml(p.badge)}</span>
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.description)}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="add-to-cart-btn"
                  onclick="Cart.add('${p.id}')"
                  aria-label="Add ${escapeHtml(p.name)} to cart">
            Add to Cart
          </button>
        </div>
      </div>
    </article>`,
  ).join('');
}

// ── Cart Sidebar Toggle ────────────────────────────────────────────────────
function setupCartUI() {
  const overlay   = document.getElementById('cart-overlay');
  const openBtn   = document.getElementById('open-cart-btn');
  const closeBtn  = document.getElementById('close-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!overlay) return;

  openBtn?.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeCart() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeCart);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCart();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  checkoutBtn?.addEventListener('click', () => {
    closeCart();
    openCheckoutModal();
  });
}

function openCheckoutModal() {
  if (Cart.count() === 0) {
    showToast('Cart is empty', 'Add items before checking out.', 'warning');
    return;
  }
  updateOrderSummary();
  updatePayButton();
  const modal = document.getElementById('checkout-modal');
  modal?.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('first-name')?.focus();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal?.classList.remove('open');
  document.body.style.overflow = '';
}

// Expose globally so inline handlers can reach them.
window.Cart          = Cart;
window.showToast     = showToast;
window.escapeHtml    = escapeHtml;
window.formatPrice   = formatPrice;
window.generateOrderRef = generateOrderRef;
window.openCheckoutModal  = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  Cart.render();
  setupCartUI();

  document.getElementById('modal-close-btn')?.addEventListener('click', closeCheckoutModal);
  document.getElementById('checkout-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'checkout-modal') closeCheckoutModal();
  });
});
