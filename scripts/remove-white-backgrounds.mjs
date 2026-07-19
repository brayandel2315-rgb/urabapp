/**
 * Quita fondo blanco/claro del logo brand y del hero 3D (PNG transparente).
 * Optimizado: resize previo + BFS con índice (sin Array.shift).
 */
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HOLE_FILL_DEPTH = 16;

function idx(x, y, w) {
  return (y * w + x) * 4;
}

function isWhiteBg(r, g, b, a = 255) {
  if (a < 8) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return min >= 228 && (max - min) <= 32;
}

function buildProtectedMask(data, width, height) {
  const protectedMask = new Uint8Array(width * height);
  const queue = new Int32Array(width * height * 2);
  let qh = 0;
  let qt = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      const i = idx(x, y, width);
      if (!isWhiteBg(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        protectedMask[p] = 1;
        queue[qt++] = p;
        queue[qt++] = 0;
      }
    }
  }

  while (qh < qt) {
    const p = queue[qh++];
    const depth = queue[qh++];
    if (depth >= HOLE_FILL_DEPTH) continue;
    const x = p % width;
    const y = (p - x) / width;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (protectedMask[np]) continue;
      const i = idx(nx, ny, width);
      if (!isWhiteBg(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
      protectedMask[np] = 1;
      queue[qt++] = np;
      queue[qt++] = depth + 1;
    }
  }

  return protectedMask;
}

function floodBackgroundMask(data, width, height, protectedMask) {
  const mask = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qh = 0;
  let qt = 0;

  const seed = (x, y) => {
    const p = y * width + x;
    if (protectedMask[p] || mask[p]) return;
    const i = idx(x, y, width);
    if (!isWhiteBg(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
    mask[p] = 1;
    queue[qt++] = p;
  };

  for (let x = 0; x < width; x += 1) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (qh < qt) {
    const p = queue[qh++];
    const x = p % width;
    const y = (p - x) / width;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (mask[np] || protectedMask[np]) continue;
      const i = idx(nx, ny, width);
      if (!isWhiteBg(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
      mask[np] = 1;
      queue[qt++] = np;
    }
  }

  return mask;
}

function applyMask(data, mask) {
  for (let p = 0; p < mask.length; p += 1) {
    if (!mask[p]) continue;
    data[p * 4 + 3] = 0;
  }
}

function featherNearWhite(data, mask, width, height) {
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      if (mask[p]) continue;
      const i = p * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      if (min < 205 || max - min > 42) continue;
      let nearBg = false;
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (mask[ny * width + nx]) {
          nearBg = true;
          break;
        }
      }
      if (!nearBg) continue;
      const whiteness = (min - 205) / 50;
      data[i + 3] = Math.max(0, Math.min(255, Math.round(data[i + 3] * (1 - whiteness * 0.9))));
    }
  }
}

async function removeWhiteBackground(inputPath, { trim = true, maxEdge = 0 } = {}) {
  let pipeline = sharp(await readFile(inputPath)).ensureAlpha();
  if (maxEdge > 0) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  console.log(`[transparent] processing ${path.basename(inputPath)} ${info.width}x${info.height}`);

  const pixels = Buffer.from(data);
  const protectedMask = buildProtectedMask(pixels, info.width, info.height);
  const mask = floodBackgroundMask(pixels, info.width, info.height, protectedMask);
  applyMask(pixels, mask);
  featherNearWhite(pixels, mask, info.width, info.height);

  let out = sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
  if (trim) out = out.trim({ threshold: 8 });
  return out.png({ compressionLevel: 9 }).toBuffer();
}

async function writeAppIcon(trimmedBuf, size, outputPath) {
  const icon = await sharp(trimmedBuf)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(outputPath, icon);
}

async function main() {
  const brandMaster = path.join(root, 'src', 'assets', 'logo', 'urabapp-logo-brand-master.png');
  const brandSrc = path.join(root, 'src', 'assets', 'logo', 'urabapp-logo-brand.png');

  let brandInput = brandMaster;
  try {
    await readFile(brandMaster);
  } catch {
    brandInput = brandSrc;
  }

  const brandTransparent = await removeWhiteBackground(brandInput, { trim: true, maxEdge: 1600 });

  const brandOutputs = [
    path.join(root, 'src', 'assets', 'logo', 'urabapp-logo-brand.png'),
    path.join(root, 'public', 'urabapp-logo-brand.png'),
    path.join(root, 'public', 'urabapp-logo.png'),
    path.join(root, 'public', 'urabapp-logo-transparent.png'),
    path.join(root, 'src', 'assets', 'logo', 'urabapp-logo-transparent.png'),
  ];

  for (const out of brandOutputs) {
    await writeFile(out, brandTransparent);
    console.log(`[transparent] logo → ${path.relative(root, out)}`);
  }

  await writeAppIcon(brandTransparent, 512, path.join(root, 'public', 'app-icon.png'));
  await writeAppIcon(brandTransparent, 180, path.join(root, 'public', 'apple-touch-icon.png'));
  console.log('[transparent] app icons updated');

  const heroOriginal = path.join(root, 'public', 'uraba', 'hero-uraba-3d-original.png');
  const heroOut = path.join(root, 'public', 'uraba', 'hero-uraba-3d.png');
  let heroInput = heroOriginal;
  try {
    await readFile(heroOriginal);
  } catch {
    heroInput = heroOut;
    try {
      await copyFile(heroOut, heroOriginal);
    } catch {
      /* ignore */
    }
  }

  const heroTransparent = await removeWhiteBackground(heroInput, { trim: true, maxEdge: 1400 });
  await writeFile(heroOut, heroTransparent);
  console.log('[transparent] hero → public/uraba/hero-uraba-3d.png');
}

main().catch((err) => {
  console.error('[transparent] Error:', err);
  process.exit(1);
});
