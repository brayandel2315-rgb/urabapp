/**
 * Optimiza iconos de servicios pesados (envios.png, etc.)
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.join(__dirname, '..', 'src', 'assets', 'services');
const TARGET = 256;
const MAX_BYTES = 180_000;

async function optimizeFile(filePath) {
  const before = (await stat(filePath)).size;
  if (before <= MAX_BYTES) {
    console.log(`skip ${path.basename(filePath)} (${before} bytes)`);
    return;
  }

  const out = await sharp(filePath)
    .resize(TARGET, TARGET, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 80 })
    .toBuffer();

  await writeFile(filePath, out);
  console.log(`ok ${path.basename(filePath)}: ${before} → ${out.length} bytes`);
}

const files = await readdir(servicesDir).catch(() => []);
for (const name of files.filter((f) => f.endsWith('.png'))) {
  await optimizeFile(path.join(servicesDir, name));
}
