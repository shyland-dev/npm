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

| Comando                  | Descrição                                                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm start`              | Inicia o showcase (`ng serve showcase --port 4201`)                                                                                                                     |
| `npm run build`          | Build de `@shyland-dev/ui` e `@shyland-dev/utils`                                                                                                                       |
| `npm run build:ui`       | Build da biblioteca `@shyland-dev/ui`                                                                                                                                   |
| `npm run build:utils`    | Build da biblioteca `@shyland-dev/utils`                                                                                                                                |
| `npm run build:showcase` | Build do showcase                                                                                                                                                       |
| `npm run generate:icons` | Gera o catálogo (`icons/src/icons.ts`) e os ícones internos a partir dos SVGs em `assets/svg/`                                                                          |
| `npm run check:ds`       | Verificações do Design System (unidades, calibração, tokens, contraste, literais, fontes, tamanho, bundle de ícones, código de dev da utils fora do bundle de produção) |
| `npm test`               | Testes da `ui` (`ng test ui --watch=false`: `@angular/build:unit-test` + vitest + happy-dom)                                                                            |

## Design System (em desenvolvimento)

A lib `@shyland-dev/ui` está sendo reescrita como Design System na branch `feat/design-system`.

- Plano mestre: [`docs/DESIGN-SYSTEM-PLAN.md`](docs/DESIGN-SYSTEM-PLAN.md) (fases F0 a F5, tokens, temas, unidades, componentes).
- Regras do repo para o Claude: [`CLAUDE.md`](CLAUDE.md).
- Estado das fases: [`docs/design-system/progress.md`](docs/design-system/progress.md).

Para avançar com o Claude (CLI ou thread do projeto), mande só `/build`: ele lê o estado em `progress.md` e executa o próximo passo (plano da fase, implementação ou gate com commit). `/build status` mostra onde está sem executar nada. Não confundir com `npm run build`.

## Componentes (`@shyland-dev/ui`)

| Componente      | Selector                                    | Descrição                                                                                                          |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Button**      | `button[shyButton]`, `a[shyButton]`         | Botão de ação: `variant`, `intent`, `size`, `loading` (`aria-busy`, foco mantido), `block`                         |
| **IconButton**  | `button[shyIconButton]`                     | Botão só com ícone; `label` obrigatório vira `aria-label`                                                          |
| **Spinner**     | `shy-spinner`                               | 8 variantes, `size` xs a lg, `label` opcional (`role="status"`), cor por `currentColor`                            |
| **Skeleton**    | `shy-skeleton`                              | Placeholder `text`/`circle`/`rect`, `lines`, `shimmer`/`still`; decorativo (`aria-hidden`)                         |
| **Progress**    | `shy-progress`, `shy-progress-circular`     | `role="progressbar"`, `value`/`max`, indeterminado sem `value`                                                     |
| **Badge**       | `shy-badge`                                 | Etiqueta `soft`/`solid`/`outline`, `count`, `dot`, `removable`; o texto diz o estado                               |
| **Dialog**      | `shy-dialog` + `DialogService`              | Modal nativo (`<dialog>`): `open()`, `confirm()`, `alert()`; título liga `aria-labelledby`; tamanhos `sm` a `full` |
| **Drawer**      | `shy-drawer` + `DrawerService`              | Painel lateral modal (`start`/`end`/`top`/`bottom`); clique no fundo fecha                                         |
| **Divider**     | `shy-divider`                               | `role="separator"`, horizontal ou vertical, texto opcional                                                         |
| **Card**        | `shy-card`, `a[shyCard]`, `button[shyCard]` | Slots header/body/footer, `elevation` 0 a 3; interativo pelo elemento nativo                                       |
| **Alert**       | `shy-alert`                                 | Ícone por intenção + título; `role="status"` (ou `alert` com `urgent` em warning/danger), `dismissible`            |
| **Checkbox**    | `shy-checkbox`                              | Sobre o checkbox nativo: `[(checked)]`, `indeterminate`, CVA, `invalid` do `NgControl`                             |
| **Radio**       | `shy-radio-group`, `shy-radio`              | `role="radiogroup"` com radios nativos (setas e roving tabindex do navegador), CVA                                 |
| **Switch**      | `shy-switch`                                | Checkbox nativo com `role="switch"`; mesma API do Checkbox                                                         |
| **Input**       | `input[shyInput]`, `textarea[shyInput]`     | Campo sobre o nativo (`ngModel`/`formControl`), tamanhos, `invalid` do `NgControl`                                 |
| **FormField**   | `shy-form-field`                            | Label, dica, erro (ícone + texto) e contador; liga `for`/`id` e `aria-*`; slots `prefix`/`suffix`                  |
| **Icon**        | `<shy-icon>`                                | Ícones SVG inline com suporte a hover fill e tamanho customizável                                                  |
| **Select**      | `<shy-select>`                              | Combobox (CVA): `ngModel`/`formControl`, `multiple`, typeahead, painel em overlay                                  |
| **Snackbar**    | `SnackbarService.show()`                    | Toasts com fila, intent, ação e pausa                                                                              |
| **ThemeToggle** | `<shy-theme-toggle>`                        | Controle segmentado claro / sistema / escuro (usa o `ThemeService`)                                                |
| **Menu**        | `[shyMenu]` + `shy-menu` + `shyMenuItem`    | Menu button (APG): setas, Home/End, typeahead; fecha ao ativar o item; sem submenus                                |
| **Popover**     | `[shyPopover]` + `shy-popover`              | Painel não modal ancorado; foco, Esc, clique fora e Tab devolvem o foco ao gatilho                                 |
| **Tooltip**     | `[shyTooltip]`                              | Dica no hover (mouse) e no foco por teclado; complementa o nome; Esc, pairável                                     |

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

No app consumidor, registre só os ícones usados com `provideShyIcons(iconHouse, ...)` (import de `@shyland-dev/ui/icons`); nomes não registrados baixam o catálogo sob demanda (chunk lazy). Detalhes em `src/libs/ui/README.md` (`<shy-icon>`).

Para adicionar ícones, coloque o `.svg` em `src/libs/ui/src/assets/svg/` e execute:

```bash
npm run generate:icons
```

---

### SelectComponent

Combobox somente-seleção (APG) sobre o `OverlayService`: o foco fica no botão e a opção ativa vai em `aria-activedescendant`; a lista abre na camada `dropdown`, vira para cima se faltar espaço e funciona dentro de um Dialog. API completa e teclado em [`src/libs/ui/README.md`](src/libs/ui/README.md#shy-select).

```html
<shy-form-field label="País" hint="Escolha um">
    <shy-select [options]="paises" [formControl]="pais" placeholder="Escolha um país" />
