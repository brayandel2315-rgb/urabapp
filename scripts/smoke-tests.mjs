/**
 * LOOP 25 — Smoke tests (node, sin browser).
 * Ejecutar: node scripts/smoke-tests.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const checks = [
  { name: 'package.json exists', test: () => existsSync(resolve(root, 'package.json')) },
  { name: 'routes.jsx exists', test: () => existsSync(resolve(root, 'src/app/routes.jsx')) },
  { name: 'domains index', test: () => existsSync(resolve(root, 'src/domains/index.js')) },
  { name: 'account layout', test: () => existsSync(resolve(root, 'src/modules/account/AccountLayout.jsx')) },
  { name: 'migration 045', test: () => existsSync(resolve(root, 'supabase/migrations/045_platform_master_loops.sql')) },
  { name: 'migration 051', test: () => existsSync(resolve(root, 'supabase/migrations/051_platform_operational_completeness.sql')) },
  { name: 'legal service', test: () => existsSync(resolve(root, 'src/services/legal.service.js')) },
  {
    name: 'routes include /cuenta',
    test: () => readFileSync(resolve(root, 'src/app/routes.jsx'), 'utf8').includes('/cuenta'),
  },
];

let failed = 0;
for (const c of checks) {
  const ok = c.test();
  console.log(ok ? `✓ ${c.name}` : `✗ ${c.name}`);
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} smoke checks passed`);
