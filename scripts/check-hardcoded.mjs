// Plano 15.1 / CLAUDE.md: SCSS de componente sem literal de cor, tempo, easing, z-index ou fonte fixa.
import { join } from 'node:path';
import { ROOT, isMain, lineOf, loadJson, read, rel, report, sourceFiles, stripComments } from './_shared.mjs';

const RULES = [
  ['cor literal', /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|hwb|lab|lch)\(/g],
  ['paleta antiga $color-*', /\$color-[\w-]+/g],
  ['tempo literal', /(?<![\w.$#-])\d*\.?\d+m?s\b/g],
  ['easing literal', /\bcubic-bezier\(|(?<![\w-])ease(?:-in|-out|-in-out)?(?![\w-])/g],
  ['z-index fora de z()', /z-index:[ \t]*(?!z\(|var\(|calc\(|-?[01]\s*;)\S[^;]*;/g],
  ['font-family fixa', /font-family:[ \t]*(?!var\(--shy-)\S[^;]*;/g],
];
const EXCLUDE = (path) => path.includes('/styles/') || path.includes('/assets/');

export function checkHardcoded({ printBaseline = false } = {}) {
  const baseline = loadJson(join(ROOT, 'scripts/hardcoded-baseline.json'), {});
  const errors = [];
  const counts = {};

  for (const file of sourceFiles(['.scss'])) {
    const path = rel(file);
    if (EXCLUDE(path)) continue;
    const text = stripComments(read(file), 'scss');
    const hits = RULES.flatMap(([label, re]) => [...text.matchAll(re)].map((m) => ({ label, line: lineOf(text, m.index), text: m[0].trim() })));
    const allowed = baseline[path] ?? 0;
    if (printBaseline) {
      if (hits.length) counts[path] = hits.length;
      continue;
    }

    if (hits.length > allowed) for (const h of hits) errors.push(`${path}:${h.line} ${h.label}: ${h.text}${allowed ? ` (baseline: ${allowed})` : ''}`);
    else if (hits.length < allowed) errors.push(`${path}: baseline desatualizada (${allowed} → ${hits.length}); reduza em scripts/hardcoded-baseline.json`);
  }
  if (printBaseline) console.log(JSON.stringify(counts, null, 2));
  return errors;
}

if (isMain(import.meta.url)) process.exit(report('check-hardcoded', checkHardcoded({ printBaseline: process.argv.includes('--print-baseline') })));
