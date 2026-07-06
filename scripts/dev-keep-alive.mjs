/**
 * Mantiene Vite en marcha — reinicia si se cae.
 *
 * Uso:
 *   npm run dev:loop
 */

import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RESTART_MS = 3000;

function startDev() {
  const stamp = new Date().toLocaleTimeString('es-CO');
  console.log(`\n[dev-keep-alive ${stamp}] Iniciando Vite...\n`);

  const child = spawn('npm', ['run', 'dev'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code, signal) => {
    console.log(`\n[dev-keep-alive] Servidor detenido (code=${code ?? '—'}, signal=${signal ?? '—'})`);
    console.log(`[dev-keep-alive] Reinicio en ${RESTART_MS / 1000}s...\n`);
    setTimeout(startDev, RESTART_MS);
  });
}

startDev();
