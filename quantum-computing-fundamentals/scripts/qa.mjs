import { chromium } from 'playwright';
import { access, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const EXPECTED_TITLE = 'Quantum Computing Fundamentals';
const EXPECTED_SLIDES = 28;
const qaServer = process.env.QA_URL ? null : await createServer({
  root: new URL('../', import.meta.url).pathname,
  server: { host: '127.0.0.1', port: 0 },
  logLevel: 'silent'
});
if (qaServer) await qaServer.listen();
const address = qaServer?.httpServer?.address();
const baseURL = process.env.QA_URL || `http://127.0.0.1:${address.port}`;
const outDir = new URL('../qa/', import.meta.url);
await mkdir(outDir, { recursive: true });
for (const file of await readdir(outDir)) {
  if (/^(slide-.*\.png|phone-title\.png|contact-sheet\.png|layout-report\.json)$/.test(file)) {
    await rm(new URL(file, outDir));
  }
}

async function auditSlideState(page, index, state) {
  return page.evaluate(({ index, state }) => {
    const slide = document.querySelectorAll('.slides > section')[index];
    const sr = slide.getBoundingClientRect();
    const visible = [...slide.querySelectorAll('*')].filter(el => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0 && r.width > 2 && r.height > 2;
    });
    const candidates = visible.filter(el => {
      const tag = el.tagName.toLowerCase();
      return el.childElementCount === 0 && !['script', 'style', 'defs', 'stop'].includes(tag);
    });
    const clipped = candidates.filter(el => {
      const r = el.getBoundingClientRect();
      return r.left < sr.left - 2 || r.top < sr.top - 2 || r.right > sr.right + 2 || r.bottom > sr.bottom + 2;
    }).map(el => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        cls: String(el.className),
        text: el.textContent.trim().slice(0, 90),
        rect: [r.left, r.top, r.right, r.bottom]
      };
    });
    const overflow = slide.scrollWidth > slide.clientWidth + 2 || slide.scrollHeight > slide.clientHeight + 2;
    return {
      index,
      state,
      title: slide.querySelector('h1,h2')?.textContent.trim(),
      rect: [sr.left, sr.top, sr.width, sr.height],
      clipped,
      overflow,
      scroll: [slide.scrollWidth, slide.clientWidth, slide.scrollHeight, slide.clientHeight],
      fragments: slide.querySelectorAll('.fragment').length,
      visibleFragments: slide.querySelectorAll('.fragment.visible').length
    };
  }, { index, state });
}

async function auditConnector(page, index, controlSelector, targetSelector, linkSelector, extra = {}) {
  await page.evaluate(i => window.deck.slide(i, 0, -1), index);
  await page.waitForFunction(i => window.deck.getIndices().h === i, index);
  const result = await page.evaluate(({ controlSelector, targetSelector, linkSelector, extra }) => {
    const center = selector => {
      const r = document.querySelector(selector).getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, left: r.left, right: r.right };
    };
    const control = center(controlSelector);
    const target = center(targetSelector);
    const link = center(linkSelector);
    const hGate = extra.hGate ? center(extra.hGate) : null;
    return {
      control,
      target,
      link,
      xDeltaControlTarget: Math.abs(control.x - target.x),
      xDeltaControlLink: Math.abs(control.x - link.x),
      hBeforeControl: hGate ? hGate.x < control.x : true
    };
  }, { controlSelector, targetSelector, linkSelector, extra });
  if (result.xDeltaControlTarget > 2 || result.xDeltaControlLink > 2 || !result.hBeforeControl) {
    throw new Error(`Circuit alignment failed on slide ${index + 1}: ${JSON.stringify(result)}`);
  }
  return { slide: index + 1, ...result };
}

async function createContactSheet(browser, screenshotPaths) {
  const slideShots = screenshotPaths.filter(path => /qa\/slide-.*\.png$/.test(path));
  const tiles = [];
  for (const path of slideShots) {
    const file = new URL(`../${path}`, import.meta.url);
    const data = await readFile(file);
    tiles.push({ name: path.split('/').pop(), src: `data:image/png;base64,${data.toString('base64')}` });
  }
  const cols = 4;
  const tileWidth = 610;
  const tileHeight = 365;
  const rows = Math.ceil(tiles.length / cols);
  const contact = await browser.newPage({ viewport: { width: cols * tileWidth, height: rows * tileHeight }, deviceScaleFactor: 1 });
  const html = `<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;background:#0b1129}main{display:grid;grid-template-columns:repeat(${cols},${tileWidth}px)}figure{position:relative;width:${tileWidth}px;height:${tileHeight}px;margin:0;padding:28px 17px 13px;background:#0b1129}figcaption{position:absolute;left:14px;top:7px;color:#1db8f2;font:14px sans-serif}img{display:block;width:576px;height:324px;object-fit:contain}</style><main>${tiles.map(tile => `<figure><figcaption>${tile.name}</figcaption><img src="${tile.src}"></figure>`).join('')}</main>`;
  await contact.setContent(html, { waitUntil: 'load' });
  await contact.evaluate(() => Promise.all([...document.images].map(img => img.decode())));
  await contact.screenshot({ path: new URL('contact-sheet.png', outDir).pathname });
  await contact.close();
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const consoleErrors = [];
const failedRequests = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('requestfailed', req => failedRequests.push(`${req.url()} :: ${req.failure()?.errorText}`));
await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.deck?.isReady());
const actualTitle = await page.title();
if (actualTitle !== EXPECTED_TITLE) throw new Error(`Unexpected deck at ${baseURL}: ${actualTitle}`);
await page.evaluate(() => window.deck.configure({ transition: 'none', backgroundTransition: 'none' }));
const slideCount = await page.locator('.slides > section').count();
if (slideCount !== EXPECTED_SLIDES) throw new Error(`Expected ${EXPECTED_SLIDES} slides, found ${slideCount}`);

