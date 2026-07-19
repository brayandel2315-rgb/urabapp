/**
 * Genera logo Urabapp con fondo transparente (identidad 2026).
 * Fuente: urabapp-logo-brand-master.png (fondo blanco).
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(__dirname, 'remove-white-backgrounds.mjs');

const child = spawn(process.execPath, [script], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 1));
