import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

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
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const consoleErrors = [];
const failedRequests = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('requestfailed', req => failedRequests.push(`${req.url()} :: ${req.failure()?.errorText}`));
await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.deck?.isReady());
if (await page.title() !== 'Quantum Computing Fundamentals') {
  throw new Error(`Unexpected deck at ${baseURL}: ${await page.title()}`);
}
await page.evaluate(() => window.deck.configure({ transition: 'none', backgroundTransition: 'none' }));
const slideCount = await page.locator('.slides > section').count();
const screenshots = new Set([0, 14, 15, 16, 20, 29, 32, 34, 35, slideCount - 2]);
const audits = [];
for (let i = 0; i < slideCount; i++) {
  await page.evaluate(index => window.deck.slide(index), i);
  await page.waitForFunction(index => {
    const slide = document.querySelectorAll('.slides > section')[index];
    return slide?.classList.contains('present') && window.deck.getIndices().h === index;
  }, i);
  await page.waitForTimeout(80);
  const audit = await page.evaluate(index => {
    const slide = document.querySelectorAll('.slides > section')[index];
    const sr = slide.getBoundingClientRect();
    const candidates = [...slide.querySelectorAll('h1,h2,h3,p,li,.formula,.bottom-line,.bit-result,.deck-brand')]
      .filter(el => {
        const s = getComputedStyle(el); const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0 && r.width > 2 && r.height > 2;
      });
    const clipped = candidates.filter(el => {
      const r = el.getBoundingClientRect();
      return r.left < sr.left - 2 || r.top < sr.top - 2 || r.right > sr.right + 2 || r.bottom > sr.bottom + 2;
    }).map(el => ({ tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0, 80), rect: [el.getBoundingClientRect().left, el.getBoundingClientRect().top, el.getBoundingClientRect().right, el.getBoundingClientRect().bottom] }));
    return { index, title: slide.querySelector('h1,h2')?.textContent.trim(), rect: [sr.left,sr.top,sr.width,sr.height], clipped, scroll: [slide.scrollWidth,slide.clientWidth,slide.scrollHeight,slide.clientHeight] };
  }, i);
  audits.push(audit);
  if (screenshots.has(i)) await page.screenshot({ path: new URL(`slide-${String(i + 1).padStart(2,'0')}.png`, outDir).pathname });
  if (i === 16) {
    await page.evaluate(() => window.deck.nextFragment());
    await page.waitForTimeout(1300);
    await page.screenshot({ path: new URL('slide-17-after.png', outDir).pathname });
  }
}
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await phone.goto(baseURL, { waitUntil: 'domcontentloaded' });
await phone.waitForFunction(() => window.deck?.isReady());
const phoneAudit = await phone.evaluate(() => {
  const r = window.deck.getCurrentSlide().getBoundingClientRect();
  return { viewport: [innerWidth, innerHeight], slideRect: [r.left,r.top,r.width,r.height], bodyScroll: [document.body.scrollWidth,document.body.scrollHeight] };
});
await phone.screenshot({ path: new URL('phone-title.png', outDir).pathname });
await browser.close();
if (qaServer) await qaServer.close();
const report = { slideCount, clippedCount: audits.reduce((n,a)=>n+a.clipped.length,0), consoleErrors, failedRequests, phoneAudit, audits };
await writeFile(new URL('layout-report.json', outDir), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ slideCount, clippedCount: report.clippedCount, consoleErrors: consoleErrors.length, failedRequests: failedRequests.length, phoneAudit, screenshots: [...screenshots].map(i => `qa/slide-${String(i+1).padStart(2,'0')}.png`) }, null, 2));
if (report.clippedCount || consoleErrors.length || failedRequests.length) process.exitCode = 1;
