import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const SVG_DIR = join(__dirname, '../projects/shy/ui/src/assets/svg');
const OUTPUT = join(__dirname, '../projects/shy/ui/src/lib/components/icon/icons.ts');

const files = readdirSync(SVG_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort();

const entries = files.map((file) => {
  const name = basename(file, '.svg');
  const content = readFileSync(join(SVG_DIR, file), 'utf-8').trim();
  return `  '${name}': \`${content}\``;
});

const output = `// Arquivo gerado automaticamente por scripts/generate-icons.mjs
// Para adicionar/editar ícones, modifique os arquivos em projects/shy-ui/src/assets/svg/
// e execute: npm run generate:icons
export const ICONS: Record<string, string> = {
${entries.join(',\n')},
};
`;

writeFileSync(OUTPUT, output, 'utf-8');

console.log(`✓ icons.ts gerado com ${files.length} ícones:`);
files.forEach((f) => console.log(`  - ${basename(f, '.svg')}`));
