/**
 * Quita fondo negro de iconos 3D → PNG transparente.
 * Flood-fill desde bordes + relleno de huecos oscuros dentro del icono (llantas, pelo).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.join(__dirname, '..', 'src', 'assets', 'services');
const assetsDir = 'C:\\Users\\braya\\.cursor\\projects\\d-AREA-DE-TRABAJO-Urabapp\\assets';

const ORIGINALS = {
  envios: 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_envios-2f1f7044-437c-4424-8fbc-631969fa7a2e.png',
  soporte: 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-208a60cc-4bb3-4aef-adf4-36aad48dbe13.png',
};

const HOLE_FILL_DEPTH = 32;

function isBgCandidate(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max <= 52 && (max - min) <= 34;
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

  // Rellena huecos oscuros dentro del sujeto (llantas, pelo, micrófono)
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
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const fade = Math.min(1, max / 52);
    data[i + 3] = Math.round(data[i + 3] * fade * fade);
  }
}

async function removeBackground(filePath) {
  const input = await readFile(filePath);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  const protectedMask = buildProtectedMask(pixels, info.width, info.height);
  const mask = floodBackgroundMask(pixels, info.width, info.height, protectedMask);
  applyMask(pixels, mask);

  const output = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

  await writeFile(filePath, output);
  console.log(`[service-icons] ${path.basename(filePath)} → OK`);
}

async function restoreAffected() {
  for (const [name, file] of Object.entries(ORIGINALS)) {
    const src = path.join(assetsDir, file);
    const dest = path.join(servicesDir, `${name}.png`);
    const buf = await readFile(src);
    await writeFile(dest, buf);
    console.log(`[service-icons] restaurado: ${name}.png`);
  }
}

async function main() {
  if (process.argv.includes('--restore-affected')) {
    await restoreAffected();
    for (const name of Object.keys(ORIGINALS)) {
      await removeBackground(path.join(servicesDir, `${name}.png`));
    }
    return;
  }

  const files = (await readdir(servicesDir)).filter((f) => f.endsWith('.png'));
  for (const file of files) {
    await removeBackground(path.join(servicesDir, file));
  }
}

main().catch((err) => {
  console.error('[service-icons] Error:', err);
  process.exit(1);
});
