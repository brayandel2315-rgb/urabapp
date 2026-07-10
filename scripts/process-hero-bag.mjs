/**
 * Quita fondo claro del PNG del morral hero → PNG transparente recortado.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'public', 'uraba', 'hero-delivery-bag.png');
const output = path.join(root, 'public', 'uraba', 'hero-delivery-bag-transparent.png');

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;

  const isNearWhite = max >= 210 && saturation <= 48;
  const isLightGreenWash = g >= 205 && g > r + 6 && g > b + 4 && max >= 200;
  const isPaleMint = r >= 215 && g >= 225 && b >= 215 && saturation <= 35;

  if (isNearWhite || isLightGreenWash || isPaleMint) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .trim({ threshold: 8 })
  .toFile(output);

console.log(`[hero-bag] ${output}`);
