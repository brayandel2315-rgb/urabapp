import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.(jsx|js)$/.test(entry)) {
      let content = fs.readFileSync(full, 'utf8');
      if (!content.includes('Icon3D')) continue;
      const next = content
        .replace(/import Icon3D from ['"][^'"]+['"];?\r?\n?/g, "import AppIcon from '@/design-system/icons/AppIcon';\n")
        .replace(/<Icon3D/g, '<AppIcon');
      if (next !== content) {
        fs.writeFileSync(full, next);
        console.log('updated:', full);
      }
    }
  }
}

walk(root);
