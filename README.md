# npm

Monorepo Angular 21 com biblioteca de componentes UI e utilitários.

## Pacotes

| Pacote               | Caminho                      | Descrição                                  |
| -------------------- | ---------------------------- | ------------------------------------------ |
| `@shyland-dev/ui`    | `projects/shyland-dev/ui`    | Biblioteca de componentes UI reutilizáveis |
| `@shyland-dev/utils` | `projects/shyland-dev/utils` | Serviços e utilitários Angular             |
| `showcase`           | `projects/showcase`          | App de demonstração dos componentes        |

## Início rápido

```bash
npm ci       # Instala as dependências e cria os symlinks de workspace
npm start    # Serve o showcase em http://localhost:4200
```

> Em desenvolvimento (dentro deste monorepo), as libs são resolvidas via `tsconfig.json` — não é necessário fazer build antes de servir o showcase.

## Scripts

| Comando                  | Descrição                                                                      |
| ------------------------ | ------------------------------------------------------------------------------ |
| `npm start`              | Serve o showcase (modo dev)                                                    |
| `npm run build`          | Build de todas as libs + showcase (produção)                                   |
| `npm run build:libs`     | Build de `@shyland-dev/ui` e `@shyland-dev/utils`                              |
| `npm run build:ui`       | Build da biblioteca `@shyland-dev/ui`                                          |
| `npm run build:utils`    | Build da biblioteca `@shyland-dev/utils`                                       |
| `npm run build:app`      | Build do showcase                                                              |
| `npm run generate:icons` | Gera `icons.ts` a partir dos SVGs em `projects/shyland-dev/ui/src/assets/svg/` |

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

Para adicionar ícones, coloque o `.svg` em `projects/shyland-dev/ui/src/assets/svg/` e execute:

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

## Design Tokens

Propriedades CSS definidas em `projects/shyland-dev/ui/src/lib/styles/_tokens.scss` e disponíveis globalmente via `@use 'shyland-dev/ui/src/lib/styles/base'`:

**Cores:**
`--primary`, `--secondary`, `--tertiary`, `--success`, `--warning`, `--danger`, `--dark`, `--medium`, `--light`, `--black`, `--white`

**Layout:**
`--headerHeight`, `--footerHeight`, `--defaultContentHeight`, `--responsiveUnit`, `--scrollbarWidth`

Para usar os estilos base em um componente:

```scss
@use 'shyland-dev/ui/src/lib/styles' as *; /* variáveis, tokens e mixins */
@use 'shyland-dev/ui/src/lib/styles/base'; /* estilos globais (scrollbar, reset) */
```

> O `angular.json` do showcase já configura `stylePreprocessorOptions.includePaths: ["projects", "node_modules"]`, permitindo esses imports sem caminhos absolutos.

---

## Estrutura do projeto

```
shy/
├── projects/
│   ├── shyland-dev/
│   │   ├── ui/                    # @shyland-dev/ui — componentes
│   │   │   └── src/
│   │   │       ├── assets/svg/    # Arquivos SVG fonte dos ícones
│   │   │       ├── lib/
│   │   │       │   ├── components/
│   │   │       │   │   ├── icon/        # IconComponent
│   │   │       │   │   └── snackbar/    # SnackbarComponent
│   │   │       │   ├── services/
│   │   │       │   │   └── snackbar.service.ts
│   │   │       │   └── styles/          # tokens, variables, mixins, base
│   │   │       └── public-api.ts
│   │   └── utils/                 # @shyland-dev/utils — utilitários
│   │       └── src/
│   │           ├── lib/services/
│   │           │   └── debug.service.ts
│   │           └── public-api.ts
│   └── showcase/                  # App de demonstração
│       └── src/app/
│           └── pages/
│               └── icons/         # Listagem e cópia de ícones
├── scripts/
│   └── generate-icons.mjs         # Gera icons.ts a partir dos SVGs
└── angular.json
```