</shy-form-field>
<shy-select [options]="tags" [(value)]="selecionadas" multiple label="Tópicos" />
```

```typescript
paises: ShySelectOption[] = [
  { value: 'br', label: 'Brasil', img: 'assets/flag-br.svg' },
  { value: 'jp', label: 'Japão', disabled: true },
];
```

- Valor por `ngModel`, `formControl`/`formControlName` ou `[(value)]` (array com `multiple`); `compareWith` para objetos; `disabled`, `invalid`, `required`, `placeholder`.
- **Migração da `0.0.x`:** `[selectOptions]`, `[selectedOption]`, `(onSelectionChange)`, `SelectOption` e `SelectionChangeEvent` foram removidos na 1.0 (ver [guia de migração](docs/design-system/migration-0.0-to-1.0.md)): use `[options]` (`ShySelectOption`, sem `id`), `[(value)]`/`ngModel`/`formControl` e `(valueChange)`.
- Tokens do botão no próprio elemento; os do painel (`--shy-select-panel-*`, `--shy-select-option-*`) em `:root` (o painel mora no contêiner de overlays).

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

#### Tokens do Select

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

### SnackbarService (toasts)

Avisos temporários sem elemento no template nem `viewChild`: o contêiner nasce na primeira chamada, na camada `toast` do `OverlayService`. API completa em [`src/libs/ui/README.md`](src/libs/ui/README.md#snackbarservice-toasts).

```typescript
const snackbar = inject(SnackbarService);

