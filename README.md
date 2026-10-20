# npm

Monorepo Angular 21 com biblioteca de componentes UI e utilitários.

## Pacotes

| Pacote               | Caminho          | Descrição                                  |
| -------------------- | ---------------- | ------------------------------------------ |
| `@shyland-dev/ui`    | `src/libs/ui`    | Biblioteca de componentes UI reutilizáveis |
| `@shyland-dev/utils` | `src/libs/utils` | Serviços e utilitários Angular             |

## Início rápido

```bash
npm ci          # Instala as dependências e cria os symlinks de workspace
npm run build   # Compila as libs para dist/
```

> Em desenvolvimento, as libs são resolvidas via `tsconfig.json` — não é necessário fazer build antes de usar o showcase.

## Scripts

| Comando                  | Descrição                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `npm start`              | Inicia o showcase (`ng serve showcase --port 4201`)                                          |
| `npm run build`          | Build de `@shyland-dev/ui` e `@shyland-dev/utils`                                            |
| `npm run build:ui`       | Build da biblioteca `@shyland-dev/ui`                                                        |
| `npm run build:utils`    | Build da biblioteca `@shyland-dev/utils`                                                     |
| `npm run build:showcase` | Build do showcase                                                                            |
| `npm run generate:icons` | Gera `icons.ts` a partir dos SVGs em `src/libs/ui/src/assets/svg/`                           |
| `npm run check:ds`       | Verificações do Design System (unidades, calibração, tokens, contraste, literais, fontes)    |
| `npm test`               | Testes da `ui` (`ng test ui --watch=false`: `@angular/build:unit-test` + vitest + happy-dom) |

## Design System (em desenvolvimento)

A lib `@shyland-dev/ui` está sendo reescrita como Design System na branch `feat/design-system`.

- Plano mestre: [`docs/DESIGN-SYSTEM-PLAN.md`](docs/DESIGN-SYSTEM-PLAN.md) (fases F0 a F5, tokens, temas, unidades, componentes).
- Regras do repo para o Claude: [`CLAUDE.md`](CLAUDE.md).
- Estado das fases: [`docs/design-system/progress.md`](docs/design-system/progress.md).

Para avançar com o Claude (CLI ou thread do projeto), mande só `/build`: ele lê o estado em `progress.md` e executa o próximo passo (plano da fase, implementação ou gate com commit). `/build status` mostra onde está sem executar nada. Não confundir com `npm run build`.

## Componentes (`@shyland-dev/ui`)

| Componente      | Selector             | Descrição                                                           |
| --------------- | -------------------- | ------------------------------------------------------------------- |
| **Icon**        | `<shy-icon>`         | Ícones SVG inline com suporte a hover fill e tamanho customizável   |
| **Select**      | `<shy-select>`       | Dropdown customizável com suporte a ícones e imagens nas opções     |
| **Snackbar**    | `<shy-snackbar>`     | Notificação temporária no topo ou rodapé da página                  |
| **ThemeToggle** | `<shy-theme-toggle>` | Controle segmentado claro / sistema / escuro (usa o `ThemeService`) |

---

### IconComponent

```typescript
import { IconComponent } from '@shyland-dev/ui';
```

O nome do ícone é passado como conteúdo da tag (content projection):

```html
<!-- básico -->
<shy-icon>home</shy-icon>

<!-- com hover fill (troca para versão preenchida ao passar o mouse) -->
<shy-icon [hoverFill]="true">heart</shy-icon>

<!-- com delay na transição de hover (em ms) -->
<shy-icon [hoverFill]="true" [hoverFillDelay]="200">star</shy-icon>
```

| Input            | Tipo      | Padrão  | Descrição                                                                                      |
| ---------------- | --------- | ------- | ---------------------------------------------------------------------------------------------- |
| `hoverFill`      | `boolean` | `false` | Troca para a variante `-fill` do ícone ao passar o mouse                                       |
| `hoverFillDelay` | `number`  | `0`     | Duração da transição entre o estado normal e o fill (em ms)                                    |
| `name`           | `string`  | —       | Nome do ícone; tem prioridade sobre o conteúdo projetado                                       |
| `label`          | `string`  | —       | Nome acessível: vira `role="img"` + `aria-label`. Sem ele o ícone é decorativo (`aria-hidden`) |

