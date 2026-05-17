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

| Comando                  | Descrição                                                          |
| ------------------------ | ------------------------------------------------------------------ |
| `npm start`              | Inicia o showcase (`ng serve showcase --port 4201`)                |
| `npm run build`          | Build de `@shyland-dev/ui` e `@shyland-dev/utils`                  |
| `npm run build:ui`       | Build da biblioteca `@shyland-dev/ui`                              |
| `npm run build:utils`    | Build da biblioteca `@shyland-dev/utils`                           |
| `npm run build:showcase` | Build do showcase                                                  |
| `npm run generate:icons` | Gera `icons.ts` a partir dos SVGs em `src/libs/ui/src/assets/svg/` |

## Componentes (`@shyland-dev/ui`)

| Componente   | Selector         | Descrição                                                         |
| ------------ | ---------------- | ----------------------------------------------------------------- |
| **Icon**     | `<shy-icon>`     | Ícones SVG inline com suporte a hover fill e tamanho customizável |
| **Select**   | `<shy-select>`   | Dropdown customizável com suporte a ícones e imagens nas opções   |
| **Snackbar** | `<shy-snackbar>` | Notificação temporária no topo ou rodapé da página                |

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

| Input            | Tipo      | Padrão  | Descrição                                                   |
| ---------------- | --------- | ------- | ----------------------------------------------------------- |
| `hoverFill`      | `boolean` | `false` | Troca para a variante `-fill` do ícone ao passar o mouse    |
| `hoverFillDelay` | `number`  | `0`     | Duração da transição entre o estado normal e o fill (em ms) |

**Customização via CSS:**

```scss
shy-icon {
    --shyIconSize: 2rem; /* tamanho (padrão: 1em) */
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
    --shySelectHeight: 50px;
    --shySelectWidth: 200px;
    --shySelectBackground: #1a1a2e;
    --shySelectColor: #ffffff;
}
```

| Token                              | Padrão                         | Descrição                           |
| ---------------------------------- | ------------------------------ | ----------------------------------- |
| `--shySelectHeight`                | `20 * responsive-unit`         | Altura mínima do trigger            |
| `--shySelectWidth`                 | `90 * responsive-unit`         | Largura mínima do componente        |
| `--shySelectBorderRadius`          | `2 * responsive-unit`          | Border radius do trigger e dropdown |
| `--shySelectBackground`            | `$color-black` (`#000000`)     | Cor de fundo do trigger             |
| `--shySelectColor`                 | `$color-white` (`#ffffff`)     | Cor do texto e ícones               |
| `--shySelectFontFamily`            | `monospace`                    | Fonte do componente                 |
| `--shySelectFontSize`              | `6 * responsive-unit`          | Tamanho da fonte                    |
| `--shySelectIconSize`              | `8 * responsive-unit`          | Tamanho dos ícones internos         |
| `--shySelectDropdownBackground`    | `$color-dark` (`#222428`)      | Cor de fundo do painel dropdown     |
| `--shySelectDropdownBoxShadow`     | `0 0 1.5ru 0.1ru $color-white` | Box shadow do dropdown              |
| `--shySelectSelectedColor`         | `$color-primary` (`#3880ff`)   | Cor da opção selecionada            |
| `--shySelectOptionHoverBackground` | `$color-dark` clareado 20%     | Fundo do item ao hover              |
| `--shySelectOptionHoverColor`      | `$color-black` (`#000000`)     | Cor do texto do item ao hover       |
| `--shySelectOptionImgBorderRadius` | `50%`                          | Border radius da imagem da opção    |

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
    --shySnackbarBackground: #1a1a2e;
    --shySnackbarColor: #ffffff;
    --shySnackbarWidth: 300px;
}
```

| Token                       | Padrão                     | Descrição                            |
| --------------------------- | -------------------------- | ------------------------------------ |
| `--shySnackbarBackground`   | `$color-dark` (`#222428`)  | Cor de fundo                         |
| `--shySnackbarColor`        | `$color-white` (`#ffffff`) | Cor do texto e ícone                 |
| `--shySnackbarWidth`        | `110 * responsive-unit`    | Largura mínima                       |
| `--shySnackbarBorderRadius` | `2 * responsive-unit`      | Border radius                        |
| `--shySnackbarOffset`       | `15 * responsive-unit`     | Distância da borda superior/inferior |
| `--shySnackbarFontFamily`   | `monospace`                | Fonte da mensagem                    |
| `--shySnackbarFontSize`     | `7 * responsive-unit`      | Tamanho da fonte                     |
| `--shySnackbarIconSize`     | `8 * responsive-unit`      | Tamanho do ícone de fechar           |

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

