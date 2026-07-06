/**
 * Genera app-version.json antes de cada build/deploy.
 * El cliente compara este archivo con su bundle para detectar deploys nuevos.
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const builtAt = new Date().toISOString();

function gitShortSha() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

const gitSha = gitShortSha();
const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? null;
const seed = gitSha || vercelSha || `${builtAt}-${process.pid}`;
const buildId = createHash('sha256').update(String(seed)).digest('hex').slice(0, 12);

const payload = {
  app: 'urabapp',
  buildId,
  builtAt,
  gitSha: gitSha || vercelSha || null,
};

const targets = [
  path.join(root, 'public', 'app-version.json'),
  path.join(root, 'src', 'app-version.generated.json'),
];

for (const file of targets) {
  writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

console.log(`[app-version] buildId=${buildId} builtAt=${builtAt}`);
