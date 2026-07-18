#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sql = readFileSync(join(root, 'supabase/migrations/109_seed_uraba_5_municipios.sql'), 'utf8');
const out = join(root, 'scripts/.tmp-seed');
mkdirSync(out, { recursive: true });

const bizStart = sql.indexOf('INSERT INTO public.businesses');
const prodStart = sql.indexOf('INSERT INTO public.products');
const enableStart = sql.indexOf('ALTER TABLE public.businesses ENABLE TRIGGER');

if (bizStart < 0 || prodStart < 0 || enableStart < 0) {
  console.error('markers not found', { bizStart, prodStart, enableStart });
  process.exit(1);
}

const disable = 'ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;';
const businesses = sql.slice(bizStart, prodStart).trim();
const products = sql.slice(prodStart, enableStart).trim();
const enable = sql.slice(enableStart).trim();

writeFileSync(join(out, '01-disable.sql'), `${disable}\n`);
writeFileSync(join(out, '02-businesses.sql'), `${businesses}\n`);

const headerEnd = products.indexOf('VALUES') + 6;
const header = products.slice(0, headerEnd);
const conflictIdx = products.indexOf('ON CONFLICT');
const conflict = conflictIdx >= 0 ? products.slice(conflictIdx) : ';';
const body = products.slice(headerEnd, conflictIdx >= 0 ? conflictIdx : undefined).trim().replace(/,\s*$/, '');

const rows = [];
let depth = 0;
let start = 0;
for (let i = 0; i < body.length; i += 1) {
  const ch = body[i];
  if (ch === '(') depth += 1;
  if (ch === ')') {
    depth -= 1;
    if (depth === 0) {
      const row = body.slice(start, i + 1).replace(/^[\s,]+/, '').trim();
      if (row.startsWith('(')) rows.push(row);
      start = i + 1;
    }
  }
}

console.log('product rows', rows.length);
const batchSize = 35;
let part = 0;
for (let i = 0; i < rows.length; i += batchSize) {
  part += 1;
  const batch = rows.slice(i, i + batchSize).join(',\n');
  const q = `${header}\n${batch}\n${conflict}\n`;
  writeFileSync(join(out, `03-products-${String(part).padStart(2, '0')}.sql`), q);
}

writeFileSync(join(out, '99-enable.sql'), `${enable}\n`);
console.log(`wrote ${part} product batches to ${out}`);
