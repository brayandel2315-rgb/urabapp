/**
 * Descarga fotos de Wikimedia Commons a public/uraba (opcional).
 * Wikimedia limita peticiones masivas — este script espera 5s entre archivos.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'uraba');

const FILES = [
  { name: 'nuestro-uraba.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nuestro-uraba-191115b.jpg' },
  { name: 'bananeras-apartado.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Apartad%C3%B3_bananeras.jpg' },
  { name: 'apartado-ciudad.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Apartad%C3%B3_pictures.jpg' },
  { name: 'playa-turbo.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Amanecer_Playa_Simona-Turbo_Antioquia.jpg' },
  { name: 'camara-comercio-uraba.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Camara_de_Comercio_de_Urab%C3%A1.jpg' },
  { name: 'turbo-costa.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Turbouraba1.jpg' },
  { name: 'banano-cultivo.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Colbanana09.jpg' },
  { name: 'via-troncal-turbo.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Via_turbo_-_panoramio.jpg' },
  { name: 'necocli-costa.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Wedding_Sunset_Sea_%28214618179%29.jpeg' },
  {
    name: 'mapa-uraba-uhd.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Golfo_de_Urab%C3%A1_y_delta_del_Atrato.JPG/1280px-Golfo_de_Urab%C3%A1_y_delta_del_Atrato.JPG',
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await mkdir(OUT, { recursive: true });

for (const file of FILES) {
  const dest = join(OUT, file.name);
  try {
    const res = await fetch(file.url, {
      headers: { 'User-Agent': 'Urabapp/1.0 (fetch-uraba-images; CC attribution)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    console.log(`OK ${file.name} (${buf.length} bytes)`);
  } catch (err) {
    console.warn(`SKIP ${file.name}: ${err.message}`);
  }
  await sleep(5000);
}

console.log('Listo. Ver public/uraba/ATTRIBUTION.txt');
