// Orçamento de tamanho: CSS global da lib (fonte) e bundle publicado (dist, se existir). Fontes: ver check-fonts.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { ROOT, STYLES, isMain, read, report, walk } from './_shared.mjs';

const CSS_BUDGET_KB = 40;
const BUNDLE_GZIP_BUDGET_KB = 650;
const kb = (bytes) => (bytes / 1024).toFixed(1);

export function checkSize() {
  const errors = [];
  const warnings = [];

  const css = walk(STYLES, ['.css'])
    .filter((f) => !f.includes('/fonts/'))
    .map(read)
    .join('\n');
  const cssBytes = Buffer.byteLength(css);
  console.log(`  css global: ${kb(cssBytes)} KB (${kb(gzipSync(css).length)} KB gzip) de ${CSS_BUDGET_KB} KB`);
  if (cssBytes > CSS_BUDGET_KB * 1024) errors.push(`CSS global soma ${kb(cssBytes)} KB (orçamento ${CSS_BUDGET_KB} KB)`);

  const bundle = join(ROOT, 'src/libs/ui/dist/ui/fesm2022/shyland-dev-ui.mjs');
  if (existsSync(bundle)) {
    const gzip = gzipSync(readFileSync(bundle)).length;
    console.log(`  bundle da lib: ${kb(gzip)} KB gzip de ${BUNDLE_GZIP_BUDGET_KB} KB (tree-shaken no consumidor: sideEffects false)`);
    if (gzip > BUNDLE_GZIP_BUDGET_KB * 1024) errors.push(`bundle da lib soma ${kb(gzip)} KB gzip (orçamento ${BUNDLE_GZIP_BUDGET_KB} KB)`);
  } else warnings.push('dist da lib ausente: bundle não medido (rode npm run build antes)');

  return { errors, warnings };
}

if (isMain(import.meta.url)) {
  const { errors, warnings } = checkSize();
  process.exit(report('check-size', errors, warnings));
}
