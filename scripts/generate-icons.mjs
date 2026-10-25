import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const SVG_DIR = join(__dirname, '../src/libs/ui/src/assets/svg');
const CATALOG = join(__dirname, '../src/libs/ui/icons/src/icons.ts');
const CATALOG_MAP = join(__dirname, '../src/libs/ui/icons/catalog/src/icons-catalog.ts');
const INTERNAL = join(__dirname, '../src/libs/ui/src/lib/components/icon/internal-icons.ts');

// Ícones usados pelos próprios componentes (e o fallback): sempre registrados, sem precisar de provideShyIcons.
// Ao usar um ícone novo dentro de um componente da lib, acrescente o nome aqui.
const INTERNAL_NAMES = ['arrow-down-short', 'arrow-down-up', 'arrow-up-short', 'check', 'check-circle', 'check-lg', 'chevron-down', 'chevron-left', 'chevron-right', 'exclamation-circle', 'exclamation-lg', 'exclamation-triangle', 'info-circle', 'list', 'person-fill', 'question-circle', 'upload', 'x', 'x-lg'];

const HEADER = `// Arquivo gerado automaticamente por scripts/generate-icons.mjs
// Para adicionar/editar ícones, modifique os arquivos em src/libs/ui/src/assets/svg/
// e execute: npm run generate:icons`;

const files = readdirSync(SVG_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort();

/** 'camera-video-fill' -> 'iconCameraVideoFill' ('0-circle' -> 'icon0Circle'). */
const exportName = (name) => 'icon' + name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

const icons = files.map((file) => {
  const name = basename(file, '.svg');
  return { name, id: exportName(name), svg: readFileSync(join(SVG_DIR, file), 'utf-8').trim() };
});

const ids = new Set(icons.map((i) => i.id));
if (ids.size !== icons.length) throw new Error('Nomes de export duplicados em assets/svg');
for (const name of INTERNAL_NAMES) if (!icons.some((i) => i.name === name)) throw new Error(`Ícone interno ausente: ${name}`);

const entry = (i) => `export const ${i.id}: ShyIcon = { name: '${i.name}', svg: \`${i.svg}\` };`;

mkdirSync(join(CATALOG, '..'), { recursive: true });
mkdirSync(join(CATALOG_MAP, '..'), { recursive: true });
writeFileSync(
  CATALOG,
  `${HEADER}
import type { ShyIcon } from './icon.interface';

${icons.map(entry).join('\n')}

/** Catálogo completo (nome -> SVG). Importar isto traz todos os ícones; para tree-shaking use os exports \`icon*\`. */
export const ICONS: Record<string, string> = /* @__PURE__ */ toCatalog([
${icons.map((i) => `  ${i.id},`).join('\n')}
]);

function toCatalog(list: ShyIcon[]): Record<string, string> {
  return Object.fromEntries(list.map((icon) => [icon.name, icon.svg]));
}
`,
  'utf-8',
);

// Cópia do catálogo para o \`import()\` do IconRegistry, num entry point próprio e sem importar nada de /icons. Se o
// import() apontasse para o mesmo módulo que o app importa estaticamente (\`iconX\`), o bundler manteria todos os ícones
// no bundle inicial (medido na 1.1.0: 2,5 MB ao registrar um único ícone).
writeFileSync(
  CATALOG_MAP,
  `${HEADER}

/** Catálogo completo (nome -> SVG). Importar isto traz todos os ícones; para tree-shaking use os exports \`icon*\`. */
export const ICONS: Record<string, string> = {
${icons.map((i) => `  '${i.name}': \`${i.svg}\`,`).join('\n')}
};
`,
  'utf-8',
);

const internal = INTERNAL_NAMES.map((n) => icons.find((i) => i.name === n));
writeFileSync(
  INTERNAL,
  `${HEADER}
import type { ShyIcon } from '@shyland-dev/ui/icons';

export const INTERNAL_ICONS: readonly ShyIcon[] = [
${internal.map((i) => `  { name: '${i.name}', svg: \`${i.svg}\` },`).join('\n')}
];
`,
  'utf-8',
);

console.log(`✓ ${icons.length} ícones no catálogo, ${internal.length} internos`);
