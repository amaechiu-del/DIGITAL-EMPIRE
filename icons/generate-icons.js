#!/usr/bin/env node
/**
 * generate-icons.js
 * Run once: node generate-icons.js
 * Generates placeholder PNG icons for the PWA manifest.
 * Requires: npm install canvas (or use any image tool)
 *
 * If you don't want to install canvas, replace these PNGs
 * with real app icons using a design tool such as Figma or Adobe XD.
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = __dirname;

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

sizes.forEach((size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#1a1a6e');
  grad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.18);
  ctx.fill();

  // "DE" text
  ctx.fillStyle = '#f59e0b';
  ctx.font = `bold ${Math.round(size * 0.35)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DE', size / 2, size / 2);

  const buffer = canvas.toBuffer('image/png');
  const file = path.join(outDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(file, buffer);
  console.log(`Generated ${file}`);
});

console.log('All icons generated!');
