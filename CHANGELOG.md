# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versionamento: [SemVer](https://semver.org/lang/pt-BR/).
Pacotes: `@shyland-dev/ui` (este changelog) e `@shyland-dev/utils` (ver a seção `utils` abaixo). O passo a passo de migração, com busca e substituição, está em [docs/design-system/migration-0.0-to-1.0.md](docs/design-system/migration-0.0-to-1.0.md).

## utils 0.1.0 - 2026-10-26

Minor (0.x): API nova, sem remoção; `DebugService` fica `@deprecated` e continua funcionando.

### Adicionado

- **Logger**: `createShyLogger(namespace, config?)`, `injectShyLogger`, `provideShyLogger`, `SHY_LOGGER_CONFIG`. Níveis `debug/info/warn/error`, `group`, `time`, `table`, `assert`, `trace`, cor por namespace, filtro por namespace (config ou `localStorage.shyLog`, com `*` e `-`) e sink trocável. Só escreve em dev mode.
- **Dev**: `shyInvariant`, `shyDevOnly`, `shyDeprecated` (uma vez por nome), `shyMeasure`, `resetShyDeprecations`.
- **Injeção/plataforma**: `assertShyInjectionContext`, `onShyDestroy`, `injectShyPlatform`.
- **Signals/storage**: `shyStorage` (JSON, local/session, validate, sync entre abas, SSR-safe), `injectShyMediaQuery`, `shyDebounced`.
- **Guards**: `shyIsDefined`, `shyIsString`, `shyIsRecord`, `shyAssertNever`.
- **Entry point `@shyland-dev/utils/testing`**: `createShyMemorySink`, `provideShyPlatform`.
- `npm run check:pkg`: valida `ui` e `utils` buildados com publint (`--strict`) e are-the-types-wrong (perfil esm-only) via `npx` com versões fixas, sem virar dependência. Roda no workflow de publish antes de publicar; os dois pacotes passam.
- Testes com vitest (34) e `npm test` agora roda `ui` e `utils`.

### Depreciado

- `DebugService`: use `createShyLogger('MeuComponente')`. Busca/substituição: `this.debug.log(this, x)` por `this.log.debug(x)` com `private readonly log = createShyLogger('MeuComponente')`. Formato novo: `[shy:MeuComponente] ...` (antes `[debug] @Componente#metodo`).

### Corrigido

- README da utils: requisitos (Angular 21.2+, não 17+) e exemplo de uso (o service é `root`, não precisa de `providers`).

### Alterado: código de dev fora do bundle de produção

Autorizado pelo dono em 2026-10-26. As funções de `logger/` e `dev/` usam guard literal de `ngDevMode` (`typeof ngDevMode === 'undefined' || ngDevMode`) em vez de `isDevMode()`. Medido com `ng build showcase -c production`: o logger (strings `[shy:`, `%c[`, filtro `shyLog`) não aparece mais no bundle; em produção `createShyLogger` devolve um logger vazio. Comportamento em dev inalterado. Continua sem nenhum recurso para logar em produção. O `DebugService` (depreciado) mantém `isDevMode()`. Como `ngDevMode` não é API pública documentada, o novo `check-utils-bundle` (parte do `npm run check:ds`) builda um app mínimo em produção e em desenvolvimento e falha se algum marcador de dev sobrar no bundle de produção ou faltar no de desenvolvimento.

## utils 0.0.7 - 2026-10-25

### Corrigido

- `@shyland-dev/utils` foi republicado como 0.0.7, sem mudanças de código. A 0.0.6 saiu do registry do npm em 2026-10-21 e a versão não pode ser reutilizada.

## [1.2.0] - 2026-10-25

### Alterado

- **`<shy-app-shell>`**: a sidebar agora vira Drawer por `@media (orientation: portrait)` (antes, por `max-width` abaixo do breakpoint `md`, 840 px). Em landscape fica inline em qualquer largura. A lib não usa mais media query de largura. Trade-off aceito: em zoom 400% (WCAG 1.4.10 Reflow) e em celular landscape a sidebar fica inline.
- `up()` / `down()` continuam exportados em `@shyland-dev/ui/styles`, mas a lib não os usa; prefira `landscape` / `portrait` e layouts intrínsecos.

## [1.1.1] - 2026-10-25

### Corrigido

- **Bundle**: `provideShyIcons(iconX)` com `import { iconX } from '@shyland-dev/ui/icons'` (o uso recomendado) ainda trazia o catálogo inteiro (~2.079 ícones, chunk de 2,5 MB) para o bundle inicial. Duas causas, medidas num app Angular 21 com `@angular/build:application` e o pacote buildado: (1) o `import()` do `IconRegistry` apontava para o mesmo módulo que o app importa estaticamente, e o bundler não separa um módulo em dois chunks; (2) `ICONS` era um objeto com `iconX.svg` (acesso a propriedade), que o esbuild não considera livre de efeito colateral e por isso não removia. Agora o `import()` usa o entry interno `@shyland-dev/ui/icons/catalog` (cópia independente de `ICONS`) e `ICONS` em `/icons` é `/* @__PURE__ */`. Num app com `provideShyIcons(iconCameraVideo)`: bundle inicial de 2,6 MB (256 kB transferidos) para ~143 kB (~43 kB transferidos); o catálogo segue como chunk lazy.
- API pública inalterada: `provideShyIcons`, `iconX`, `ICONS` (em `@shyland-dev/ui/icons`), `<shy-icon>`, fallback `question-circle` e variantes `-fill`.

### Alterado

- `check-icon-bundle` agora builda o cenário recomendado (`provideShyIcons` + import estático de `/icons`), que era o caso não coberto.
- O pacote ganha o entry point `@shyland-dev/ui/icons/catalog` (uso interno, não faça import dele no app); o tarball cresce ~2,4 MB descompactado por causa da cópia do catálogo.

