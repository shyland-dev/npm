// Plano 5 / 15.1: woff2 e OFL.txt presentes, referenciados por fonts.css e dentro do orçamento.
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { STYLES, isMain, read, report } from './_shared.mjs';

const BUDGET_KB = 150;

export function checkFonts() {
  const errors = [];
  const dir = join(STYLES, 'fonts');
  const css = read(join(STYLES, 'fonts.css'));
  let total = 0;

  const families = existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : [];
  if (!families.length) errors.push('nenhuma fonte em styles/fonts/');

  for (const family of families) {
    const files = readdirSync(join(dir, family));
    const woff2 = files.filter((f) => f.endsWith('.woff2'));
    if (!woff2.length) errors.push(`${family}: woff2 ausente`);
    if (!files.includes('OFL.txt')) errors.push(`${family}: OFL.txt ausente`);
    else if (!/SIL OPEN FONT LICENSE/i.test(read(join(dir, family, 'OFL.txt')))) errors.push(`${family}: OFL.txt sem o texto da licença`);
    for (const f of woff2) {
      total += statSync(join(dir, family, f)).size;
      if (!css.includes(`./fonts/${family}/${f}`)) errors.push(`${family}/${f} não referenciado em fonts.css`);
    }
  }

  for (const m of css.matchAll(/url\('\.\/([^']+)'\)/g)) if (!existsSync(join(STYLES, m[1]))) errors.push(`fonts.css aponta para arquivo inexistente: ${m[1]}`);
  if (total > BUDGET_KB * 1024) errors.push(`fontes somam ${(total / 1024).toFixed(0)} KB (orçamento ${BUDGET_KB} KB)`);
  console.log(`  fontes: ${(total / 1024).toFixed(1)} KB de ${BUDGET_KB} KB`);
  return errors;
}

if (isMain(import.meta.url)) process.exit(report('check-fonts', checkFonts()));
