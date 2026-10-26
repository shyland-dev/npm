// Valida os pacotes buildados (ui e utils) com publint e are-the-types-wrong, via npx sob demanda (sem virar dependência).
// Pré-requisito: npm run build. Versões fixas para o resultado ser reproduzível; atualize quando quiser.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, isMain, report } from './_shared.mjs';

const PUBLINT = 'publint@0.3.25';
const ATTW = '@arethetypeswrong/cli@0.18.5';
const PACKAGES = ['src/libs/ui/dist/ui', 'src/libs/utils/dist/utils'];

const npx = (args) => spawnSync('npx', ['--yes', ...args], { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });

export function checkPkg() {
  const errors = [];
  for (const dir of PACKAGES) {
    if (!existsSync(join(ROOT, dir, 'package.json'))) {
      errors.push(`${dir} não existe: rode npm run build antes`);
      continue;
    }
    // Pacotes ESM-only (type: module, sem CJS): esm-only ignora a resolução node10/CJS. O ui ainda reporta
    // internal-resolution-error só na resolução node10 (sem `exports`), que o Angular 21 não usa; por isso a regra é ignorada.
    for (const [name, args] of [
      ['publint', [PUBLINT, '--strict', dir]],
      ['attw', [ATTW, '--pack', dir, '--profile', 'esm-only', '--ignore-rules', 'internal-resolution-error']],
    ]) {
      const result = npx(args);
      console.log(`  ${name} ${dir}: ${result.status === 0 ? 'ok' : 'falhou'}`);
      if (result.status !== 0) errors.push(`${name} falhou em ${dir}:\n${result.stdout}${result.stderr}`);
    }
  }
  return { errors, warnings: [] };
}

if (isMain(import.meta.url)) {
  const { errors, warnings } = checkPkg();
  process.exit(report('check-pkg', errors, warnings));
}
