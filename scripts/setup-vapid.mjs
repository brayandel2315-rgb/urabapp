#!/usr/bin/env node
/**
 * Genera par VAPID y actualiza .env.local + supabase/functions/.env.secrets
 * Uso: npm run setup:vapid
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envLocal = resolve(root, '.env.local');
const secretsFile = resolve(root, 'supabase/functions/.env.secrets');
const exampleSecrets = resolve(root, 'supabase/functions/.env.secrets.example');

function upsertEnvLine(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(content)) return content.replace(re, line);
  return `${content.trimEnd()}\n${line}\n`;
}

let output = '';
try {
  output = execSync('npx web-push generate-vapid-keys', { encoding: 'utf8' });
} catch (err) {
  console.error('Instala web-push: npm install -D web-push');
  process.exit(1);
}

const publicKey = output.match(/Public Key:\s*(\S+)/)?.[1];
const privateKey = output.match(/Private Key:\s*(\S+)/)?.[1];

if (!publicKey || !privateKey) {
  console.error('No se pudieron leer las claves VAPID');
  process.exit(1);
}

if (existsSync(envLocal)) {
  let local = readFileSync(envLocal, 'utf8');
  local = upsertEnvLine(local, 'VITE_VAPID_PUBLIC_KEY', publicKey);
  writeFileSync(envLocal, local, 'utf8');
  console.log(`✓ VITE_VAPID_PUBLIC_KEY → .env.local`);
} else {
  console.warn('⚠ No existe .env.local — copia .env.example primero');
}

let secrets = existsSync(secretsFile)
  ? readFileSync(secretsFile, 'utf8')
  : existsSync(exampleSecrets)
    ? readFileSync(exampleSecrets, 'utf8')
    : '';

secrets = upsertEnvLine(secrets, 'VAPID_PUBLIC_KEY', publicKey);
secrets = upsertEnvLine(secrets, 'VAPID_PRIVATE_KEY', privateKey);
if (!/^VAPID_SUBJECT=/m.test(secrets)) {
  secrets = upsertEnvLine(secrets, 'VAPID_SUBJECT', 'mailto:brayandel001@gmail.com');
}
if (!/^APP_URL=/m.test(secrets)) {
  secrets = upsertEnvLine(secrets, 'APP_URL', 'http://localhost:5173');
}

writeFileSync(secretsFile, secrets, 'utf8');
console.log(`✓ VAPID_* → supabase/functions/.env.secrets`);
console.log('\nSiguiente paso: npm run setup:secrets\n');
