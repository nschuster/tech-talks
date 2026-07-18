import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const presentationsDir = '.';
const requiredFiles = ['index.html', 'css/theme.css', 'js/deck.js'];

if (!existsSync(presentationsDir)) {
  throw new Error('Missing presentations/ directory');
}

const ignoredDirectories = new Set(['.git', 'node_modules', 'scripts', 'dist']);
const decks = readdirSync(presentationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => !ignoredDirectories.has(entry.name))
  .filter((entry) => existsSync(join(presentationsDir, entry.name, 'index.html')));
if (decks.length === 0) {
  throw new Error('No top-level presentation folders found');
}

for (const deck of decks) {
  const base = join(presentationsDir, deck.name);
  for (const file of requiredFiles) {
    const path = join(base, file);
    if (!existsSync(path)) {
      throw new Error(`Missing ${path}`);
    }
  }

  const html = readFileSync(join(base, 'index.html'), 'utf8');
  const slideCount = (html.match(/<section[\s>]/g) ?? []).length;
  if (slideCount < 3) {
    throw new Error(`${deck.name} should contain at least 3 slides; found ${slideCount}`);
  }

  if (!html.includes('data-theme="dark"') && !html.includes("data-theme='dark'")) {
    throw new Error(`${deck.name} should define an easy default data-theme`);
  }
}

console.log(`Validated ${decks.length} reveal.js presentation folder(s).`);
