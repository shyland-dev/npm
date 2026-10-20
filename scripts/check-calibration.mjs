// Plano 15.1: converte os tokens em ru para px nos viewports de referência (rem = 16 px, ADR-F0-6).
import { join } from 'node:path';
import { STYLES, isMain, read, report } from './_shared.mjs';

const REM = 16;
const VIEWPORTS = [
  ['360×800', 360, 800],
  ['390×844', 390, 844],
  ['768×1024', 768, 1024],
  ['1366×768', 1366, 768],
  ['1920×1080', 1920, 1080],
  ['2560×1440', 2560, 1440],
  ['3840×2160', 3840, 2160],
];
const WORST = VIEWPORTS[0];
const LIMITS = { textMin: 12, bodyMin: 14, controlMin: 24, coarseControlMd: 44, maxGrowth4k: 2.1 };

const ruPx = (w, h) => 0.1 * REM + (0.1 * Math.min(w, h)) / 100;
const RU_RE = /--shy-([\w-]+):\s*calc\(var\(--shy-responsive-unit\) \* (-?[\d.]+)\);/g;

function parseTokens(css) {
  return Object.fromEntries([...css.matchAll(RU_RE)].map((m) => [m[1], Number(m[2])]));
}

export function calibrate() {
  const css = read(join(STYLES, 'tokens/primitives.css'));
  const [base, coarseBlock = ''] = css.split('@media (pointer: coarse)');
  const tokens = parseTokens(base);
  const coarse = parseTokens(coarseBlock);
  const errors = [];
  const px = (mult, vp = WORST) => mult * ruPx(vp[1], vp[2]);

  for (const [name, mult] of Object.entries(tokens)) {
    if (name.startsWith('text-') && px(mult) < LIMITS.textMin) errors.push(`${name}: ${px(mult).toFixed(1)} px em ${WORST[0]} (mínimo ${LIMITS.textMin})`);
    if (name === 'text-md' && px(mult) < LIMITS.bodyMin) errors.push(`${name}: corpo com ${px(mult).toFixed(1)} px em ${WORST[0]} (mínimo ${LIMITS.bodyMin})`);
    if (name.startsWith('size-control-') && px(mult) < LIMITS.controlMin) errors.push(`${name}: ${px(mult).toFixed(1)} px em ${WORST[0]} (WCAG 2.5.8, mínimo ${LIMITS.controlMin})`);
  }
  if (px(coarse['size-control-md'] ?? 0) < LIMITS.coarseControlMd) errors.push(`size-control-md (pointer: coarse) abaixo de ${LIMITS.coarseControlMd} px em ${WORST[0]}`);

  const growth = ruPx(3840, 2160) / ruPx(WORST[1], WORST[2]);
  if (growth > LIMITS.maxGrowth4k) errors.push(`crescimento 4K/${WORST[0]} = ${growth.toFixed(2)}× (limite ${LIMITS.maxGrowth4k}×)`);

  return { errors, tokens, coarse, growth };
}

export function table(tokens, names) {
  const head = ['token', 'ru', ...VIEWPORTS.map(([n]) => n)];
  const rows = names.map((n) => [n, tokens[n], ...VIEWPORTS.map(([, w, h]) => (tokens[n] * ruPx(w, h)).toFixed(1))]);
  return [head, ...rows].map((r) => r.join('\t')).join('\n');
}

if (isMain(import.meta.url)) {
  const { errors, tokens, growth } = calibrate();
  if (process.argv.includes('--table'))
    console.log(
      table(
        tokens,
        Object.keys(tokens).filter((n) => /^(text|size|space)-/.test(n)),
      ),
    );
  console.log(`  ru: ${VIEWPORTS.map(([n, w, h]) => `${n}=${ruPx(w, h).toFixed(2)}`).join('  ')}  (4K/360: ${growth.toFixed(2)}×)`);
  process.exit(report('check-calibration', errors));
}
