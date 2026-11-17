// Teste de layout no Chromium: o <dialog> modal continua centralizado (x e y) quando o app injeta, DEPOIS do CSS da lib,
// um reset global `* { margin: 0; padding: 0 }`. Os modos sheet/drawer não podem ser centralizados. Não faz parte de check:ds (precisa de navegador).
// Uso: npm run build:showcase && node scripts/test-dialog-centering.mjs
// Requer playwright-core resolvível (PLAYWRIGHT_CORE ou NODE_PATH) e Chromium em PLAYWRIGHT_CHROMIUM ou /opt/pw-browsers/chromium.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';
import { ROOT } from './_shared.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');
const DIST = join(ROOT, 'dist/showcase/browser');
const MIME = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const TOLERANCE = 1; // px

const server = createServer((req, res) => {
  const file = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const target = existsSync(file) && statSync(file).isFile() ? file : join(DIST, 'index.html');
  res.writeHead(200, { 'content-type': MIME[extname(target)] ?? 'application/octet-stream' });
  createReadStream(target).pipe(res);
});
await new Promise((ok) => server.listen(0, ok));
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });

const viewports = [
  { width: 360, height: 640 },
  { width: 1366, height: 768 },
];
// `centered`: true = deve estar centralizado em x e y; false = não pode estar (folha na base / drawer na borda).
const cases = [
  { name: 'dialog sm', route: '/components/dialog', button: /^sm$/, centered: true },
  { name: 'dialog md', route: '/components/dialog', button: /^md$/, centered: true },
  { name: 'dialog lg', route: '/components/dialog', button: /^lg$/, centered: true },
  { name: 'dialog presentation center', route: '/components/dialog', button: /^center$/, centered: true },
  { name: 'dialog presentation sheet', route: '/components/dialog', button: /^sheet$/, centered: false },
  { name: 'dialog presentation auto', route: '/components/dialog', button: /^auto$/, centered: (vp) => vp.width > vp.height },
  { name: 'drawer end', route: '/components/drawer', button: /^end$/, centered: false },
  { name: 'drawer bottom', route: '/components/drawer', button: /^bottom$/, centered: false },
];

let failures = 0;
for (const resetCss of [false, true]) {
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();
    for (const c of cases) {
      await page.goto(base + c.route, { waitUntil: 'networkidle' });
      // Reset global injetado depois de todo o CSS da lib: empata em especificidade (0) com `:where` e ganha por ordem.
      if (resetCss) await page.addStyleTag({ content: '* { margin: 0; padding: 0; }' });
      await page.getByRole('button', { name: c.button }).first().click();
      const dialog = page.locator('dialog.shy-overlay-pane[open]').last();
      await dialog.waitFor({ state: 'visible' });
      await page.waitForTimeout(400); // fim da animação de entrada (transform)
      const r = await dialog.evaluate((el) => {
        // Caixa de referência: um `position: fixed; inset: 0` tem o mesmo bloco de contenção do diálogo (descontando o scrollbar-gutter do scroll lock).
        const probe = document.body.appendChild(Object.assign(document.createElement('div'), { style: 'position:fixed;inset:0;visibility:hidden;pointer-events:none' }));
        const area = probe.getBoundingClientRect();
        probe.remove();
        const b = el.getBoundingClientRect();
        return { left: b.left - area.left, right: area.right - b.right, top: b.top - area.top, bottom: area.bottom - b.bottom, width: b.width, height: b.height };
      });
      const centeredX = Math.abs(r.left - r.right) <= TOLERANCE;
      const centeredY = Math.abs(r.top - r.bottom) <= TOLERANCE;
      const inside = r.left >= -TOLERANCE && r.right >= -TOLERANCE && r.top >= -TOLERANCE && r.bottom >= -TOLERANCE;
      const expectCentered = typeof c.centered === 'function' ? c.centered(vp) : c.centered;
      const ok = expectCentered ? centeredX && centeredY && inside : !(centeredX && centeredY);
      const label = `${c.name} | ${vp.width}x${vp.height} | reset=${resetCss ? 'sim' : 'não'}`;
      if (!ok) failures++;
      console.log(`${ok ? '✓' : '✗'} ${label} | esperado ${expectCentered ? 'centralizado' : 'não centralizado'} | x: ${r.left.toFixed(1)}/${r.right.toFixed(1)} y: ${r.top.toFixed(1)}/${r.bottom.toFixed(1)}`);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' }).catch(() => {});
    }
    await context.close();
  }
}

await browser.close();
server.close();
console.log(failures ? `\n✗ ${failures} falha(s)` : '\n✓ dialog centralizado com e sem reset global');
process.exit(failures ? 1 : 0);
