import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const presentationsDir = 'presentations';
const requiredFiles = ['index.html', 'css/theme.css', 'js/deck.js'];

if (!existsSync(presentationsDir)) {
  throw new Error('Missing presentations/ directory');
}

const decks = readdirSync(presentationsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
if (decks.length === 0) {
  throw new Error('No presentation folders found');
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