snackbar.show('Salvo');
snackbar.show('Não foi possível salvar', { intent: 'danger' });
const ref = snackbar.show('Item excluído', { action: { label: 'Desfazer' } });
if ((await ref.closed) === 'action') restaurar();
```

- `intent` (`neutral|info|success|warning|danger`; `danger` usa `role="alert"`), `action`, `duration` (`0` = só fecha por X/`dismiss()`), `position` (`top|bottom`), `align` (`start|center|end`). Fila de até 3 visíveis; pausa com ponteiro/foco e aba oculta. Padrões em `provideShySnackbar({ maxVisible, duration, durationWithAction, dismissLabel })`.
- Com um modal aberto o toast fica `inert` (limitação do modal): a ação some até o modal fechar.
- **Migração da `0.0.x`:** o `<shy-snackbar>` e `show({ element, ... })` foram removidos na 1.0: remova o elemento e o `viewChild` e troque por `show(text, { duration: delay, position })`.
- Tokens `--shy-snackbar-*` em `:root` (o contêiner mora no overlay). Página no showcase: **components > snackbar**.

---

### OverlayService

Abre um componente ou `TemplateRef` numa camada acima da página (base de Dialog, Drawer, Popover, Menu e dos novos Select/Snackbar da F4). Documentação completa e opções em [`src/libs/ui/README.md`](src/libs/ui/README.md#overlayservice-overlay-core).

```ts
const ref = inject(OverlayService).open(MeuPainel, { layer: 'modal', data: { id: 1 }, ariaLabel: 'Editar item' });
const resultado = await ref.closed; // quem abre recebe o que o painel passou em ref.close(resultado)
```

- Painéis em `.shy-overlay-container` (no `body`, sob demanda). Modal = `<dialog>`; o resto = `[popover="manual"]`. No top layer vale a ordem de abertura: abrir um modal promove popover/tooltip/toast abertos acima dele.
- Esc fecha só a camada do topo; clique fora configurável; modal prende o Tab, trava o scroll (`data-shy-scroll-lock` no `<html>`) e deixa o resto `inert`.
- Exige o CSS da lib carregado (`styles/index.css` ou `global`: inclui `overlay.css`). Teste visual em **Foundations > layers** do showcase.

---

### Dialog e Drawer

Modais sobre o `OverlayService` (`<dialog>` nativo). Uso e tokens completos em [`src/libs/ui/README.md`](src/libs/ui/README.md#shy-dialog-shy-drawer-dialogservice-drawerservice).

```ts
const ok = await inject(DialogService).confirm({ title: 'Excluir projeto?', message: 'Não há volta.', confirmLabel: 'Excluir', intent: 'danger' });
const ref = inject(DialogService).open(RenomearDialog, { data: { id: 7 } }); // conteúdo com <shy-dialog heading="…">
const resultado = await ref.closed;
inject(DrawerService).open(FiltrosPanel, { side: 'start' });
```

- Esc fecha só o do topo; Dialog não fecha por clique no fundo (Drawer fecha); `confirm()`/`alert()` usam `role="alertdialog"` e focam o botão seguro.
- O CSS da lib (`styles/index.css` ou `global`) precisa estar carregado: inclui `overlay.css` e `drawer.css`. Páginas no showcase: **components > dialog** e **drawer**.

---

### Popover, Menu e Tooltip

Painéis ancorados sobre o `OverlayService`. API e tokens em [`src/libs/ui/README.md`](src/libs/ui/README.md#shypopover-shymenu-shytooltip).

```html
<button shyButton [shyPopover]="info">Detalhes</button>
<ng-template #info><shy-popover>Conteúdo</shy-popover></ng-template>

<button shyButton [shyMenu]="acoes">Ações</button>
<ng-template #acoes
    ><shy-menu><button shyMenuItem (click)="editar()">Editar</button></shy-menu></ng-template
>

<button shyIconButton label="Excluir" shyTooltip="Excluir o item"><shy-icon>trash</shy-icon></button>
```

- Popover e Menu viram `aria-expanded`/`aria-controls` no gatilho; Esc, clique fora e Tab fecham e devolvem o foco. Menu: setas, Home/End e digitação; sem submenus.
- Tooltip só complementa o nome (aparece no hover do mouse e no foco por teclado, não no toque). Páginas no showcase: **components > popover**, **menu** e **tooltip**; exemplo integrado dos overlays (Menu, Dialog, Select, Tooltip, Snackbar): **examples > overlays together**.

---

## Utilitários (`@shyland-dev/utils`)

| Export                                                           | Descrição                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `createShyLogger`, `injectShyLogger`, `provideShyLogger`         | Logger com namespace, níveis e filtro; só escreve em dev mode (`ng serve`) |
| `shyInvariant`, `shyDevOnly`, `shyDeprecated`, `shyMeasure`      | Asserts, avisos e medição, só em dev                                       |
| `assertShyInjectionContext`, `onShyDestroy`, `injectShyPlatform` | Helpers de injeção e plataforma                                            |
| `shyStorage`, `injectShyMediaQuery`, `shyDebounced`              | Signals: storage tipado (SSR-safe), media query, debounce                  |
| `shyIsDefined`, `shyIsString`, `shyIsRecord`, `shyAssertNever`   | Type guards                                                                |
| `@shyland-dev/utils/testing`                                     | `createShyMemorySink`, `provideShyPlatform`                                |
| `DebugService`                                                   | `@deprecated`: use `createShyLogger`                                       |

```typescript
import { createShyLogger } from '@shyland-dev/utils';

