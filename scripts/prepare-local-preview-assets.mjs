/**
 * Descarga assets visuales a public/previews/ para revisión local en Vite.
 * Imágenes de stock (Unsplash / picsum) — catálogo demo.
 */
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'previews');

/** Fuentes estables (picsum + unsplash conocidos) con fallback */
const ASSETS = {
  'cover-mercado.jpg': [
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1400&h=700&fit=crop&q=85',
    'https://picsum.photos/seed/uraba-mercado/1400/700',
  ],
  'cover-farmacia.jpg': [
    'https://images.unsplash.com/photo-1576602975982-48f9fb0b5315?w=1400&h=700&fit=crop&q=85',
    'https://picsum.photos/seed/uraba-farmacia/1400/700',
  ],
  'cover-comida.jpg': [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&h=700&fit=crop&q=85',
    'https://picsum.photos/seed/uraba-comida/1400/700',
  ],
  'logo-mercado.png': [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=85',
    'https://picsum.photos/seed/logo-mercado/400/400',
  ],
  'logo-farmacia.png': [
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop&q=85',
    'https://picsum.photos/seed/logo-farmacia/400/400',
  ],
  'logo-comida.png': [
    'https://images.unsplash.com/photo-1626082927389-6c245bec07ff?w=400&h=400&fit=crop&q=85',
    'https://picsum.photos/seed/logo-comida/400/400',
  ],
  'p-frescos.jpg': [
    'https://images.unsplash.com/photo-1610831308542-7b1b7bdfc4fd?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-frescos/600/600',
  ],
  'p-lacteos.jpg': [
    'https://images.unsplash.com/photo-1628088062851-3383456e70bb?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-lacteos/600/600',
  ],
  'p-despensa.jpg': [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-despensa/600/600',
  ],
  'p-aseo.jpg': [
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-aseo/600/600',
  ],
  'p-bebidas.jpg': [
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-bebidas/600/600',
  ],
  'p-combos.jpg': [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-combos/600/600',
  ],
  'p-farmacia.jpg': [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-farmacia/600/600',
  ],
  'p-cuidado.jpg': [
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-cuidado/600/600',
  ],
  'p-pollo.jpg': [
    'https://images.unsplash.com/photo-1626082927389-6c245bec07ff?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-pollo/600/600',
  ],
  'p-burger.jpg': [
    'https://images.unsplash.com/photo-1568901340865-4c42c4bd3921?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-burger/600/600',
  ],
  'p-fries.jpg': [
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-fries/600/600',
  ],
  'p-drink.jpg': [
    'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-drink/600/600',
  ],
  'p-default.jpg': [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop&q=85',
    'https://picsum.photos/seed/p-default/600/600',
  ],
};

async function downloadOne(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'UrabApp-LocalPreview/1.0' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function download(name, urls) {
  const dest = join(outDir, name);
  if (existsSync(dest)) {
    console.log(`[asset] ${name} skip`);
    return;
  }
  let lastErr;
  for (const url of urls) {
    try {
      await downloadOne(url, dest);
      console.log(`[asset] ${name} ok`);
      return;
    } catch (e) {
      lastErr = e;
      console.warn(`[asset] ${name} fail ${url.slice(0, 60)}… (${e.message})`);
    }
  }
  throw lastErr || new Error(`No source for ${name}`);
}

mkdirSync(outDir, { recursive: true });

let failed = 0;
for (const [name, urls] of Object.entries(ASSETS)) {
  try {
    await download(name, urls);
  } catch (e) {
    failed += 1;
    console.error(`[asset] ${name} FATAL`, e.message);
  }
}

const files = Object.keys(ASSETS);
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({ files, generated_at: new Date().toISOString() }, null, 2));
console.log(`[asset] done failed=${failed} dir=${outDir}`);
if (failed) process.exit(1);
