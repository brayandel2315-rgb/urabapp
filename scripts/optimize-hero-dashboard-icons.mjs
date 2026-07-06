/**
 * Optimiza iconos 3D del dashboard hero → PNG pequeños y transparentes.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'src', 'assets', 'hero-dashboard');
const assetsDir = 'C:\\Users\\braya\\.cursor\\projects\\d-AREA-DE-TRABAJO-Urabapp\\assets';

const SOURCES = {
  'entrega-rapida': 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-340d0344-7bab-4e5d-855c-edbbab41ed9f.png',
  'tiendas-abiertas': 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-1b5f6278-2ee2-4074-b465-776f597dbae7.png',
  'envios-hoy': 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-7dcfbd8f-4cce-409c-b741-01477209cccd.png',
  'oferta-dia': 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-81e10045-5b4f-433d-b2eb-2d0c229fb390.png',
};

const BG_MODE = {
  'entrega-rapida': 'dark',
  'tiendas-abiertas': 'light',
  'envios-hoy': 'light',
  'oferta-dia': 'light',
};

const TARGET = 128;

function idx(x, y, w) {
  return (y * w + x) * 4;
}

function isDarkBg(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max <= 52 && (max - min) <= 34;
}

function isLightBg(r, g, b) {
  const min = Math.min(r, g, b);
  return min >= 238 && Math.max(r, g, b) - min <= 18;
}

function floodMask(data, width, height, mode) {
  const isBg = mode === 'dark' ? isDarkBg : isLightBg;
  const mask = new Uint8Array(width * height);
  const queue = [];

  const seed = (x, y) => {
    const p = y * width + x;
    const i = idx(x, y, width);
    if (!isBg(data[i], data[i + 1], data[i + 2]) || mask[p]) return;
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
    const p = queue.shift();
    const x = p % width;
    const y = (p - x) / width;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (mask[np]) continue;
      const i = idx(nx, ny, width);
      if (!isBg(data[i], data[i + 1], data[i + 2])) continue;
      mask[np] = 1;
      queue.push(np);
    }
  }

  return mask;
}

async function processIcon(name, fileName) {
  const input = path.join(assetsDir, fileName);
  const { data, info } = await sharp(input)
    .resize(TARGET, TARGET, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mask = floodMask(data, info.width, info.height, BG_MODE[name]);
  for (let p = 0; p < mask.length; p += 1) {
    if (mask[p]) data[idx(p % info.width, (p - (p % info.width)) / info.width, info.width) + 3] = 0;
  }

  const out = path.join(outDir, `${name}.png`);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toFile(out);

  const stat = await readFile(out);
  console.log(`[hero-dashboard] ${name}.png → ${(stat.length / 1024).toFixed(1)} KB`);
}

await mkdir(outDir, { recursive: true });
for (const [name, file] of Object.entries(SOURCES)) {
  await processIcon(name, file);
}