private readonly log = createShyLogger('MeuComponente');

ngOnInit(): void {
  this.log.debug('init'); // [shy:MeuComponente] init (só em dev)
}
```

Referência completa: [`src/libs/utils/README.md`](src/libs/utils/README.md).

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
    @include landscape {
        padding: ru(8);
    }
}
```

```typescript
import { ru } from '@shyland-dev/ui';

ru(4); // 'calc(var(--shy-responsive-unit) * 4)'
```

**Funções e mixins** (`@use '@shyland-dev/ui/styles'`):

| Item                                                                                                                   | Descrição                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ru($n)`                                                                                                               | `calc(var(--shy-responsive-unit) * $n)`; aceita decimais e negativos                                                                                          |
| `z($layer, $offset: 0)`                                                                                                | `z-index` de uma camada nomeada (`base`, `raised`, `dropdown`, `sticky`, `fixed`, `drawer`, `modal`, `popover`, `tooltip`, `toast`); `$offset` de -50 a 50    |
| `@include shy-layer($layer, $offset)`                                                                                  | `z-index: z($layer, $offset)`                                                                                                                                 |
| `@include up($bp)` / `down($bp)`                                                                                       | Media query de largura (`sm` 600, `md` 840, `lg` 1200, `xl` 1600); único lugar com px. A lib não usa mais: prefira `landscape`/`portrait` e layout intrínseco |
| `@include focus-ring`                                                                                                  | Anel de foco do contrato de estados                                                                                                                           |
| `@include shy-state(hover\|focus\|active)`                                                                             | Gera o seletor real (`hover` só com `@media (hover: hover)`) e `[data-shy-state]` para a matriz do showcase                                                   |
| `@include state-layer`                                                                                                 | Camada de hover/pressed sem cor própria por variante                                                                                                          |
| `@include disabled-state`                                                                                              | `opacity` e `cursor` de desabilitado                                                                                                                          |
| `@include transition($props, $duration, $ease)`                                                                        | `transition` com os tokens de motion                                                                                                                          |
| `@include visually-hidden`                                                                                             | Esconde só visualmente (em ru, sem `1px`)                                                                                                                     |
| `fixedHeight`, `fixedWidth`, `fixedSquare`, `square`, `allVendors`, `landscape`, `portrait`, `dark-mode`, `light-mode` | Mixins antigos, mantidos por enquanto                                                                                                                         |

---

### 4. Usar os componentes UI

Importe os componentes standalone diretamente nos `imports` do seu componente ou módulo:

```typescript
import { ButtonComponent, IconButtonComponent, IconComponent, ProgressComponent, SelectComponent, SnackbarService, SpinnerComponent } from '@shyland-dev/ui';

@Component({
    imports: [ButtonComponent, IconButtonComponent, IconComponent, ProgressComponent, SelectComponent, SpinnerComponent],
    providers: [SnackbarService],
})
export class MeuComponent {}
```

```html
<button shyButton type="submit" [loading]="salvando()" loadingPosition="start" loadingText="Salvando…"><shy-icon slot="start">check-lg</shy-icon>Salvar</button> <button shyIconButton type="button" label="Fechar"><shy-icon>x-lg</shy-icon></button>
```

Formulário com `shy-form-field` (o campo liga rótulo, dica, erro e `aria-*` ao controle; checkbox, switch e radio group são `ControlValueAccessor`; importe `ReactiveFormsModule`, `FormFieldComponent`, `InputComponent`, `RadioGroupComponent`, `RadioComponent`, `SwitchComponent` e `ButtonComponent`):

```html
<form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
    <shy-form-field label="Email" [error]="form.controls.email.hasError('email') ? 'Email inválido' : 'Obrigatório'">
        <input shyInput type="email" formControlName="email" required autocomplete="email" />
    </shy-form-field>
    <shy-form-field label="Plano" error="Escolha um plano" [required]="true">
        <shy-radio-group formControlName="plano" orientation="horizontal">
            <shy-radio value="free">Free</shy-radio>
            <shy-radio value="pro">Pro</shy-radio>
        </shy-radio-group>
    </shy-form-field>
    <shy-switch formControlName="publico">Perfil público</shy-switch>
    <button shyButton type="submit" [loading]="enviando()">Enviar</button>
