// Plano 15.1: consistência dos tokens --shy-* entre temas, usos e a escala de camadas.
import { join } from 'node:path';
import { STYLES, isMain, read, rel, report, sourceFiles, stripComments, walk } from './_shared.mjs';

const DEF_RE = /(--shy-[a-z0-9-]+)\s*:/g;
const USE_RE = /var\(\s*(--shy-[a-z0-9-]+)\s*(,)?/g;
const LEGACY_RE = /--shy[A-Z][\w]*/g;

const names = (css, re = DEF_RE) => new Set([...css.matchAll(re)].map((m) => m[1]));
const semantic = (css) => new Set([...names(css)].filter((n) => /^--shy-(color|shadow)-/.test(n)));

export function checkTokens() {
  const errors = [];
  const warnings = [];
  const tokenFiles = walk(join(STYLES, 'tokens'), ['.css']);

  const dark = semantic(read(join(STYLES, 'tokens/semantic-dark.css')));
  const light = semantic(read(join(STYLES, 'tokens/semantic-light.css')));
  for (const n of dark) if (!light.has(n)) errors.push(`${n} existe no tema escuro e falta no claro`);
  for (const n of light) if (!dark.has(n)) errors.push(`${n} existe no tema claro e falta no escuro`);

  const defined = new Set();
  const used = new Map();
  const files = [...tokenFiles, ...sourceFiles(['.css', '.scss', '.html', '.ts']).filter((f) => !f.includes('/assets/') && !f.endsWith('.spec.ts'))];
  let legacy = 0;
  for (const file of new Set(files)) {
    const kind = file.endsWith('.css') ? 'css' : 'scss';
    const text = stripComments(read(file), kind);
    for (const n of names(text)) defined.add(n);
    for (const m of text.matchAll(USE_RE)) {
      if (/#\{/.test(text.slice(m.index, m.index + m[0].length + 6))) continue;
      if (!used.has(m[1])) used.set(m[1], { required: false, files: new Set() });
      const u = used.get(m[1]);
      u.files.add(rel(file));
      if (!m[2]) u.required = true;
    }
    legacy += [...text.matchAll(LEGACY_RE)].length;
  }
  // 'var(--shy-' + nome + ...' em template gera prefixos dinâmicos (terminam em '-'): contam como uso de todos os tokens com aquele prefixo
  const prefixes = [...used.keys()].filter((n) => n.endsWith('-'));
  for (const [n, u] of used) if (!n.endsWith('-') && u.required && !defined.has(n)) errors.push(`${n} usado e nunca definido (${[...u.files].join(', ')})`);

  const unused = [...defined].filter((n) => !used.has(n) && !prefixes.some((p) => n.startsWith(p)));
  if (unused.length) warnings.push(`${unused.length} token(s) definido(s) e ainda não usado(s) (esperado na F1; revisar na F5)`);
  if (legacy) warnings.push(`${legacy} ocorrência(s) de custom property camelCase legada (--shyXxx); migram para kebab-case na F2`);

  const layersScss =
    read(join(STYLES, '_layers.scss'))
      .match(/\$layers:\s*\(([^)]*)\)/)?.[1]
      .split(',')
      .map((s) => s.trim()) ?? [];
  const layersCss = [...read(join(STYLES, 'tokens/layers.css')).matchAll(/--shy-z-([a-z]+):/g)].map((m) => m[1]);
  if (layersScss.join() !== layersCss.join()) errors.push(`camadas diferentes: _layers.scss [${layersScss}] ≠ layers.css [${layersCss}]`);

  return { errors, warnings };
}

if (isMain(import.meta.url)) {
  const { errors, warnings } = checkTokens();
  process.exit(report('check-tokens', errors, warnings));
}
