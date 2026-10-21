# Temas

## Mecanismo

- `:root` = escuro (padrão, vale sem JavaScript). `:root[data-theme='light']` = claro. Cada bloco define `color-scheme`, então scrollbars, controles nativos e `<dialog>` acompanham.
- `ThemeService` (`@shyland-dev/ui`): modos `'dark' | 'light' | 'system'`, padrão `'dark'`. Persiste em `localStorage` (chave `shy-theme`, configurável), resolve `system` com `matchMedia('(prefers-color-scheme: light)')` e escuta mudanças. Sempre grava `data-theme` (resolvido) e `data-theme-mode` (escolhido) em `<html>` e atualiza `<meta name="theme-color">` com `--shy-color-bg`. Tem guarda de SSR e `try/catch` no storage.
- `provideShyTheme({ defaultMode, storageKey })` em `providers`.
- `<shy-theme-toggle />`: radiogroup (claro / sistema / escuro) com roving tabindex e setas; textos pelo input `labels`.

## Sem flash

O serviço só roda depois do Angular carregar. O script inline do `<head>` (copiado no `index.html` do showcase e documentado no README) aplica o tema salvo antes do primeiro paint. Verificado no Chromium: com `light` salvo e o `main.js` bloqueado, `data-theme="light"` e o fundo claro já estão no DOM. Com CSP, libere o script por nonce ou hash.

## Para criar um componente

Use só tokens semânticos (`--shy-color-*`). Nunca `@media (prefers-color-scheme)` em componente: o tema vem de `data-theme`. Os mixins `dark-mode`/`light-mode` antigos seguem existindo mas não devem ser usados em código novo.