</form>
```

Exemplo completo, com todos os controles da Onda 1 e foco no primeiro campo inválido ao enviar: rota `examples/form` do showcase (`src/apps/app/examples/form`).

Classes utilitárias (já carregadas pelo `index.css`): tipografia (`.shy-h1`…`.shy-h6`, `.shy-body`, `.shy-caption`, `.shy-code`, `.shy-sr-only` etc.) e layout (`.shy-stack`, `.shy-cluster`, `.shy-grid`, `.shy-container`, ajustáveis por `--shy-stack-gap`, `--shy-grid-min` etc.). API completa e tokens `--shy-button-*`: [`src/libs/ui/README.md`](src/libs/ui/README.md).

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

> Mudança da `0.0.x` para a `1.0.0` (breaking), nos componentes: `--shyIconSize` → `--shy-icon-size`; `--shySelect*` → `--shy-select-*` e `--shySnackbar*` → `--shy-snackbar-*` (kebab-case, padrões vindos dos tokens semânticos, tabelas acima); o ícone de fallback para nome inexistente passa a ser `question-circle` (o `help` antigo nunca existiu); `Icon`, `Select` e `Snackbar` agora usam `input()`/`output()`/`model()` e `OnPush` (os nomes usados no template não mudam).
>
> Mudança da `0.0.x` para a `1.0.0` (breaking), nos nomes globais: `--responsive-unit`, `--dynamic-*`, `$responsive-unit`, `$dynamic-*` **deixaram de existir**, sem alias. Troque por `--shy-responsive-unit` / `ru(N)` e `--shy-dynamic-*`. As Sass variables `$color-*` (paleta antiga) também foram removidas (`_variables.scss` não existe mais); use os tokens `--shy-color-*`. Guia: [`docs/design-system/migration-0.0-to-1.0.md`](docs/design-system/migration-0.0-to-1.0.md).

---

## Exports (`@shyland-dev/ui`)

```typescript
// Componentes
export { ButtonComponent } from './lib/components/button/button.component';
export { IconButtonComponent } from './lib/components/icon-button/icon-button.component';
export { AlertComponent } from './lib/components/alert/alert.component';
export { BadgeComponent } from './lib/components/badge/badge.component';
export { CheckboxComponent } from './lib/components/checkbox/checkbox.component';
export { CardComponent } from './lib/components/card/card.component';
export { DialogComponent } from './lib/components/dialog/dialog.component';
export { DividerComponent } from './lib/components/divider/divider.component';
export { DrawerComponent } from './lib/components/drawer/drawer.component';
export { MenuComponent } from './lib/components/menu/menu.component';
export { MenuItemComponent } from './lib/components/menu/menu-item.component';
export { MenuDirective } from './lib/components/menu/menu.directive';
export { PopoverComponent } from './lib/components/popover/popover.component';
export { PopoverDirective } from './lib/components/popover/popover.directive';
export { TooltipDirective } from './lib/components/tooltip/tooltip.directive';
export { FormFieldComponent } from './lib/components/form-field/form-field.component';
export { SHY_FORM_FIELD, ShyFieldControl, ShyFormFieldContext } from './lib/components/form-field/form-field.token';
export { IconComponent } from './lib/components/icon/icon.component';
export { InputComponent } from './lib/components/input/input.component';
export { ProgressComponent } from './lib/components/progress/progress.component';
export { ProgressCircularComponent } from './lib/components/progress-circular/progress-circular.component';
export { RadioGroupComponent } from './lib/components/radio/radio-group.component';
export { RadioComponent } from './lib/components/radio/radio.component';
export { SHY_RADIO_GROUP, ShyRadioGroupContext } from './lib/components/radio/radio.token';
export { SelectComponent } from './lib/components/select/select.component';
export { SkeletonComponent } from './lib/components/skeleton/skeleton.component';
export { SpinnerComponent } from './lib/components/spinner/spinner.component';

export { SwitchComponent } from './lib/components/switch/switch.component';
export { ThemeToggleComponent, ShyThemeToggleLabels } from './lib/components/theme-toggle/theme-toggle.component';

