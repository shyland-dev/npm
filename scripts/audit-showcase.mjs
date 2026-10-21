// Auditoria a11y/layout no Chromium sobre o showcase (F5-S4). Não faz parte de check:ds: precisa de navegador.
// Uso: npm run build:showcase && node scripts/audit-showcase.mjs [--quick]
// Requer playwright-core resolvível (NODE_PATH) e Chromium em PLAYWRIGHT_CHROMIUM ou /opt/pw-browsers/chromium. Nada é instalado no projeto.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';
import { ROOT, read } from './_shared.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');
const DIST = join(ROOT, 'dist/showcase/browser');
const quick = process.argv.includes('--quick');
const MIME = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };

const routes = [...read(join(ROOT, 'src/apps/app/app.routes.ts')).matchAll(/path:\s*'([^'*]+)'/g)].map((m) => `/${m[1]}`).filter((r, i, a) => a.indexOf(r) === i);
routes.unshift('/');

const server = createServer((req, res) => {
  const file = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const target = existsSync(file) && statSync(file).isFile() ? file : join(DIST, 'index.html');
  res.writeHead(200, { 'content-type': MIME[extname(target)] ?? 'application/octet-stream' });
  createReadStream(target).pipe(res);
});
await new Promise((ok) => server.listen(0, ok));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const themes = quick ? ['dark'] : ['dark', 'light'];
const dirs = quick ? ['ltr'] : ['ltr', 'rtl'];
const widths = quick ? [360] : [360, 1366];
const media = quick ? [{}] : [{}, { forcedColors: 'active' }, { reducedMotion: 'reduce' }];
const findings = [];
let scenarios = 0;

for (const theme of themes) {
  for (const m of media) {
    const context = await browser.newContext({ ...m, viewport: { width: 1366, height: 800 } });
    await context.addInitScript((t) => localStorage.setItem('shy-theme', t), theme);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => msg.type() === 'error' && errors.push(`console: ${msg.text()}`));
    for (const route of routes) {
      for (const dir of dirs) {
        for (const width of widths) {
          scenarios++;
          const tag = `${route} [${theme}, ${dir}, ${width}px, ${Object.values(m)[0] ?? 'normal'}]`;
          errors.length = 0;
          await page.setViewportSize({ width, height: 800 });
          await page.goto(base + route, { waitUntil: 'networkidle' });
          await page.evaluate((d) => document.documentElement.setAttribute('dir', d), dir);
          const result = await page.evaluate(() => {
            const out = [];
            const doc = document.documentElement;
            if (doc.scrollWidth > doc.clientWidth + 1) out.push(`scroll horizontal (${doc.scrollWidth} > ${doc.clientWidth})`);
            const ids = new Map();
            for (const el of document.querySelectorAll('[id]')) ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
            for (const [id, n] of ids) if (n > 1) out.push(`id duplicado: ${id} (${n})`);
            const nameOf = (el) => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent?.trim() || el.getAttribute('title') || el.labels?.[0]?.textContent?.trim();
            for (const el of document.querySelectorAll('button, [role="button"], a[href]')) if (!nameOf(el) && !el.querySelector('[aria-label], img[alt]')) out.push(`sem nome acessível: ${el.outerHTML.slice(0, 90)}`);
            for (const el of document.querySelectorAll('input:not([type=hidden]), select, textarea')) if (!nameOf(el)) out.push(`campo sem nome: ${el.outerHTML.slice(0, 90)}`);
            for (const el of document.querySelectorAll('img:not([alt])')) out.push(`img sem alt: ${el.outerHTML.slice(0, 90)}`);
            if (!document.querySelector('main, [role="main"]')) out.push('sem landmark main');
            if (document.querySelectorAll('h1').length !== 1) out.push(`h1: ${document.querySelectorAll('h1').length} (esperado 1)`);
            return out;
          });
          // Foco por teclado: cada parada de Tab precisa ter indicador visível (outline ou box-shadow) e não pode ficar fora da tela.
          const stops = quick ? 8 : 25;
          await page.evaluate(() => document.body.focus());
          for (let i = 0; i < stops; i++) {
            await page.keyboard.press('Tab');
            const f = await page.evaluate(() => {
              const el = document.activeElement;
              if (!el || el === document.body) return null;
              const s = getComputedStyle(el);
              const visible = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none' || (el.matches(':focus-visible') && getComputedStyle(el, '::after').outlineStyle !== 'none');
              return { visible, tag: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''), cls: String(el.className).slice(0, 40) };
            });
            if (f && !f.visible) result.push(`foco sem indicador: ${f.tag}.${f.cls}`);
          }
          for (const r of [...result, ...errors]) findings.push(`${tag}: ${r}`);
        }
      }
    }
    await context.close();
  }
}
await browser.close();
server.close();
const unique = [...new Set(findings)];
console.log(`${scenarios} cenários, ${routes.length} rotas`);
if (unique.length) console.log(unique.slice(0, 200).join('\n'), unique.length > 200 ? `\n... +${unique.length - 200}` : '');
console.log(unique.length ? `✗ ${unique.length} achado(s)` : '✓ sem achados');
process.exit(unique.length ? 1 : 0);
