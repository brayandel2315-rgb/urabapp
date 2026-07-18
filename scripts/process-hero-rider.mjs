/**
 * Hero mensajero en moto: si ya trae transparencia, solo recorta; si no, quita fondo negro de bordes.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'public', 'uraba', 'hero-rider-moto.png');
const output = path.join(root, 'public', 'uraba', 'hero-rider-moto-transparent.png');

function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (max <= 12) return true;
  if (max <= 20 && delta <= 6) return true;
  return false;
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const idx = (x, y) => y * w + x;

const cornerSamples = [
  [0, 0],
  [w - 1, 0],
  [0, h - 1],
  [w - 1, h - 1],
];
const transparentCorners = cornerSamples.filter(([x, y]) => data[idx(x, y) * 4 + 3] < 20).length;

if (transparentCorners >= 3) {
  await sharp(input).png().trim({ threshold: 12 }).toFile(output);
  console.log(`[hero-rider] transparent source → ${output}`);
  process.exit(0);
}

const total = w * h;
const visited = new Uint8Array(total);
const clear = new Uint8Array(total);
const queue = [];

const read = (x, y) => {
  const i = idx(x, y) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};

for (let x = 0; x < w; x += 1) {
  queue.push([x, 0], [x, h - 1]);
}
for (let y = 0; y < h; y += 1) {
  queue.push([0, y], [w - 1, y]);
}

while (queue.length > 0) {
  const [x, y] = queue.pop();
  if (x < 0 || x >= w || y < 0 || y >= h) continue;

  const id = idx(x, y);
  if (visited[id]) continue;
  visited[id] = 1;

  const [r, g, b] = read(x, y);
  if (!isBackgroundPixel(r, g, b)) continue;

  clear[id] = 1;
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

for (let id = 0; id < total; id += 1) {
  if (clear[id]) {
    data[id * 4 + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: w, height: h, channels: 4 },
})
  .png()
  .trim({ threshold: 12 })
  .toFile(output);

console.log(`[hero-rider] flood-fill → ${output}`);
