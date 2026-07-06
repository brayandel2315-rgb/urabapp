/**
 * Arranca Vite en local. Si el puerto 5173 está ocupado, Vite usa el siguiente libre.
 */
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const isWin = process.platform === 'win32';
const child = isWin
  ? spawn('npx', ['vite', '--host'], { cwd: root, stdio: 'inherit', shell: true })
  : spawn('npx', ['vite', '--host'], { cwd: root, stdio: 'inherit' });

child.on('exit', (code) => process.exit(code ?? 0));
