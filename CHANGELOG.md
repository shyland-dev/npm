# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versionamento: [SemVer](https://semver.org/lang/pt-BR/).
Pacotes: `@shyland-dev/ui` (este changelog) e `@shyland-dev/utils` (sem mudanças nesta versão). O passo a passo de migração, com busca e substituição, está em [docs/design-system/migration-0.0-to-1.0.md](docs/design-system/migration-0.0-to-1.0.md).

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
