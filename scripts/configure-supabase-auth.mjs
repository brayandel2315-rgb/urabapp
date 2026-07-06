#!/usr/bin/env node
/**
 * Configura Site URL + Redirect URLs en Supabase Auth (solo esos campos).
 * Usa Management API — no toca storage, MFA ni email.
 *
 * Token: SUPABASE_ACCESS_TOKEN en .env.local o sesión `npx supabase login`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const PROJECT_REF = 'ekqaocauvoajpjyraeyo';
const DEFAULT_APP_URL = 'https://urabapp.vercel.app';

const REDIRECT_URLS = [
  'https://urabapp.vercel.app/**',
  'http://localhost:5173/**',
  'http://127.0.0.1:5173/**',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

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

function getAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
  }
  const candidates = [
    join(homedir(), '.supabase', 'access-token'),
    join(homedir(), 'AppData', 'Roaming', 'supabase', 'access-token'),
  ];
  for (const path of candidates) {
    try {
      const token = readFileSync(path, 'utf8').trim();
      if (token) return token;
    } catch {
      /* siguiente */
    }
  }
  return null;
}

async function managementApi(path, { method = 'GET', body } = {}) {
  const token = getAccessToken();
  if (!token) {
    throw new Error(
      'Sin token de Management API. Ejecuta: npx supabase login\n' +
      'O agrega SUPABASE_ACCESS_TOKEN en .env.local (Dashboard → Account → Access Tokens)'
    );
  }
  const res = await fetch(`https://api.supabase.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`Management API ${res.status}: ${typeof data === 'object' ? JSON.stringify(data) : data}`);
  }
  return data;
}

function mergeRedirectUrls(current, appUrl) {
  const required = new Set([
    `${appUrl}/**`,
    `${appUrl}`,
    ...REDIRECT_URLS,
  ]);
  const existing = (current || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const url of existing) required.add(url);
  return [...required].join(',');
}

async function pushViaCli(appUrl) {
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(
    'npx',
    ['supabase', 'config', 'push', '--project-ref', PROJECT_REF, '--yes'],
    { cwd: root, encoding: 'utf8', shell: true }
  );
  const out = `${result.stdout || ''}\n${result.stderr || ''}`;
  const authOk = /Remote Auth config is up to date|Updating Auth service/.test(out);
  const storage402 = /402|vector buckets/.test(out);
  if (result.status === 0 || (authOk && storage402)) {
    console.log('✅ Auth configurado vía Supabase CLI.');
    console.log(`   Site URL: ${appUrl}`);
    console.log(`   Dashboard: https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration\n`);
    return true;
  }
  if (out.trim()) console.error(out);
  return false;
}

function resolveAppUrl() {
  if (process.argv[2]) return process.argv[2].replace(/\/$/, '');
  const fromEnv = process.env.VITE_APP_URL;
  if (fromEnv && !/localhost|127\.0\.0\.1/.test(fromEnv)) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEFAULT_APP_URL;
}

async function main() {
  loadEnvLocal();
  const appUrl = resolveAppUrl();

  console.log('\n=== Urabapp · Configurar Supabase Auth ===\n');
  console.log(`Proyecto:  ${PROJECT_REF}`);
  console.log(`Site URL:  ${appUrl}`);

  try {
    const current = await managementApi(`/projects/${PROJECT_REF}/config/auth`);
    const uriAllowList = mergeRedirectUrls(current.uri_allow_list, appUrl);

    console.log('Redirects:');
    for (const url of uriAllowList.split(',').map((s) => s.trim()).filter(Boolean)) {
      console.log(`  - ${url}`);
    }
    console.log('');

    const updated = await managementApi(`/projects/${PROJECT_REF}/config/auth`, {
      method: 'PATCH',
      body: {
        site_url: appUrl,
        uri_allow_list: uriAllowList,
      },
    });

    console.log('✅ Auth actualizado en Supabase (Management API).');
    console.log(`   Site URL: ${updated.site_url || appUrl}`);
    console.log(`   Dashboard: https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration\n`);
  } catch (apiErr) {
    console.log(`Management API: ${apiErr.message}`);
    console.log('Intentando vía Supabase CLI...\n');
    const ok = await pushViaCli(appUrl);
    if (!ok) throw apiErr;
  }
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}\n`);
  process.exit(1);
});
