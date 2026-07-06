#!/usr/bin/env node
/**
 * Crea o actualiza el superusuario (ADMIN) con email + contraseña.
 *
 * Requiere en .env.local:
 *   SUPABASE_URL
 *   SUPABASE_SECRET_KEY (service role)
 *   ADMIN_EMAIL=brayandel001@gmail.com
 *   ADMIN_PASSWORD=tu_contraseña_segura
 *
 * Uso: npm run create:admin
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAIL || process.env.VITE_OWNER_EMAIL || 'brayandel001@gmail.com').trim();
const password = process.env.ADMIN_PASSWORD?.trim();
const displayName = process.env.ADMIN_NAME?.trim() || 'Brayan Admin';

if (!url || !serviceKey) {
  console.error('Faltan SUPABASE_URL y SUPABASE_SECRET_KEY en .env.local');
  process.exit(1);
}

if (!password || password.length < 8) {
  console.error('Define ADMIN_PASSWORD en .env.local (mínimo 8 caracteres)');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const adminAuthPayload = {
  password,
  email_confirm: true,
  user_metadata: { full_name: displayName },
  app_metadata: { role: 'ADMIN', provider: 'email' },
};

const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
const existing = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

if (existing) {
  const { error: pwErr } = await admin.auth.admin.updateUserById(existing.id, adminAuthPayload);
  if (pwErr) {
    console.error('Error actualizando superusuario:', pwErr.message);
    process.exit(1);
  }
  await admin.from('users').update({ role: 'ADMIN', full_name: displayName }).eq('id', existing.id);
  console.log(`Superusuario actualizado: ${email}`);
  console.log('Entra en /login → Contraseña → navega con la barra Superusuario');
  process.exit(0);
}

const { data, error } = await admin.auth.admin.createUser({
  email,
  ...adminAuthPayload,
});

if (error) {
  console.error('Error creando superusuario:', error.message);
  process.exit(1);
}

await admin.from('users').upsert({
  id: data.user.id,
  email,
  full_name: displayName,
  role: 'ADMIN',
});

console.log(`Superusuario creado: ${email}`);
console.log('Entra en /login → Contraseña → /admin o usa Ctrl+K para navegar');