**Customização via CSS:**

```scss
shy-icon {
    --shy-icon-size: var(--shy-size-icon-lg); /* tamanho (padrão: --shy-size-icon-md) */
    color: red; /* cor via currentColor */
}
```

Os ícones disponíveis são gerados a partir dos SVGs em `src/libs/ui/src/assets/svg/` (conjunto Bootstrap Icons). Variantes preenchidas usam o sufixo `-fill` (ex: `heart-fill`).

Para adicionar ícones, coloque o `.svg` em `src/libs/ui/src/assets/svg/` e execute:

```bash
npm run generate:icons
```

---

### SelectComponent

```typescript
import { SelectComponent, SelectOption, SelectionChangeEvent } from '@shyland-dev/ui';
```

```html
<shy-select [selectOptions]="options" [selectedOption]="valorAtual" [selectIcon]="'check'" [dropdownIcon]="'chevron-down'" (onSelectionChange)="onSelect($event)"></shy-select>
```

```typescript
import { SelectOption, SelectionChangeEvent } from '@shyland-dev/ui';

options: SelectOption[] = [
  { id: 0, value: 'a', label: 'Opção A' },
  { id: 1, value: 'b', label: 'Opção B', img: 'https://...' },
];

onSelect(event: SelectionChangeEvent) {
  console.log(event.selectedOption.value);
}
```

| Input            | Tipo             | Padrão           | Descrição                                                 |
| ---------------- | ---------------- | ---------------- | --------------------------------------------------------- |
| `selectOptions`  | `SelectOption[]` | `[]`             | Array de opções do dropdown                               |
| `selectedOption` | `string \| null` | `null`           | Valor da opção pré-selecionada (sincronizado via `value`) |
| `selectIcon`     | `string`         | `'check'`        | Ícone exibido ao lado da opção selecionada                |
| `dropdownIcon`   | `string`         | `'chevron-down'` | Ícone no botão de abertura do dropdown                    |

| Output              | Payload                | Descrição                              |
| ------------------- | ---------------------- | -------------------------------------- |
| `onSelectionChange` | `SelectionChangeEvent` | Emitido quando o usuário escolhe opção |

**Interface `SelectOption`:**

```typescript
interface SelectOption {
    id: number;
    value: string;
    label: string;
    img?: string; // URL de imagem opcional exibida na opção
}
```

**Customização via CSS:**

```scss
shy-select {
    --shy-select-height: var(--shy-size-control-lg);
    --shy-select-bg: var(--shy-color-primary-soft);
    --shy-select-radius: var(--shy-radius-full);
}
```

| Token                            | Padrão                        | Descrição                    |
| -------------------------------- | ----------------------------- | ---------------------------- |
| `--shy-select-height`            | `--shy-size-control-lg`       | Altura mínima do trigger     |
| `--shy-select-width`             | `ru(90)`                      | Largura mínima               |
| `--shy-select-radius`            | `--shy-radius-md`             | Raio do trigger e do painel  |
| `--shy-select-bg`                | `--shy-color-surface-sunken`  | Fundo do trigger             |
| `--shy-select-fg`                | `--shy-color-text`            | Texto e ícones               |
| `--shy-select-border`            | `--shy-color-border-strong`   | Borda do trigger             |
| `--shy-select-font-family`       | `--shy-font-family-base`      | Fonte                        |
| `--shy-select-font-size`         | `--shy-text-md`               | Tamanho da fonte             |
| `--shy-select-icon-size`         | `--shy-size-icon-md`          | Tamanho dos ícones internos  |
| `--shy-select-panel-bg`          | `--shy-color-surface-raised`  | Fundo do painel              |
| `--shy-select-panel-shadow`      | `--shy-shadow-3`              | Sombra do painel             |
| `--shy-select-selected-fg`       | `--shy-color-primary-text`    | Cor da opção selecionada     |
| `--shy-select-option-hover-bg`   | `--shy-color-primary-soft`    | Fundo da opção em hover/foco |
| `--shy-select-option-hover-fg`   | `--shy-color-on-primary-soft` | Texto da opção em hover/foco |
| `--shy-select-option-img-radius` | `--shy-radius-full`           | Raio da imagem da opção      |

