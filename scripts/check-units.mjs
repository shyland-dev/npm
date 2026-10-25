// Plano 6.4: nenhuma unidade de comprimento literal fora de tokens/units.css e _breakpoints.scss.
import { join } from 'node:path';
import { ROOT, STYLES, isMain, lineOf, loadJson, read, rel, report, sourceFiles, stripComments } from './_shared.mjs';

const UNITS = 'px|rem|em|vw|vh|vmin|vmax|svw|svh|lvw|lvh|dvw|dvh|ch|ex|cap|lh|rlh|pt|pc|cm|mm|in|cqw|cqh|cqi|cqb|cqmin|cqmax';
const UNIT_RE = new RegExp(`(?<![\\w.$#@-])-?(?:\\d+\\.?\\d*|\\.\\d+)(?:${UNITS})\\b`, 'g');
const STYLE_BINDING_RE = /\[style\.[\w-]+\.(?:px|em|rem|vw|vh|pt)\]/g;
const REMOVED_NAMES_RE = /(?<![\w-])(?:--responsive-unit|--dynamic-[\w-]+|\$responsive-unit|\$dynamic-[\w-]+)/g;

const ALLOWED_FILES = new Set([
  rel(join(STYLES, 'tokens/units.css')), // E1
  rel(join(STYLES, '_breakpoints.scss')), // E2
  'src/libs/ui/icons/src/icons.ts', // E4: strings de SVG (gerado)
  'src/libs/ui/src/lib/components/icon/internal-icons.ts', // E4: idem
]);
const ALLOWED_DIRS = ['src/libs/ui/src/assets/']; // fontes dos ícones (Bootstrap Icons); não vão para o pacote

export function checkUnits() {
  const baseline = loadJson(join(ROOT, 'scripts/units-baseline.json'), {});
  const errors = [];

  for (const file of sourceFiles(['.css', '.scss', '.html', '.ts'])) {
    const path = rel(file);
    if (ALLOWED_FILES.has(path) || ALLOWED_DIRS.some((d) => path.startsWith(d)) || path.endsWith('.spec.ts')) continue;

    const kind = path.endsWith('.html') ? 'html' : path.endsWith('.css') ? 'css' : 'scss';
    let text = stripComments(read(file), kind);
    text = text.replace(/url\([^)]*\)/g, (m) => ' '.repeat(m.length)).replace(/#[0-9a-fA-F]{3,8}\b/g, (m) => ' '.repeat(m.length));
    if (kind === 'html') text = text.replace(/\sviewBox="[^"]*"/g, '');

    const hits = [];
    for (const re of [UNIT_RE, STYLE_BINDING_RE]) for (const m of text.matchAll(re)) hits.push({ line: lineOf(text, m.index), text: m[0] });

    const allowed = baseline[path] ?? 0;
    if (hits.length > allowed) {
      const label = allowed ? ` (baseline: ${allowed})` : '';
      for (const h of hits) errors.push(`${path}:${h.line} unidade proibida "${h.text}"${label}`);
    } else if (hits.length < allowed) {
      errors.push(`${path}: baseline desatualizada (${allowed} → ${hits.length}); reduza em scripts/units-baseline.json`);
    }

    for (const m of text.matchAll(REMOVED_NAMES_RE)) errors.push(`${path}:${lineOf(text, m.index)} nome removido "${m[0]}" (use --shy-responsive-unit, ru() ou --shy-dynamic-*)`);
  }

  return errors;
}

if (isMain(import.meta.url)) process.exit(report('check-units', checkUnits()));
