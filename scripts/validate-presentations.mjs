import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const presentationsDir = '.';
const ignoredDirectories = new Set(['.git', 'node_modules', 'scripts', 'dist']);
const requiredFiles = ['index.html', 'css/theme.css', 'js/deck.js', 'package.json'];

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

  if (!html.includes('node_modules/reveal.js/dist/reveal.css')) {
    throw new Error(`${deck.name} should load its own reveal.js dependency from the presentation folder`);
  }

  const js = readFileSync(join(base, 'js/deck.js'), 'utf8');
  if (!js.includes("../node_modules/reveal.js/dist/reveal.mjs")) {
    throw new Error(`${deck.name} should import reveal.js from its own presentation node_modules`);
  }

  const packageJson = JSON.parse(readFileSync(join(base, 'package.json'), 'utf8'));
  if (!packageJson.scripts?.dev || !packageJson.dependencies?.['reveal.js']) {
    throw new Error(`${deck.name} package.json should include a dev script and reveal.js dependency`);
  }
}

console.log(`Validated ${decks.length} reveal.js presentation folder(s).`);
