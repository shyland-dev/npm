# npm

Monorepo Angular 21 com biblioteca de componentes UI e utilitários.

## Pacotes

| Pacote               | Caminho           | Descrição                                  |
| -------------------- | ----------------- | ------------------------------------------ |
| `@shyland-dev/ui`    | `src/ui`    | Biblioteca de componentes UI reutilizáveis |
| `@shyland-dev/utils` | `src/utils` | Serviços e utilitários Angular             |

## Início rápido

```bash
npm ci          # Instala as dependências e cria os symlinks de workspace
npm run build   # Compila as libs para dist/
```

> Em desenvolvimento, as libs são resolvidas via `tsconfig.json` — não é necessário fazer build antes de usar o showcase externo.

## Scripts

| Comando                  | Descrição                                                                 |
| ------------------------ | ------------------------------------------------------------------------- |
| `npm run build`          | Build de `@shyland-dev/ui` e `@shyland-dev/utils`                         |
| `npm run build:ui`       | Build da biblioteca `@shyland-dev/ui`                                     |
| `npm run build:utils`    | Build da biblioteca `@shyland-dev/utils`                                  |
| `npm run generate:icons` | Gera `icons.ts` a partir dos SVGs em `src/ui/src/assets/svg/` |

## Componentes (`@shyland-dev/ui`)

| Componente   | Selector         | Descrição                                                         |
| ------------ | ---------------- | ----------------------------------------------------------------- |
| **Icon**     | `<shy-icon>`     | Ícones SVG inline com suporte a hover fill e tamanho customizável |
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

**Customização via CSS:**

```scss
shy-icon {
    --shyIconSize: 2rem; /* tamanho (padrão: 1em) */
    color: red; /* cor via currentColor */
}
```

**Ícones disponíveis** (traçado e preenchido `*-filled`):

`alert`, `bell`, `box`, `check`, `chevron-down`, `chevron-right`, `download`, `edit`, `eye`, `grid`, `heart`, `help`, `home`, `info`, `layers`, `lock`, `mail`, `menu`, `minus`, `palette`, `plus`, `search`, `settings`, `star`, `trash`, `type`, `upload`, `user`, `x`, `zap`

> Ícones com versão `-filled`: `alert`, `bell`, `box`, `grid`, `heart`, `help`, `home`, `info`, `lock`, `mail`, `star`

Para adicionar ícones, coloque o `.svg` em `src/ui/src/assets/svg/` e execute:

```bash
npm run generate:icons
```

---

### SnackbarComponent + SnackbarService

```typescript
import { SnackbarComponent, SnackbarService } from '@shyland-dev/ui';
```

**No template:**

```html
<!-- texto inline -->
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

**Customização via CSS:**

```scss
shy-snackbar {
    --shySnackbarBg: #{$success}; /* cor de fundo */
    --shySnackbarColor: #{$white}; /* cor do texto e ícone */
    --shySnackbarMinWidth: 250px; /* largura mínima */
    --shySnackbarMaxWidth: 600px; /* largura máxima */
}
```

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

/* Reset global, estilos de scrollbar e height do app-root */
@use '@shyland-dev/ui/styles/base';
```

> Nenhuma configuração adicional no `angular.json` é necessária. O Angular CLI (esbuild) resolve automaticamente os caminhos `@shyland-dev/...` via `node_modules`.

---

### 3. Usar variáveis e mixins em componentes

Em qualquer arquivo SCSS de componente que precise das Sass variables ou mixins:

```scss
@use '@shyland-dev/ui/styles' as *;

.meu-elemento {
  color: $primary;
  @include fixedHeight(200px);
}
```

---

### 4. Usar os componentes UI

Importe os componentes standalone diretamente nos `imports` do seu componente ou módulo:

```typescript
import { IconComponent, SnackbarComponent, SnackbarService } from '@shyland-dev/ui';

@Component({
  imports: [IconComponent, SnackbarComponent],
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

Propriedades CSS definidas em `src/lib/styles/_tokens.scss`, incluídas automaticamente ao importar `@shyland-dev/ui/styles` ou `@shyland-dev/ui/styles/base`.

**Cores:**
`--primary`, `--secondary`, `--tertiary`, `--success`, `--warning`, `--danger`, `--dark`, `--medium`, `--light`, `--black`, `--white`

**Layout:**
`--headerHeight`, `--footerHeight`, `--defaultContentHeight`, `--responsiveUnit`, `--scrollbarWidth`

**Sass variables** (disponíveis ao `@use '@shyland-dev/ui/styles' as *`):
`$primary`, `$secondary`, `$tertiary`, `$success`, `$warning`, `$danger`, `$dark`, `$medium`, `$light`, `$black`, `$white`

---

## Estrutura do projeto

```
npm/
├── src/
│   ├── ui/                    # @shyland-dev/ui — componentes
│   │   └── src/
│   │       ├── assets/svg/    # Arquivos SVG fonte dos ícones
│   │       ├── lib/
│   │       │   ├── components/
│   │       │   │   ├── icon/        # IconComponent
│   │       │   │   └── snackbar/    # SnackbarComponent
│   │       │   ├── services/
│   │       │   │   └── snackbar.service.ts
│   │       │   └── styles/          # tokens, variables, mixins, base
│   │       └── public-api.ts
│   └── utils/                 # @shyland-dev/utils — utilitários
│       └── src/
│           ├── lib/services/
│           │   └── debug.service.ts
│           └── public-api.ts
├── scripts/
│   └── generate-icons.mjs         # Gera icons.ts a partir dos SVGs
└── angular.json
```
