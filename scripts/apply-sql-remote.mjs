import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const token = env.SUPABASE_ACCESS_TOKEN;
const projectRef = (env.VITE_SUPABASE_URL || '').match(/https:\/\/([^.]+)/)?.[1] || 'ekqaocauvoajpjyraeyo';
const migrationName = process.argv[2] || '041_courier_panel_schema';
const sqlPath = process.argv[3] || resolve(__dirname, '../supabase/migrations/040_courier_panel.sql');

if (!token) {
  console.error('Falta SUPABASE_ACCESS_TOKEN en .env.local');
  process.exit(1);
}

const query = readFileSync(sqlPath, 'utf8');

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query }),
});

const text = await res.text();
if (!res.ok) {
  console.error('Error', res.status, text);
  process.exit(1);
}
console.log('OK:', migrationName);
console.log(text.slice(0, 500));
