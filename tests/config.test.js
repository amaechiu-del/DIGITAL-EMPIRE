'use strict';

/**
 * config.test.js – Basic configuration & file presence tests.
 *
 * These tests run without Paystack secrets and validate that
 * the project's required files and configuration are in place.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

describe('Required PWA files', () => {
  const required = [
    'index.html',
    'manifest.json',
    'service-worker.js',
    'app.js',
    'offline.html',
    'js/cart.js',
    'js/payment.js',
    'payment-success.html',
    'payment-failed.html',
    '.env.example',
  ];

  for (const file of required) {
    it(`${file} exists`, () => {
      assert.ok(
        fs.existsSync(path.join(ROOT, file)),
        `Expected file to exist: ${file}`,
      );
    });
  }
});

describe('manifest.json', () => {
  it('is valid JSON with required fields', () => {
    const raw = fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8');
    const manifest = JSON.parse(raw);
    for (const key of ['name', 'short_name', 'start_url', 'display', 'icons']) {
      assert.ok(manifest[key], `manifest.json missing field: ${key}`);
    }
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'manifest.json must have at least one icon');
  });
});

describe('.env.example', () => {
  const env = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8');

  it('contains PAYSTACK_PUBLIC_KEY placeholder', () => {
    assert.ok(env.includes('PAYSTACK_PUBLIC_KEY'), '.env.example missing PAYSTACK_PUBLIC_KEY');
  });

  it('contains PAYSTACK_SECRET_KEY placeholder', () => {
    assert.ok(env.includes('PAYSTACK_SECRET_KEY'), '.env.example missing PAYSTACK_SECRET_KEY');
  });
});

describe('index.html', () => {
  it('includes Paystack SDK', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(html.includes('js.paystack.co'), 'index.html must include Paystack SDK script');
  });

  it('includes service worker registration', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(
      html.includes('app.js') || html.includes('serviceWorker'),
      'index.html should reference app.js or service worker',
    );
  });
});

describe('package.json', () => {
  it('has required production dependencies', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    const required = ['express', 'helmet', 'cors', 'dotenv', 'express-rate-limit'];
    for (const dep of required) {
      assert.ok(pkg.dependencies?.[dep], `package.json missing dependency: ${dep}`);
    }
  });
});
