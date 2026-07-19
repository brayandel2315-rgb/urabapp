/**
 * Iconos trust del home COMPLETOS (ilustración + texto) → PNG transparentes.
 * Sin recortar el contenido; solo quita la placa blanca exterior.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'src', 'assets', 'home');
const assetsDir = 'C:\\Users\\braya\\.cursor\\projects\\d-AREA-DE-TRABAJO-Urabapp\\assets';

const jobs = [
  {
    key: 'entrega-estimada',
    file: 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-0db2a766-f33d-41e3-932c-0281392f2b1c.png',
  },
  {
    key: 'tiendas-abiertas',
    file: 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-8b27cf33-fbb4-46fa-a3c2-9fccb7fa043b.png',
  },
  {
    key: 'pago-seguro',
    file: 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-3278cc05-ff2d-4f43-8cbc-e0c786baa38b.png',
  },
  {
    key: 'soporte-24-7',
    file: 'c__Users_braya_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-f84c9f04-0f6a-4829-9c55-0331a9e8811d.png',
  },
];

/** Solo papel/blanco neutro (no menta/verde claro del diseño). */
function isPaper(r, g, b, a) {
  if (a < 18) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  // blanco / gris muy claro sin tinte verde
  if (min > 236 && chroma < 22) return true;
  if (min > 228 && chroma < 14) return true;
  // sombra suave grisácea del mock
  if (min > 210 && chroma < 10 && max < 245) return true;
  return false;
}

function processPixels(data, w, h) {
  const px = Buffer.from(data);
  const visited = new Uint8Array(w * h);
  const q = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    const i = p * 4;
    if (!isPaper(px[i], px[i + 1], px[i + 2], px[i + 3])) return;
    visited[p] = 1;
    q.push(x, y);
  };

  // Solo desde bordes (no sembrar en el centro: preserva cajas menta internas)
  for (let x = 0; x < w; x += 1) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y);
    push(w - 1, y);
  }

  while (q.length) {
    const y = q.pop();
    const x = q.pop();
    px[(y * w + x) * 4 + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  // Halo blanco en el borde del sujeto
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      const i = (y * w + x) * 4;
      if (px[i + 3] === 0) continue;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const edge =
        px[(y * w + (x - 1)) * 4 + 3] === 0 ||
        px[(y * w + (x + 1)) * 4 + 3] === 0 ||
        px[((y - 1) * w + x) * 4 + 3] === 0 ||
        px[((y + 1) * w + x) * 4 + 3] === 0;

      if (edge && min > 232 && max - min < 18) {
        px[i + 3] = 0;
      }
    }
  }

  return px;
}

async function run() {
  for (const job of jobs) {
    const input = path.join(assetsDir, job.file);
    const { data, info } = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const cleaned = processPixels(data, info.width, info.height);
    const fullPath = path.join(outDir, `${job.key}.png`);
    const iconPath = path.join(outDir, `${job.key}-icon.png`);

    await sharp(cleaned, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .trim({ threshold: 8 })
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(fullPath);

    await sharp(fullPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(iconPath);

    console.log(`[trust-icons] full ${job.key}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
