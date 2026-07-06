import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const migrations = join(root, 'supabase', 'migrations');

function read(name) {
  return readFileSync(join(migrations, name), 'utf8');
}

function readSeed() {
  return readFileSync(join(root, 'supabase', 'seed.sql'), 'utf8');
}

/** Hace idempotentes las políticas de 001 (sin IF NOT EXISTS en PG). */
function patch001(sql) {
  return sql.replace(
    /^CREATE POLICY "([^"]+)" ON (public\.\w+)/gm,
    'DROP POLICY IF EXISTS "$1" ON $2;\nCREATE POLICY "$1" ON $2'
  );
}

const MANUAL_ONLY = new Set([
  '002_admin_brayan.sql',
]);

const BUNDLED_BEFORE_AUTO = [
  '001_initial_schema.sql',
  '004_operational.sql',
  '005_admin_read_orders.sql',
  '006_onboarding.sql',
  '007_apartado_seed.sql',
  '008_realtime.sql',
  '009_production.sql',
  '010_seed_20_comercios.sql',
  '011_seed_products_all.sql',
  '012_restrict_customer_order_update.sql',
  '013_phase2_50_comercios.sql',
  '014_phase3_notifications.sql',
  '015_phase4_economics.sql',
  '016_phase5_differentiators.sql',
  '017_phase6_reviews.sql',
  '018_crm_platform.sql',
  '019_storage_push_marketing.sql',
  '020_platform_integrations.sql',
  '021_notifications_realtime.sql',
  '022_dev_seed_drivers.sql',
  '023_coupons_assign_distance.sql',
  '024_in_app_messaging.sql',
  '025_assign_payment_methods.sql',
  '025_explore_banners_apartado.sql',
];

const bundledSet = new Set(BUNDLED_BEFORE_AUTO);

const autoMigrations = readdirSync(migrations)
  .filter((f) => f.endsWith('.sql') && !MANUAL_ONLY.has(f) && !bundledSet.has(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const sections = [
  ['-- ═══ PASO 1: Esquema base (001) ═══', patch001(read('001_initial_schema.sql'))],
  ['-- ═══ PASO 2: Datos iniciales (seed) ═══', readSeed()],
  ...BUNDLED_BEFORE_AUTO.slice(1).map((file, i) => [
    `-- ═══ PASO ${i + 3}: ${file.replace(/_/g, ' ').replace('.sql', '')} ═══`,
    read(file),
  ]),
  ...autoMigrations.map((file, i) => [
    `-- ═══ MIGRACIÓN ${file} ═══`,
    read(file),
  ]),
];

const header = `-- Urabapp — SQL de producción (todo en uno)
-- Proyecto: ekqaocauvoajpjyraeyo
-- Generado: ${new Date().toISOString().slice(0, 10)}
-- Migraciones incluidas: 001–025 + ${autoMigrations.length} adicionales (hasta ${autoMigrations[autoMigrations.length - 1] || '025'})
--
-- CÓMO EJECUTAR:
-- 1. Supabase Dashboard → SQL Editor → New query
-- 2. Pegar TODO este archivo y Run
-- 3. Activar Auth: Email, Google, Anonymous (Authentication → Providers)
-- 4. Inicia sesión en la app con tu email admin
-- 5. Ejecutar supabase/migrations/002_admin_brayan.sql (personalizado)
--
-- NOTA: 002 NO está incluido — requiere que exista tu perfil en public.users.
-- Alternativa recomendada: supabase db push (CLI)

`;

const body = sections.map(([title, sql]) => `${title}\n\n${sql.trim()}\n`).join('\n');

const outPath = join(root, 'supabase', 'RUN_PRODUCTION.sql');
writeFileSync(outPath, header + body, 'utf8');
console.log(`✓ ${outPath} (${(header.length + body.length).toLocaleString()} bytes, ${sections.length} secciones)`);
