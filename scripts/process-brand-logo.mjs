/**
 * Quita fondo negro del logo Urabapp y publica PNG transparentes (UI + PWA).
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const input = path.join(root, 'src', 'assets', 'logo', 'urabapp-logo.png');

const TRANSPARENT_OUTPUTS = [
  path.join(root, 'src', 'assets', 'logo', 'urabapp-logo-transparent.png'),
  path.join(root, 'public', 'urabapp-logo.png'),
  path.join(root, 'public', 'urabapp-logo-transparent.png'),
];

const ICON_SIZES = [192, 512];

const HOLE_FILL_DEPTH = 28;

function isBgCandidate(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max <= 72 && (max - min) <= 42;
}

function idx(x, y, w) {
  return (y * w + x) * 4;
}

function buildProtectedMask(data, width, height) {
  const protectedMask = new Uint8Array(width * height);
  const queue = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      const i = idx(x, y, width);
      if (!isBgCandidate(data[i], data[i + 1], data[i + 2])) {
        protectedMask[p] = 1;
        queue.push([p, 0]);
      }
    }
  }

  while (queue.length) {
    const [p, depth] = queue.shift();
    if (depth >= HOLE_FILL_DEPTH) continue;
    const x = p % width;
    const y = (p - x) / width;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (protectedMask[np]) continue;
      const i = idx(nx, ny, width);
      if (!isBgCandidate(data[i], data[i + 1], data[i + 2])) continue;
      protectedMask[np] = 1;
      queue.push([np, depth + 1]);
    }
  }

  return protectedMask;
}

function floodBackgroundMask(data, width, height, protectedMask) {
  const mask = new Uint8Array(width * height);
  const queue = [];

  const seed = (x, y) => {
    const p = y * width + x;
    if (protectedMask[p]) return;
    const i = idx(x, y, width);
    if (!isBgCandidate(data[i], data[i + 1], data[i + 2])) return;
    if (mask[p]) return;
    mask[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % width;
    const y = (p - x) / width;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (mask[np] || protectedMask[np]) continue;
      const i = idx(nx, ny, width);
      if (!isBgCandidate(data[i], data[i + 1], data[i + 2])) continue;
      mask[np] = 1;
      queue.push(np);
    }
  }

  return mask;
}

function applyMask(data, mask) {
  for (let p = 0; p < mask.length; p += 1) {
    if (!mask[p]) continue;
    const i = p * 4;
    data[i + 3] = 0;
  }
}

async function buildTransparentLogo() {
  const inputBuf = await readFile(input);
  const { data, info } = await sharp(inputBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  const protectedMask = buildProtectedMask(pixels, info.width, info.height);
  const mask = floodBackgroundMask(pixels, info.width, info.height, protectedMask);
  applyMask(pixels, mask);

  return sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 12 })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
}

async function writeAppIcon(trimmedBuf, size, outputPath) {
  const icon = await sharp(trimmedBuf)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  await writeFile(outputPath, icon);
}

async function main() {
  const trimmed = await buildTransparentLogo();

  for (const out of TRANSPARENT_OUTPUTS) {
    await writeFile(out, trimmed);
    console.log(`[brand-logo] OK → ${path.relative(root, out)}`);
  }

  const appIconPath = path.join(root, 'public', 'app-icon.png');
  await writeAppIcon(trimmed, 512, appIconPath);
  console.log(`[brand-logo] OK → ${path.relative(root, appIconPath)} (512)`);

  const appleIconPath = path.join(root, 'public', 'apple-touch-icon.png');
  await writeAppIcon(trimmed, 180, appleIconPath);
  console.log(`[brand-logo] OK → ${path.relative(root, appleIconPath)} (180)`);
}

main().catch((err) => {
  console.error('[brand-logo] Error:', err);
  process.exit(1);
});
