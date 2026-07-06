/**
 * Vite + Socket.IO en paralelo (tracking en vivo local).
 *
 * Uso:
 *   npm run dev:all
 */

import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function run(label, script) {
  const child = spawn('npm', ['run', script], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  child.on('exit', (code) => {
    if (code !== 0) console.error(`[dev:all] ${label} salió con código ${code}`);
    process.exit(code ?? 1);
  });
  return child;
}

console.log('\n[dev:all] Socket.IO :3001 + Vite :5173 (proxy /socket.io)\n');
run('socket', 'dev:socket');
run('vite', 'dev');
