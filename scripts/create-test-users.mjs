#!/usr/bin/env node
/**
 * Crea 3 usuarios de prueba (cliente, comercio, mensajero) con email + contraseña.
 *
 * Requiere en .env.local:
 *   VITE_SUPABASE_URL o SUPABASE_URL
 *   SUPABASE_SECRET_KEY (service role)
 *
 * Uso: node scripts/create-test-users.mjs
 *      node scripts/create-test-users.mjs --password "B33.rayan"
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

const passwordArg = process.argv.find((a) => a.startsWith('--password='))?.split('=')[1]
  || (process.argv.includes('--password') ? process.argv[process.argv.indexOf('--password') + 1] : null);
const password = (passwordArg || process.env.TEST_USERS_PASSWORD || 'B33.rayan').trim();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Faltan SUPABASE_URL y SUPABASE_SECRET_KEY en .env.local');
  process.exit(1);
}

if (password.length < 8) {
  console.error('La contraseña debe tener al menos 8 caracteres');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = [
  {
    email: 'test.cliente@urabapp.com',
    full_name: 'Cliente Prueba',
    phone: '3001110001',
    role: 'CLIENT',
    municipio: 'Apartadó',
  },
  {
    email: 'test.tienda@urabapp.com',
    full_name: 'Dueño Tienda Prueba',
    phone: '3001110002',
    role: 'BUSINESS',
    municipio: 'Apartadó',
    business: {
      name: 'Tienda Prueba Urabapp',
      category: 'comida',
      description: 'Comercio de prueba para panel y pedidos',
      emoji: 'store',
      address: 'Calle de prueba, Centro',
      zone: 'Centro',
    },
  },
  {
    email: 'test.mensajero@urabapp.com',
    full_name: 'Mensajero Prueba',
    phone: '3001110003',
    role: 'RIDER',
    municipio: 'Apartadó',
    driver: {
      first_name: 'Mensajero',
      last_name: 'Prueba',
      document_number: '1000000001',
      vehicle: 'moto',
      plate: 'TEST01',
    },
  },
];

async function findAuthUser(email) {
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  return data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function upsertAuthUser({ email, full_name, role }) {
  const existing = await findAuthUser(email);
  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });
    if (error) throw new Error(`${email}: ${error.message}`);
    return existing.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });
  if (error) throw new Error(`${email}: ${error.message}`);
  return data.user.id;
}

async function upsertPublicUser({ id, email, full_name, phone, role, municipio }) {
  const { error } = await admin.from('users').upsert({
    id,
    email,
    full_name,
    phone,
    role,
    municipio,
    account_status: 'active',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
  if (error) throw new Error(`users ${email}: ${error.message}`);
}

async function ensureBusiness(ownerId, business) {
  const { data: existing } = await admin
    .from('businesses')
    .select('id')
    .eq('owner_id', ownerId)
    .eq('name', business.name)
    .maybeSingle();

  const payload = {
    owner_id: ownerId,
    name: business.name,
    category: business.category,
    description: business.description,
    emoji: business.emoji,
    phone: '3001110002',
    municipio: 'Apartadó',
    zone: business.zone,
    address: business.address,
    delivery_fee: 3500,
    min_order: 10000,
    delivery_time: 25,
    is_active: true,
    is_open: true,
    is_published: true,
    verification_status: 'approved',
    commission_pct: 12,
  };

  if (existing?.id) {
    const { error } = await admin.from('businesses').update(payload).eq('id', existing.id);
    if (error) throw new Error(`business update: ${error.message}`);
    return existing.id;
  }

  const { data, error } = await admin.from('businesses').insert(payload).select('id').single();
  if (error) {
    const { name, category, description, emoji, phone, municipio, zone, address, owner_id, ...minimal } = payload;
    const { data: fb, error: err2 } = await admin.from('businesses').insert({
      owner_id: ownerId,
      name: business.name,
      category: business.category,
      description: business.description,
      emoji: business.emoji,
      phone: '3001110002',
      municipio: 'Apartadó',
      zone: business.zone,
      address: business.address,
      is_active: true,
      is_open: true,
    }).select('id').single();
    if (err2) throw new Error(`business insert: ${error.message} / ${err2.message}`);
    return fb.id;
  }

  const { count } = await admin.from('products').select('id', { count: 'exact', head: true }).eq('business_id', data.id);
  if (!count) {
    await admin.from('products').insert([
      { business_id: data.id, name: 'Combo prueba', price: 15000, emoji: 'package', is_available: true, category: 'Menú' },
      { business_id: data.id, name: 'Bebida prueba', price: 5000, emoji: 'drink', is_available: true, category: 'Bebidas' },
    ]);
  }

  return data.id;
}

async function ensureDriver(userId, driver) {
  const { data: existing } = await admin.from('drivers').select('id').eq('user_id', userId).maybeSingle();
  const payload = {
    user_id: userId,
    name: `${driver.first_name} ${driver.last_name}`,
    first_name: driver.first_name,
    last_name: driver.last_name,
    document_type: 'CC',
    document_number: driver.document_number,
    phone: '3001110003',
    email: 'test.mensajero@urabapp.com',
    municipio: 'Apartadó',
    city: 'Urabá',
    vehicle: driver.vehicle,
    plate: driver.plate,
    is_online: false,
    is_verified: true,
    verification_status: 'approved',
    onboarding_step: 4,
    availability_mode: 'offline',
  };

  if (existing?.id) {
    const { error } = await admin.from('drivers').update(payload).eq('id', existing.id);
    if (error) throw new Error(`driver update: ${error.message}`);
    return existing.id;
  }

  const { error } = await admin.from('drivers').insert(payload);
  if (error) throw new Error(`driver insert: ${error.message}`);
}

console.log('\n🧪 Creando usuarios de prueba Urabapp\n');

const results = [];

for (const spec of TEST_USERS) {
  const userId = await upsertAuthUser(spec);
  await upsertPublicUser({ id: userId, ...spec });

  if (spec.business) {
    await ensureBusiness(userId, spec.business);
  }
  if (spec.driver) {
    await ensureDriver(userId, spec.driver);
  }

  results.push({ ...spec, userId });
  console.log(`✅ ${spec.role.padEnd(8)} ${spec.email}`);
}

console.log('\n── Credenciales (pestaña Contraseña en /login) ──\n');
for (const r of results) {
  console.log(`${r.role === 'CLIENT' ? 'Comprador' : r.role === 'BUSINESS' ? 'Comercio' : 'Mensajero'}:`);
  console.log(`  Email:      ${r.email}`);
  console.log(`  Contraseña: ${password}`);
  console.log(`  Ir a:       ${r.role === 'CLIENT' ? '/' : r.role === 'BUSINESS' ? '/negocio' : '/domiciliario'}\n`);
}

console.log('Google OAuth sigue desactivado en Supabase hasta habilitar el provider en Auth → Providers.\n');