// Serviços
export { DialogService } from './lib/services/dialog/dialog.service';
export { DrawerService } from './lib/services/drawer/drawer.service';
export { SnackbarService } from './lib/services/snackbar/snackbar.service';
export { provideShySnackbar, SHY_SNACKBAR_CONFIG, SHY_SNACKBAR_DEFAULTS } from './lib/services/snackbar/snackbar.config';
export { ThemeService, provideShyTheme, SHY_THEME_CONFIG, ShyThemeMode, ShyResolvedTheme, ShyThemeConfig } from './lib/services/theme/theme.service';

// Overlay
export { OverlayService } from './lib/overlay/overlay.service';
export { ShyOverlayRef, SHY_OVERLAY_DATA } from './lib/overlay/overlay-ref';
export { FocusScopeDirective, focusableElements, focusInitial, trapTab, restoreFocus } from './lib/overlay/focus-scope';
export { computePosition, ShyComputePositionOptions } from './lib/overlay/position';
export { shyLayer, layerRank } from './lib/overlay/layers';

// Utilitários
export { ru } from './lib/utils/ru';
export { animateOut, AnimateOutOptions } from './lib/utils/animate-out';

// Interfaces
export { ShyOverlayConfig, ShyOverlayContext, ShyPositionOptions, ShyPositionResult, ShyRect } from './lib/interfaces/overlay/overlay.interface';
export { ShyDialogConfig, ShyDrawerConfig, ShyConfirmDialogOptions, ShyAlertDialogOptions } from './lib/interfaces/dialog/dialog.interface';
export { ShySelectOption } from './lib/interfaces/select/select.interface';
export { ShySnackbarOptions, ShySnackbarConfig, ShySnackbarRef } from './lib/interfaces/snackbar/snackbar.interface';

// Types
export { ShyAlertIntent } from './lib/types/alert/alert.type';
export { ShyBadgeVariant, ShyBadgeSize } from './lib/types/badge/badge.type';
export { ShyCardElevation } from './lib/types/card/card.type';
export { ShyDialogSize, ShyDrawerSide } from './lib/types/dialog/dialog.type';
export { ShyDividerOrientation } from './lib/types/divider/divider.type';
export { ShyButtonVariant, ShyButtonSize, ShyButtonLoadingPosition, ShyIconButtonVariant } from './lib/types/button/button.type';
export { ShyInputSize } from './lib/types/input/input.type';
export { SHY_LAYERS, ShyLayer, ShyOverlayLayer, ShyPlacement, ShySide, ShyInitialFocus } from './lib/types/overlay/overlay.type';
export { ShyIntent } from './lib/types/intent/intent.type';
export { ShyProgressSize } from './lib/types/progress/progress.type';
export { ShyRadioOrientation } from './lib/types/radio/radio.type';
export { ShySkeletonShape, ShySkeletonAnimation } from './lib/types/skeleton/skeleton.type';
export { ShySpinnerVariant, ShySpinnerSize } from './lib/types/spinner/spinner.type';
export { SnackbarPosition, ShySnackbarIntent, ShySnackbarAlign, ShySnackbarCloseReason } from './lib/types/snackbar/snackbar.type';

// Ícones
export { provideShyIcons, IconRegistry } from './lib/components/icon/icon-registry';
// Catálogo completo e um export por ícone: `@shyland-dev/ui/icons` (ICONS, iconHouse, ...)
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
│       │           │   └── snackbar/   # SnackbarOutletComponent (interno)
│       │           ├── interfaces/     # ShySelectOption, ShySnackbarOptions...
│       │           ├── services/
│       │           │   └── snackbar/   # SnackbarService
│       │           ├── styles/         # tokens/*.css, fonts/, index.css, _global.scss, _functions/_layers/_mixins.scss
│       │           ├── utils/          # ru()
│       │           └── types/          # SnackbarPosition
│       └── utils/                  # @shyland-dev/utils — utilitários
│           └── src/lib/             # logger/, dev/, di/, storage/, signals/, guards/, services/ (DebugService deprecated)
│           └── testing/             # @shyland-dev/utils/testing
├── docs/
│   ├── DESIGN-SYSTEM-PLAN.md       # Plano mestre do Design System
│   └── design-system/              # Decisões e progresso das fases
├── scripts/
│   ├── generate-icons.mjs          # Gera o catálogo de ícones e os internos a partir dos SVGs
│   └── check-*.mjs                 # npm run check:ds (unidades, tokens, contraste, fontes...)
├── CLAUDE.md                       # Regras do repo e comando /build
└── angular.json
```