---

### SnackbarComponent + SnackbarService

```typescript
import { SnackbarComponent, SnackbarService } from '@shyland-dev/ui';
```

**No template:**

```html
<!-- texto inline via ng-content -->
<shy-snackbar #snackbar1>Copiado com sucesso!</shy-snackbar>

<!-- posição e delay configurados no template -->
<shy-snackbar #snackbar2 position="top" [dismissDelay]="5000"></shy-snackbar>
```

**No TypeScript:**

```typescript
constructor(private snackbarService: SnackbarService) {}

// exibe com texto inline e configurações do template
this.snackbarService.show({ element: this.snackbar1 });

// sobrescreve posição, delay e texto em runtime
this.snackbarService.show({
  element: this.snackbar2,
  position: 'top',
  delay: 3000,
  text: `Hoje é ${new Date().toLocaleDateString()}`,
});
```

| Input          | Tipo                | Padrão     | Descrição                                           |
| -------------- | ------------------- | ---------- | --------------------------------------------------- |
| `position`     | `'top' \| 'bottom'` | `'bottom'` | Posição da snackbar na tela                         |
| `dismissDelay` | `number`            | `3000`     | Tempo em ms até fechar automaticamente (0 = manual) |

**Métodos públicos:**

| Método      | Parâmetros                                 | Descrição                      |
| ----------- | ------------------------------------------ | ------------------------------ |
| `show()`    | `{ position?, delay?, text? }` (opcionais) | Exibe a snackbar               |
| `dismiss()` | —                                          | Fecha a snackbar imediatamente |

**Customização via CSS:**

```scss
shy-snackbar {
    --shy-snackbar-bg: var(--shy-color-primary-soft);
    --shy-snackbar-fg: var(--shy-color-on-primary-soft);
    --shy-snackbar-width: calc(var(--shy-responsive-unit) * 150);
}
```

| Token                        | Padrão                       | Descrição                            |
| ---------------------------- | ---------------------------- | ------------------------------------ |
| `--shy-snackbar-bg`          | `--shy-color-surface-raised` | Fundo                                |
| `--shy-snackbar-fg`          | `--shy-color-text`           | Texto e ícone                        |
| `--shy-snackbar-border`      | `--shy-color-border-strong`  | Borda                                |
| `--shy-snackbar-width`       | `ru(110)`                    | Largura mínima                       |
| `--shy-snackbar-radius`      | `--shy-radius-md`            | Raio                                 |
| `--shy-snackbar-offset`      | `ru(15)`                     | Distância da borda superior/inferior |
| `--shy-snackbar-font-family` | `--shy-font-family-base`     | Fonte                                |
| `--shy-snackbar-font-size`   | `--shy-text-md`              | Tamanho da fonte                     |
| `--shy-snackbar-icon-size`   | `--shy-size-icon-md`         | Tamanho do ícone de fechar           |

---

## Utilitários (`@shyland-dev/utils`)

| Export         | Descrição                                                       |
| -------------- | --------------------------------------------------------------- |
| `DebugService` | Logs de componente com nome e método, ativos apenas em dev mode |

### Uso do DebugService

```typescript
import { DebugService } from '@shyland-dev/utils';

constructor(private debugService: DebugService) {
  this.debugService.log(this); // [debug] @MeuComponent#constructor
}

ngOnInit(): void {
  this.debugService.log(this); // [debug] @MeuComponent#ngOnInit
}
```

---

## Instalação em uma aplicação Angular 21

### 1. Instalar os pacotes

```bash
npm install @shyland-dev/ui @shyland-dev/utils
```

---

### 2. Configurar os estilos globais (`@shyland-dev/ui`)

