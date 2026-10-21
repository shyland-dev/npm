import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const STYLES = join(ROOT, 'src/libs/ui/src/lib/styles');
export const SKIP_DIRS = new Set(['node_modules', 'dist', 'out-tsc', '.angular', '.git']);

export const rel = (file) => relative(ROOT, file).split(sep).join('/');
export const read = (file) => readFileSync(file, 'utf8');

export function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
}

export const sourceFiles = (exts) => [join(ROOT, 'src/libs/ui/src'), join(ROOT, 'src/apps')].flatMap((dir) => walk(dir, exts));

/** Troca comentários por espaços (preserva números de linha). */
export function stripComments(text, kind) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  let out = text.replace(/\/\*[\s\S]*?\*\//g, blank);
  if (kind !== 'css') out = out.replace(/(^|[^:'"\\])\/\/.*$/gm, (m, p) => p + ' '.repeat(m.length - p.length));
  if (kind === 'html') out = out.replace(/<!--[\s\S]*?-->/g, blank);
  return out;
}

export function loadJson(file, fallback) {
  return existsSync(file) ? JSON.parse(read(file)) : fallback;
}

export function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

export function report(name, errors, warnings = []) {
  for (const w of warnings) console.warn(`  aviso: ${w}`);
  if (errors.length) {
    console.error(`✗ ${name}: ${errors.length} problema(s)`);
    for (const e of errors) console.error(`  ${e}`);
    return 1;
  }
  console.log(`✓ ${name}${warnings.length ? ` (${warnings.length} aviso(s))` : ''}`);
  return 0;
}

export const isMain = (metaUrl) => process.argv[1] && fileURLToPath(metaUrl) === process.argv[1];
