/**
 * Genera og-image.png y logo.jpeg desde los SVG del brandboard.
 * Uso: node scripts/generate-brand-assets.mjs
 */
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const targets = [
  {
    input: path.join(root, 'public', 'og-image.svg'),
    output: path.join(root, 'public', 'og-image.png'),
    width: 1200,
    height: 630,
  },
  {
    input: path.join(root, 'src', 'assets', 'logo', 'logo-mark.svg'),
    output: path.join(root, 'public', 'logo.jpeg'),
    width: 512,
    height: 512,
    format: 'jpeg',
    quality: 92,
  },
  {
    input: path.join(root, 'src', 'assets', 'logo', 'logo-mark.svg'),
    output: path.join(root, 'src', 'assets', 'logo', 'logo.jpeg'),
    width: 512,
    height: 512,
    format: 'jpeg',
    quality: 92,
  },
];

async function renderAsset({ input, output, width, height, format = 'png', quality = 90 }) {
  const svg = await readFile(input);
  let pipeline = sharp(svg, { density: 300 }).resize(width, height, {
    fit: 'contain',
    background: format === 'jpeg' ? '#F7FAFC' : { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else {
    pipeline = pipeline.png({ compressionLevel: 9 });
  }

  const buffer = await pipeline.toBuffer();
  await writeFile(output, buffer);
  console.log(`[brand-assets] ${path.relative(root, output)} (${width}x${height})`);
}

async function main() {
  for (const target of targets) {
    await renderAsset(target);
  }

  // Copias SVG a public para PWA
  await copyFile(
    path.join(root, 'src', 'assets', 'logo', 'logo-icon.svg'),
    path.join(root, 'public', 'logo-icon.svg'),
  );
  console.log('[brand-assets] public/logo-icon.svg');
}

main().catch((err) => {
  console.error('[brand-assets] Error:', err);
  process.exit(1);
});