const representativeSlides = new Set([0, 1, 3, 4, 5, 7, 10, 13, 15, 17, 19, 20, 22, 24, 25, 26, 27]);
const screenshots = [];
const audits = [];
for (let i = 0; i < slideCount; i++) {
  await page.evaluate(index => window.deck.slide(index, 0, -1), i);
  await page.waitForFunction(index => {
    const slide = document.querySelectorAll('.slides > section')[index];
    return slide?.classList.contains('present') && window.deck.getIndices().h === index;
  }, i);
  await page.waitForTimeout(100);

  if (i === 10) {
    const before = 'slide-11-hadamard-before.png';
    await page.screenshot({ path: new URL(before, outDir).pathname });
    screenshots.push(`qa/${before}`);
  }

  audits.push(await auditSlideState(page, i, 'initial'));
  const fragmentCount = await page.locator('.slides > section').nth(i).locator('.fragment').count();
  for (let f = 0; f < fragmentCount; f++) {
    await page.evaluate(() => window.deck.nextFragment());
    await page.waitForTimeout(i === 10 ? 1150 : 45);
    audits.push(await auditSlideState(page, i, `fragment-${f + 1}`));
  }

  if (representativeSlides.has(i)) {
    const name = i === 10 ? 'slide-11-hadamard-after.png' : `slide-${String(i + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: new URL(name, outDir).pathname });
    screenshots.push(`qa/${name}`);
  }
}

const circuitAlignmentAudit = [
  await auditConnector(page, 13, '.simple-circuit .control', '.simple-circuit .target', '.simple-circuit .link'),
  await auditConnector(page, 17, '.bell-control', '.bell-target', '.bell-link', { hGate: '.bell-h' })
];

await page.evaluate(() => window.deck.slide(0, 0, -1));
await page.waitForTimeout(80);
const chromeAudit = await page.evaluate(() => {
  const logo = document.querySelector('.background-branding-logo');
  const patch = document.querySelector('.background-confidentiality-patch');
  return { titleLogo: logo?.getAttribute('src'), titleLogoClass: logo?.className, titlePatch: patch?.getAttribute('src'), titlePatchClass: patch?.className };
});
await page.evaluate(() => window.deck.slide(1, 0, -1));
await page.waitForTimeout(80);
Object.assign(chromeAudit, await page.evaluate(() => {
  const logo = document.querySelector('.background-branding-logo');
  const patch = document.querySelector('.background-confidentiality-patch');
  return { contentLogo: logo?.getAttribute('src'), contentLogoClass: logo?.className, contentPatch: patch?.getAttribute('src'), contentPatchClass: patch?.className };
}));
if (!chromeAudit.titleLogo?.includes('Primary_Logo_White') || !chromeAudit.titlePatch?.includes('confidential-full') || !chromeAudit.contentLogo?.includes('Primary_Spade_White') || !chromeAudit.contentPatch?.endsWith('SEC1-company-confidential.svg')) {
  throw new Error(`Branding audit failed: ${JSON.stringify(chromeAudit)}`);
}

await createContactSheet(browser, screenshots);
screenshots.push('qa/contact-sheet.png');
for (const path of screenshots) await access(new URL(`../${path}`, import.meta.url));

const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await phone.goto(baseURL, { waitUntil: 'domcontentloaded' });
await phone.waitForFunction(() => window.deck?.isReady());
const phoneAudit = await phone.evaluate(() => {
  const r = window.deck.getCurrentSlide().getBoundingClientRect();
  return { viewport: [innerWidth, innerHeight], slideRect: [r.left, r.top, r.width, r.height], ratio: r.width / r.height, bodyScroll: [document.body.scrollWidth, document.body.scrollHeight] };
});
await phone.screenshot({ path: new URL('phone-title.png', outDir).pathname });
screenshots.push('qa/phone-title.png');
await access(new URL('phone-title.png', outDir));
await browser.close();
if (qaServer) await qaServer.close();

const clippedCount = audits.reduce((n, audit) => n + audit.clipped.length, 0);
const overflowCount = audits.filter(audit => audit.overflow).length;
const report = { slideCount, fragmentStatesAudited: audits.length, clippedCount, overflowCount, consoleErrors, failedRequests, phoneAudit, chromeAudit, circuitAlignmentAudit, screenshots, audits };
await writeFile(new URL('layout-report.json', outDir), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ slideCount, fragmentStatesAudited: audits.length, clippedCount, overflowCount, consoleErrors: consoleErrors.length, failedRequests: failedRequests.length, phoneAudit, chromeAudit, circuitAlignmentAudit, screenshots }, null, 2));
if (clippedCount || overflowCount || consoleErrors.length || failedRequests.length) process.exitCode = 1;
