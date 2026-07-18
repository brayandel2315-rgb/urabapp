#!/usr/bin/env node
/**
 * Aplica un archivo SQL grande vía Supabase Management API (SQL).
 * Requiere: VITE_SUPABASE_URL o SUPABASE_URL + SUPABASE_ACCESS_TOKEN
 * Fallback: imprime instrucciones si no hay token.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnvLocal() {
  const path = join(root, '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim().replace(/^["']|["']$/g, '');
    if (!process.env[key.trim()]) process.env[key.trim()] = value;
  }
}

loadEnvLocal();

const fileArg = process.argv[2];
if (!fileArg) {
  console.error('Uso: node scripts/apply-sql-file.mjs <path.sql>');
  process.exit(1);
}

const sqlPath = resolve(root, fileArg);
const sql = readFileSync(sqlPath, 'utf8');
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const projectRef = url.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!projectRef || !token) {
  console.error('Falta SUPABASE_ACCESS_TOKEN o project ref (VITE_SUPABASE_URL).');
  console.error('Alternativa: aplicar con MCP apply_migration / Dashboard SQL editor.');
  process.exit(2);
}

const endpoint = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
console.log(`Aplicando ${fileArg} (${sql.length} chars) a ${projectRef}...`);

const res = await fetch(endpoint, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
});

const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}: ${text.slice(0, 800)}`);
  process.exit(1);
}
console.log('✅ SQL aplicado');
if (text && text !== '[]') console.log(text.slice(0, 400));
