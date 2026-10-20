// Plano 15.1: razão de contraste WCAG 2 dos pares de scripts/contrast-pairs.json em cada tema.
import { join } from 'node:path';
import { ROOT, STYLES, isMain, read, report } from './_shared.mjs';

const THEMES = { dark: 'tokens/semantic-dark.css', light: 'tokens/semantic-light.css' };

function declarations(css) {
  return Object.fromEntries([...css.matchAll(/(--shy-[a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

function parseColor(value) {
  let m = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  m = value.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+)%)?\s*\)$/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] / 100 };
  return null;
}

const over = (top, bottom) => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});

const luminance = ({ r, g, b }) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

export const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export function checkContrast({ verbose = false } = {}) {
  const primitives = declarations(read(join(STYLES, 'tokens/primitives.css')));
  const pairs = JSON.parse(read(join(ROOT, 'scripts/contrast-pairs.json'))).pairs;
  const errors = [];

  for (const [theme, file] of Object.entries(THEMES)) {
    const vars = { ...primitives, ...declarations(read(join(STYLES, file))) };
    const resolve = (name, depth = 0) => {
      const raw = vars[name];
      if (raw === undefined || depth > 8) throw new Error(`token ${name} não resolvido no tema ${theme}`);
      const ref = raw.match(/^var\((--shy-[a-z0-9-]+)\)$/);
      return ref ? resolve(ref[1], depth + 1) : raw;
    };
    const color = (token) => {
      const parsed = parseColor(resolve(`--shy-color-${token}`));
      if (!parsed) throw new Error(`cor inválida em ${token} (${theme})`);
      return parsed;
    };
    const page = color('bg');

    for (const { fg, bg, min } of pairs) {
      const background = over(color(bg), page);
      const foreground = over(color(fg), background);
      const value = ratio(foreground, background);
      const ok = value >= min;
      if (verbose || !ok) (ok ? console.log : (m) => errors.push(m))(`${theme}: ${fg} sobre ${bg} = ${value.toFixed(2)}:1 (mín. ${min})`);
    }
  }
  return errors;
}

if (isMain(import.meta.url)) process.exit(report('check-contrast', checkContrast({ verbose: process.argv.includes('--verbose') })));