## [1.1.0] - 2026-10-25

### Corrigido

- **Bundle**: o catálogo de ~2000 ícones (≈2,5 MB bruto) entrava no bundle inicial de qualquer app que usasse `<shy-icon>` (inclusive via app-shell, alert, empty-state...). Num app mínimo o bundle inicial passou de 2,54 MB (248 kB transferidos) para ~142 kB (~43 kB transferidos).
- `<shy-app-shell>` sem conteúdo em `slot="sidebar"` não reserva mais a coluna da sidebar (o `main` ficava espremido) e não mostra mais o botão de menu que abria um Drawer vazio, em `auto`, `drawer` e `inline`. Dispensa o contorno `--shy-app-shell-sidebar-width: 0` e o `sidebarMode="inline"` só para esconder o menu.

### Adicionado

- Subpath `@shyland-dev/ui/icons`: um export tree-shakeable por ícone (`iconHouse`, `iconCameraVideo`, `icon0Circle`...), o tipo `ShyIcon` e o catálogo completo `ICONS`.
- `provideShyIcons(...icons)` e `IconRegistry`: registro explícito de ícones. Os 19 ícones usados pelos componentes da lib (e o fallback `question-circle`) já vêm registrados.
- Nome não registrado (inclusive dinâmico) continua funcionando: carrega o catálogo sob demanda num chunk lazy (com `PendingTasks` para SSR) e avisa no console em dev. A API de `<shy-icon>` não mudou.
- `npm run check:ds` ganhou `check-icon-bundle`: builda um app mínimo e falha se o bundle inicial passar de 200 kB ou se o catálogo voltar para ele.

### Alterado

- **`ICONS` saiu da raiz**: use `import { ICONS } from '@shyland-dev/ui/icons'` (erro de compilação, não silencioso). Ele continua sendo o catálogo inteiro: importá-lo estaticamente traz tudo para o bundle. Estritamente é uma remoção de export (semver major); se preferir não tratar assim, é a única quebra desta versão.

## [1.0.0] - 2026-10-21

Reformulação completa do Design System. **Breaking**: sem alias e sem API `@deprecated`.

### Removido (breaking)

- Nomes sem prefixo: `--responsive-unit`, `$responsive-unit`, `--dynamic-*`, `$dynamic-*` e todas as `$color-*` (`_variables.scss` foi apagado). Tudo agora é `--shy-*` / `ru()`.
- Tokens de componente em camelCase (`--shySelectBackground`, `--shySnackbarWidth`...): viraram `--shy-<componente>-*` em kebab-case.
- Fonte Inter: só JetBrains Mono (woff2, subset latin, licença OFL incluída).
- Select antigo: `selectOptions`, `selectedOption`, `onSelectionChange`, `SelectOption`, `SelectionChangeEvent`.
- Snackbar antigo: `<shy-snackbar>` (`SnackbarComponent`), `SnackbarService.show({ element, ... })`, `SnackbarShowOptions`.

### Alterado (breaking)

- Os tokens vêm do CSS: adicione `@shyland-dev/ui/styles/index.css` em `angular.json > styles`. `@use '@shyland-dev/ui/styles'` passa a dar só funções e mixins (`ru()`, `z()`, `up()`...).
- Toda unidade de comprimento é `calc(var(--shy-responsive-unit) * N)` (SCSS: `ru(N)`; TypeScript: `ru(n)`): sem `px`, `rem`, `em`, `vw`, `vh`.
- Tema escuro é o padrão; claro e sistema por `ThemeService`/`<shy-theme-toggle>` (`data-theme`).
- `shy-select` ganhou `options`, `[(value)]`, `multiple`, `compareWith`, CVA, painel no `OverlayService` e ARIA de combobox/listbox; o painel e os toasts leem tokens de `:root`.
- `SnackbarService.show(texto, opções)` devolve `ShySnackbarRef` e ganhou fila, `intent`, `action`, pausa por foco/hover e `provideShySnackbar()`.
- `shy-icon` é decorativo por padrão (`name`, `label`); ícone inexistente vira `question-circle`.

### Adicionado

- **Fundações**: tokens em 3 camadas (primitivo, semântico, componente), temas claro/escuro, motion com `prefers-reduced-motion`, camadas de z-index, `forced-colors`, fontes self-hosted, `ru()`.
- **Onda 1**: Button, IconButton, Spinner, Skeleton, Progress, Input/Textarea, FormField, Checkbox, Switch, Radio, Badge, Divider, Card, Alert.
- **Onda 2**: `OverlayService`, Dialog/Drawer (+ serviços), Popover, Menu, Tooltip, Select, Snackbar.
- **Onda 3**: Tabs, Accordion, Breadcrumb, Pagination, Avatar, EmptyState, List, Table (ordenação e seleção opcionais), Combobox, Slider, FileDropzone, Stepper, AppShell.
- Acessibilidade WCAG 2.2 AA: contraste verificado (`check-contrast`), teclado conforme APG, `aria-*`, foco visível, `prefers-reduced-motion`, `forced-colors`, RTL.
- Qualidade: `npm run check:ds` (unidades, calibração, tokens, contraste, literais, fontes, tamanho), 288 testes (vitest), `scripts/audit-showcase.mjs` (auditoria no Chromium).
- Showcase com uma página por componente e por fundação.

### Segurança

- Zero dependências de runtime (só peers do Angular). `npm audit` aponta apenas ferramentas de desenvolvimento (Angular CLI/Vite); nada vem da lib.

## [0.0.17] e anteriores

Versões pré-reformulação (`Select`, `Snackbar`, `Icon` e utilitários SCSS). Sem changelog.