Tokens (cores, tipografia, espaço, motion, camadas), fontes self-hosted, animações e o reset base vêm em um único CSS. Escolha **uma** das formas:

```json
// angular.json > projects.<app>.architect.build.options.styles (recomendado)
"styles": ["node_modules/@shyland-dev/ui/styles/index.css", "src/styles.scss"]
```

```css
/* ou, em um arquivo .css */
@import '@shyland-dev/ui/styles/index.css';
```

```scss
// ou, em um arquivo .scss (equivalente ao index.css; não combine com as formas acima)
@use '@shyland-dev/ui/styles/global';
```

As fontes (JetBrains Mono, `woff2` subset latin, licença OFL em `styles/fonts/*/OFL.txt`) são emitidas pelo build do app em `media/`. Para evitar o flash de fonte, faça preload da principal:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="/media/JetBrainsMono-Variable.woff2" />
```

> Os nomes dos arquivos em `media/` podem ganhar hash conforme a configuração do build; confira a saída (`dist/<app>/browser/media`).

#### Tema (escuro por padrão)

O tema escuro vale sem JavaScript. O claro entra com `data-theme="light"` no `<html>`, gravado pelo `ThemeService`:

```typescript
import { ThemeService, provideShyTheme } from '@shyland-dev/ui';

// opcional: provideShyTheme({ defaultMode: 'system', storageKey: 'meu-tema' }) em providers
const theme = inject(ThemeService);
theme.setMode('light'); // 'dark' | 'light' | 'system'
theme.mode(); // modo escolhido (signal)
theme.resolved(); // 'dark' | 'light' efetivo (signal)
theme.toggle();
```

```html
<shy-theme-toggle />
<!-- rótulos traduzidos: [labels]="{ group: 'Tema', light: 'Claro', system: 'Sistema', dark: 'Escuro' }" -->
```

**Sem flash:** o `ThemeService` só roda depois do Angular carregar. Para aplicar o tema salvo antes do primeiro paint, coloque no `<head>` do `index.html` (use a mesma chave do `storageKey`; com CSP, libere por nonce ou hash):

```html
<script>
    (function () {
        try {
            var mode = localStorage.getItem('shy-theme');
            if (mode !== 'light' && mode !== 'system') mode = 'dark';
            var light = mode === 'light' || (mode === 'system' && matchMedia('(prefers-color-scheme: light)').matches);
            document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
            document.documentElement.setAttribute('data-theme-mode', mode);
        } catch (e) {}
    })();
</script>
```

Motion reduzido: `prefers-reduced-motion` já zera as durações; o app pode forçar com `data-motion="reduced"` no `<html>`.

---

### 3. Usar unidades, camadas e mixins nos SCSS

**Regra de unidades:** toda medida é `calc(var(--shy-responsive-unit) * N)`. Em SCSS, `ru(N)`; em TypeScript, o helper `ru(n)`. Nada de `px`, `rem`, `em`, `vw`, `vh` etc. (exceção só em `_breakpoints.scss`, nas condições de `@media`). Detalhes em [`docs/design-system/units.md`](docs/design-system/units.md).

```scss
@use '@shyland-dev/ui/styles' as *;

.meu-elemento {
    padding: ru(4) ru(6);
    border: var(--shy-border-width) solid var(--shy-color-border);
    background: var(--shy-color-surface);
    color: var(--shy-color-text);
    @include shy-layer(sticky); // z-index: var(--shy-z-sticky)
    @include up(md) {
        padding: ru(8);
    }
}
```

```typescript
import { ru } from '@shyland-dev/ui';

