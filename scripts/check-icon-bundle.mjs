// Regressão de tamanho dos ícones: builda um app mínimo (provideShyIcons com 1 ícone importado de /icons + shy-icon +
// shy-empty-state) e falha se o bundle inicial passar do limite. O catálogo completo (~2,5 MB) só pode existir como chunk lazy.
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, isMain, report } from './_shared.mjs';

// Medido em 2026-10-25: ~145 kB (Angular ~110 kB + lib + 19 ícones internos). O catálogo inteiro daria ~2,6 MB.
const INITIAL_BUDGET_KB = 200;
const OUT = join(ROOT, 'dist/size-check/browser');
const kb = (bytes) => (bytes / 1024).toFixed(1);

export function checkIconBundle() {
  const errors = [];
  const build = spawnSync('npx', ['ng', 'build', 'size-check'], { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });
  if (build.status !== 0) return { errors: [`ng build size-check falhou:\n${build.stdout}${build.stderr}`], warnings: [] };

  const html = readFileSync(join(OUT, 'index.html'), 'utf8');
  const initial = new Set([...html.matchAll(/(?:src|href)="([^"]+\.js)"/g)].map((m) => m[1]));
  const initialBytes = [...initial].reduce((sum, f) => sum + statSync(join(OUT, f)).size, 0);
  const lazy = readdirSync(OUT).filter((f) => f.endsWith('.js') && !initial.has(f) && statSync(join(OUT, f)).size > 1024 * 1024);

  console.log(`  bundle inicial do app mínimo: ${kb(initialBytes)} KB de ${INITIAL_BUDGET_KB} KB`);
  console.log(`  catálogo de ícones (chunk lazy): ${lazy.length ? lazy.map((f) => `${f} ${kb(statSync(join(OUT, f)).size)} KB`).join(', ') : 'não encontrado'}`);
  if (initialBytes > INITIAL_BUDGET_KB * 1024) errors.push(`bundle inicial soma ${kb(initialBytes)} KB (limite ${INITIAL_BUDGET_KB} KB): o catálogo de ícones voltou para o bundle inicial?`);
  if (!lazy.length) errors.push('o catálogo de ícones não aparece como chunk lazy (import() do subpath /icons quebrou?)');
  return { errors, warnings: [] };
}

if (isMain(import.meta.url)) {
  const { errors, warnings } = checkIconBundle();
  process.exit(report('check-icon-bundle', errors, warnings));
}