No arquivo `src/styles.scss` da aplicação, importe os estilos base:

```scss
/* Sass variables, CSS custom properties (design tokens) e mixins */
@use '@shyland-dev/ui/styles' as *;
```

> Nenhuma configuração adicional no `angular.json` é necessária. O Angular CLI (esbuild) resolve automaticamente os caminhos `@shyland-dev/...` via `node_modules`.

---

### 3. Usar variáveis e mixins em componentes

Em qualquer arquivo SCSS de componente que precise das Sass variables ou mixins:

```scss
@use '@shyland-dev/ui/styles' as *;

.meu-elemento {
    color: $color-primary;
    @include fixedHeight(200px);
}
```

**Mixins disponíveis:**

| Mixin                          | Descrição                                           |
| ------------------------------ | --------------------------------------------------- |
| `fixedHeight($h)`              | Define `height`, `min-height` e `max-height`        |
| `fixedWidth($w)`               | Define `width`, `min-width` e `max-width`           |
| `fixedSquare($s)`              | Aplica `fixedWidth` e `fixedHeight` com mesmo valor |
| `square($s)`                   | Define `width` e `height`                           |
| `allVendors($property, $args)` | Adiciona prefixos de vendor a uma propriedade CSS   |
| `landscape`                    | Media query `(orientation: landscape)`              |
| `portrait`                     | Media query `(orientation: portrait)`               |
| `dark-mode`                    | Media query `(prefers-color-scheme: dark)`          |
| `light-mode`                   | Media query `(prefers-color-scheme: light)`         |

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

CSS custom properties definidas em `src/libs/ui/src/lib/styles/_variables.scss`, incluídas automaticamente ao importar `@shyland-dev/ui/styles`.

| Token               | Descrição                                |
| ------------------- | ---------------------------------------- |
| `--responsive-unit` | Unidade fluida baseada em viewport + rem |
| `--dynamic-height`  | `100dvh` (com fallback para `100vh`)     |
| `--dynamic-width`   | `100dvw` (com fallback para `100vw`)     |

**Sass variables** (disponíveis ao `@use '@shyland-dev/ui/styles' as *`):

| Variável               | Valor                        |
| ---------------------- | ---------------------------- |
| `$color-void`          | `#ffffff00`                  |
| `$color-primary`       | `#3880ff`                    |
| `$color-secondary`     | `#3dc2ff`                    |
| `$color-tertiary`      | `#5260ff`                    |
| `$color-success`       | `#2dd36f`                    |
| `$color-warning`       | `#ffc409`                    |
| `$color-danger`        | `#eb445a`                    |
| `$color-dark`          | `#222428`                    |
| `$color-medium`        | `#92949c`                    |
| `$color-light`         | `#f4f5f8`                    |
| `$color-black`         | `#000000`                    |
| `$color-white`         | `#ffffff`                    |
| `$responsive-unit`     | `var(--responsive-unit)`     |
| `$dynamic-height`      | `var(--dynamic-height)`      |
| `$dynamic-height-unit` | `var(--dynamic-height-unit)` |
| `$dynamic-width`       | `var(--dynamic-width)`       |
| `$dynamic-width-unit`  | `var(--dynamic-width-unit)`  |

---

## Exports (`@shyland-dev/ui`)

```typescript
// Componentes
export { IconComponent } from './lib/components/icon/icon.component';
export { SelectComponent } from './lib/components/select/select.component';
export { SnackbarComponent } from './lib/components/snackbar/snackbar.component';

// Serviços
export { SnackbarService } from './lib/services/snackbar/snackbar.service';

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
│   │   └── app/pages/              # Páginas de demonstração
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
│       │           ├── styles/         # _variables.scss, _mixins.scss
│       │           └── types/          # SnackbarPosition
│       └── utils/                  # @shyland-dev/utils — utilitários
│           └── src/lib/services/
│               └── debug.service.ts
├── scripts/
│   └── generate-icons.mjs          # Gera icons.ts a partir dos SVGs
└── angular.json
```