ru(4); // 'calc(var(--shy-responsive-unit) * 4)'
```

**Funções e mixins** (`@use '@shyland-dev/ui/styles'`):

| Item                                                                                                                   | Descrição                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ru($n)`                                                                                                               | `calc(var(--shy-responsive-unit) * $n)`; aceita decimais e negativos                                                                                       |
| `z($layer, $offset: 0)`                                                                                                | `z-index` de uma camada nomeada (`base`, `raised`, `dropdown`, `sticky`, `fixed`, `drawer`, `modal`, `popover`, `tooltip`, `toast`); `$offset` de -50 a 50 |
| `@include shy-layer($layer, $offset)`                                                                                  | `z-index: z($layer, $offset)`                                                                                                                              |
| `@include up($bp)` / `down($bp)`                                                                                       | Media query de largura (`sm` 600, `md` 840, `lg` 1200, `xl` 1600); único lugar com px                                                                      |
| `@include focus-ring`                                                                                                  | Anel de foco do contrato de estados                                                                                                                        |
| `@include shy-state(hover\|focus\|active)`                                                                             | Gera o seletor real (`hover` só com `@media (hover: hover)`) e `[data-shy-state]` para a matriz do showcase                                                |
| `@include state-layer`                                                                                                 | Camada de hover/pressed sem cor própria por variante                                                                                                       |
| `@include disabled-state`                                                                                              | `opacity` e `cursor` de desabilitado                                                                                                                       |
| `@include transition($props, $duration, $ease)`                                                                        | `transition` com os tokens de motion                                                                                                                       |
| `@include visually-hidden`                                                                                             | Esconde só visualmente (em ru, sem `1px`)                                                                                                                  |
| `fixedHeight`, `fixedWidth`, `fixedSquare`, `square`, `allVendors`, `landscape`, `portrait`, `dark-mode`, `light-mode` | Mixins antigos, mantidos por enquanto                                                                                                                      |

---

### 4. Usar os componentes UI

Importe os componentes standalone diretamente nos `imports` do seu componente ou módulo:

```typescript
import { IconComponent, SelectComponent, SnackbarComponent, SnackbarService } from '@shyland-dev/ui';

@Component({
    imports: [IconComponent, SelectComponent, SnackbarComponent],
    providers: [SnackbarService],
})
export class MeuComponent {}
```

---

### 5. Usar os utilitários

```typescript
import { DebugService } from '@shyland-dev/utils';

@Component({ providers: [DebugService] })
export class MeuComponent {
    constructor(private debug: DebugService) {
        this.debug.log(this); // [debug] @MeuComponent#constructor
    }
}
```

---

## Design Tokens

CSS custom properties `--shy-*` em kebab-case, em três camadas: primitivo (`--shy-primary-600`), semântico (`--shy-color-text`, muda com o tema) e de componente (F2 em diante). Componentes usam só os semânticos. Guia completo: [`docs/design-system/tokens.md`](docs/design-system/tokens.md).

| Grupo             | Exemplos                                                                                                                                                                                                   | Arquivo                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Unidades          | `--shy-responsive-unit`, `--shy-dynamic-height`, `--shy-dynamic-width` (+ `-unit`)                                                                                                                         | `tokens/units.css`                 |
| Primitivos        | `--shy-{primary,neutral,success,warning,danger,info}-{50…950}`, `--shy-gradient-brand`                                                                                                                     | `tokens/primitives.css`            |
| Tipografia        | `--shy-font-family-{mono,sans,base,code}`, `--shy-text-{xs…5xl}`, `--shy-weight-*`, `--shy-leading-*`                                                                                                      | `tokens/primitives.css`            |
| Espaço, forma     | `--shy-space-*`, `--shy-radius-*`, `--shy-size-control-*`, `--shy-size-icon-*`, `--shy-border-width*`, `--shy-focus-ring-*`                                                                                | `tokens/primitives.css`            |
| Semânticos de cor | `--shy-color-{bg,surface,surface-raised,surface-sunken,text*,border*,line,focus,scrim*,neutral-soft}`, por intenção `--shy-color-{primary,success,warning,danger,info}[-text\|-soft]` e `--shy-color-on-*` | `tokens/semantic-{dark,light}.css` |
| Sombras           | `--shy-shadow-1…5` (redefinidas por tema)                                                                                                                                                                  | `tokens/semantic-*.css`            |
| Motion            | `--shy-duration-*`, `--shy-ease-*`, `--shy-motion-distance`, `--shy-transition-*`                                                                                                                          | `tokens/motion.css`                |
| Camadas           | `--shy-z-{base,raised,dropdown,sticky,fixed,drawer,modal,popover,tooltip,toast}` (passo de 100)                                                                                                            | `tokens/layers.css`                |

