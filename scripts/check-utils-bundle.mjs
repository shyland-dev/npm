// Prova que o código de dev da utils (logger, shyInvariant, shyDeprecated, shyDevOnly, shyMeasure) sai do bundle de produção.
// ngDevMode não é API pública documentada: este check detecta se uma versão futura do Angular parar de removê-lo.
// Controle positivo: o build de desenvolvimento do mesmo app precisa conter todos os marcadores.
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, isMain, report } from './_shared.mjs';

const MARKERS = ['[shy:', '%c[', 'shyLog', '[shy] invariant', ' depreciado.', 'marcador-devonly'];

const build = (configuration) => spawnSync('npx', ['ng', 'build', 'utils-check', '-c', configuration], { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });

function bundleText(configuration) {
  const dir = join(ROOT, 'dist/utils-check', configuration === 'production' ? 'prod' : 'dev', 'browser');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n');
}

export function checkUtilsBundle() {
  const errors = [];
  for (const configuration of ['production', 'development']) {
    const result = build(configuration);
    if (result.status !== 0) return { errors: [`ng build utils-check -c ${configuration} falhou:\n${result.stdout}${result.stderr}`], warnings: [] };
  }
  const prod = bundleText('production');
  const dev = bundleText('development');

  const missingInDev = MARKERS.filter((m) => !dev.includes(m));
  if (missingInDev.length) errors.push(`controle positivo falhou: marcadores ausentes no build de desenvolvimento: ${missingInDev.join(', ')}`);
  const leftInProd = MARKERS.filter((m) => prod.includes(m));
  if (leftInProd.length) errors.push(`código de dev sobrou no bundle de produção (marcadores: ${leftInProd.join(', ')}): o guard de ngDevMode deixou de ser removido?`);
  console.log(`  marcadores de dev: ${MARKERS.length - missingInDev.length}/${MARKERS.length} no build de dev, ${leftInProd.length} no build de produção`);
  return { errors, warnings: [] };
}

if (isMain(import.meta.url)) {
  const { errors, warnings } = checkUtilsBundle();
  process.exit(report('check-utils-bundle', errors, warnings));
}