> Mudança da `0.0.x` para a `0.1.0` (breaking), nos componentes: `--shyIconSize` → `--shy-icon-size`; `--shySelect*` → `--shy-select-*` e `--shySnackbar*` → `--shy-snackbar-*` (kebab-case, padrões vindos dos tokens semânticos, tabelas acima); o ícone de fallback para nome inexistente passa a ser `question-circle` (o `help` antigo nunca existiu); `Icon`, `Select` e `Snackbar` agora usam `input()`/`output()`/`model()` e `OnPush` (os nomes usados no template não mudam).
>
> Mudança da `0.0.x` para a `0.1.0` (breaking), nos nomes globais: `--responsive-unit`, `--dynamic-*`, `$responsive-unit`, `$dynamic-*` **deixaram de existir**, sem alias. Troque por `--shy-responsive-unit` / `ru(N)` e `--shy-dynamic-*`. As Sass variables `$color-*` (paleta antiga) também foram removidas (`_variables.scss` não existe mais); use os tokens `--shy-color-*`. Guia: [`docs/design-system/migration-0.0-to-0.1.md`](docs/design-system/migration-0.0-to-0.1.md).

---

## Exports (`@shyland-dev/ui`)

```typescript
// Componentes
export { IconComponent } from './lib/components/icon/icon.component';
export { SelectComponent } from './lib/components/select/select.component';
export { SnackbarComponent } from './lib/components/snackbar/snackbar.component';

export { ThemeToggleComponent, ShyThemeToggleLabels } from './lib/components/theme-toggle/theme-toggle.component';

// Serviços
export { SnackbarService } from './lib/services/snackbar/snackbar.service';
export { ThemeService, provideShyTheme, SHY_THEME_CONFIG, ShyThemeMode, ShyResolvedTheme, ShyThemeConfig } from './lib/services/theme/theme.service';

// Utilitários
export { ru } from './lib/utils/ru';

// Interfaces
export { SelectOption, SelectionChangeEvent } from './lib/interfaces/select/select.interface';
export { SnackbarShowOptions } from './lib/interfaces/snackbar/snackbar.interface';

// Types
export { SnackbarPosition } from './lib/types/snackbar/snackbar.type';

// Ícones
export { ICONS } from './lib/components/icon/icons';
```

---

## Estrutura do projeto

```
npm/
├── src/
│   ├── apps/                       # Aplicação showcase
│   │   └── app/components|foundations/  # Páginas de demonstração
│   └── libs/
│       ├── ui/                     # @shyland-dev/ui — componentes
│       │   └── src/
│       │       ├── assets/svg/     # Arquivos SVG fonte dos ícones
│       │       └── lib/
│       │           ├── components/
│       │           │   ├── icon/       # IconComponent
│       │           │   ├── select/     # SelectComponent
│       │           │   └── snackbar/   # SnackbarComponent
│       │           ├── interfaces/     # SelectOption, SnackbarShowOptions...
│       │           ├── services/
│       │           │   └── snackbar/   # SnackbarService
│       │           ├── styles/         # tokens/*.css, fonts/, index.css, _global.scss, _functions/_layers/_mixins.scss
│       │           ├── utils/          # ru()
│       │           └── types/          # SnackbarPosition
│       └── utils/                  # @shyland-dev/utils — utilitários
│           └── src/lib/services/
│               └── debug.service.ts
├── docs/
│   ├── DESIGN-SYSTEM-PLAN.md       # Plano mestre do Design System
│   └── design-system/              # Decisões e progresso das fases
├── scripts/
│   ├── generate-icons.mjs          # Gera icons.ts a partir dos SVGs
│   └── check-*.mjs                 # npm run check:ds (unidades, tokens, contraste, fontes...)
├── CLAUDE.md                       # Regras do repo e comando /build
└── angular.json
```
