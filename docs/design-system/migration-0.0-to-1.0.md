# Migração 0.0.x → 1.0.0

A `1.0.0` (a primeira major; decisão do dono, 2026-10-21) é breaking e **não mantém alias nem API `@deprecated`** (decisões de 2026-10-20 e 2026-10-21). Estão aqui as mudanças globais (F1), dos componentes existentes (F2) e a remoção do Select e do Snackbar antigos (F4/F5-S4). O que mudou em cada versão está no [CHANGELOG](../../CHANGELOG.md).

Ordem sugerida: 1) estilos (seção 1), 2) busca e substituição (seção 2), 3) unidades e cores (3 e 4), 4) tokens de componente (5.1), 5) Select e Snackbar (5.2), 6) `npm run build` do seu projeto.

## 1. Carregar os estilos

Antes: `@use '@shyland-dev/ui/styles' as *;` no `styles.scss` trazia os tokens.

Agora: os tokens vêm do CSS. Em `angular.json > styles`:

```json
"styles": ["node_modules/@shyland-dev/ui/styles/index.css", "src/styles.scss"]
```

e `@use '@shyland-dev/ui/styles' as *;` passa a dar só funções e mixins (`ru()`, `z()`, `up()`...). Alternativas (`@import` em CSS, `@use '.../styles/global'`) no README.

## 2. Nomes removidos

| Antes                                           | Depois                                                  |
| ----------------------------------------------- | ------------------------------------------------------- |
| `var(--responsive-unit)`                        | `var(--shy-responsive-unit)`                            |
| `$responsive-unit`                              | `ru(1)` (SCSS)                                          |
| `calc(#{$responsive-unit} * N)`                 | `ru(N)`                                                 |
| `calc(var(--responsive-unit) * N)`              | `calc(var(--shy-responsive-unit) * N)` (ou `ru(N)`)     |
| `var(--dynamic-height)` / `$dynamic-height`     | `var(--shy-dynamic-height)`                             |
| `var(--dynamic-width)` / `$dynamic-width`       | `var(--shy-dynamic-width)`                              |
| `--dynamic-height-unit`, `--dynamic-width-unit` | `--shy-dynamic-height-unit`, `--shy-dynamic-width-unit` |

### Buscar e substituir (confira `git status` limpo antes; revise o diff depois)

bash / WSL Ubuntu, na raiz do seu projeto:

```bash
# 1) calc(#{$responsive-unit} * N) -> ru(N)
grep -rlE 'calc\(#\{\$responsive-unit\} \* -?[0-9.]+\)' src --include='*.scss' \
  | xargs sed -i -E 's/calc\(#\{\$responsive-unit\} \* (-?[0-9.]+)\)/ru(\1)/g'

# 2) nomes CSS sem prefixo -> com prefixo shy
grep -rlE -e '--(responsive-unit|dynamic-)' src \
  | xargs sed -i -E 's/--responsive-unit/--shy-responsive-unit/g; s/--dynamic-/--shy-dynamic-/g'

# 3) o que sobrar de $responsive-unit / $dynamic-* precisa de revisão manual
grep -rnE '\$responsive-unit|\$dynamic-' src
```

PowerShell (Windows), na raiz do projeto:

```powershell
Get-ChildItem src -Recurse -Include *.scss | ForEach-Object {
  $c = Get-Content $_ -Raw
  $n = $c -replace 'calc\(#\{\$responsive-unit\} \* (-?[0-9.]+)\)', 'ru($1)'
  if ($n -ne $c) { Set-Content $_ $n -NoNewline }
}
Get-ChildItem src -Recurse -Include *.scss,*.css,*.html,*.ts | ForEach-Object {
  $c = Get-Content $_ -Raw
  $n = $c -replace '--responsive-unit', '--shy-responsive-unit' -replace '--dynamic-', '--shy-dynamic-'
  if ($n -ne $c) { Set-Content $_ $n -NoNewline }
}
Select-String -Path src\**\*.scss -Pattern '\$responsive-unit|\$dynamic-'
```

## 3. Unidades literais

Troque `px`, `rem`, `em`, `vw`, `vh` etc. por `ru(N)` (SCSS), `calc(var(--shy-responsive-unit) * N)` (CSS) ou `ru(n)` de `@shyland-dev/ui` (TypeScript). A régua: com `rem` = 16 px, 1 ru ≈ 2 px no celular e ≈ 2,7 px em FHD (tabela em [units.md](units.md)). Exceções em `units.md`.

## 4. `$color-*` (removidos)

`_variables.scss` foi apagado na F2: nenhuma Sass variable de cor existe mais. Troca sugerida:

| `$color-*`                            | Token                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `$color-primary`                      | `var(--shy-color-primary)` (fundo) / `--shy-color-primary-text` (texto) |
| `$color-success`                      | `var(--shy-color-success)` / `--shy-color-success-text`                 |
| `$color-warning`                      | `var(--shy-color-warning)` / `--shy-color-warning-text`                 |
| `$color-danger`                       | `var(--shy-color-danger)` / `--shy-color-danger-text`                   |
| `$color-dark`                         | `var(--shy-color-surface)`                                              |
| `$color-black`                        | `var(--shy-color-bg)` (escuro) ou `var(--shy-neutral-950)`              |
| `$color-white`                        | `var(--shy-color-text)` ou `#fff` só dentro de `tokens/`                |
| `$color-medium`                       | `var(--shy-color-text-subtle)` / `--shy-color-border-strong`            |
| `$color-light`                        | `var(--shy-color-surface-sunken)` (claro) ou `--shy-neutral-100`        |
| `$color-secondary`, `$color-tertiary` | sem equivalente (a marca tem uma cor): usar `primary` ou `info`         |
| `$color-void`                         | `transparent`                                                           |

## 5. Mixins antigos

`fixedHeight`, `fixedWidth`, `fixedSquare`, `square`, `allVendors`, `landscape`, `portrait`, `dark-mode`, `light-mode` seguem funcionando. Em código novo, `dark-mode`/`light-mode` não servem: o tema vem de `data-theme` ([theming.md](theming.md)).

## 5.1 Tokens de componente

| Antes                                                   | Depois                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| `--shyIconSize`                                         | `--shy-icon-size` (padrão `--shy-size-icon-md`)            |
| `--shySelectHeight` / `Width` / `BorderRadius`          | `--shy-select-height` / `-width` / `-radius`               |
| `--shySelectBackground` / `Color`                       | `--shy-select-bg` / `--shy-select-fg`                      |
| `--shySelectFontFamily` / `FontSize` / `IconSize`       | `--shy-select-font-family` / `-font-size` / `-icon-size`   |
| `--shySelectDropdownBackground` / `DropdownBoxShadow`   | `--shy-select-panel-bg` / `--shy-select-panel-shadow`      |
| `--shySelectSelectedColor`                              | `--shy-select-selected-fg`                                 |
| `--shySelectOptionHoverBackground` / `OptionHoverColor` | `--shy-select-option-hover-bg` / `-hover-fg`               |
| `--shySelectOptionImgBorderRadius`                      | `--shy-select-option-img-radius`                           |
| `--shySnackbarBackground` / `Color`                     | `--shy-snackbar-bg` / `--shy-snackbar-fg`                  |
| `--shySnackbarWidth` / `BorderRadius` / `Offset`        | `--shy-snackbar-width` / `-radius` / `-offset`             |
| `--shySnackbarFontFamily` / `FontSize` / `IconSize`     | `--shy-snackbar-font-family` / `-font-size` / `-icon-size` |

Busca no seu projeto (bash): `grep -rnE -- '--shy(Icon|Select|Snackbar)[A-Z]' src`. Os padrões agora vêm dos tokens semânticos (tema claro/escuro), então um override com cor fixa deve virar `var(--shy-color-*)`.

Outras mudanças dos componentes: `Icon`, `Select` e `Snackbar` usam `input()`/`output()`/`model()` e `OnPush` (nomes no template iguais); o ícone para nome inexistente é `question-circle` (o `help` antigo nunca existiu); `shy-select` ganhou ARIA de listbox e teclado básico; `shy-snackbar` ganhou `role="status"`; `shy-icon` ganhou `name` e `label` e é decorativo por padrão.

## 5.2 Select e Snackbar (APIs antigas removidas na 1.0)

A API antiga foi marcada `@deprecated` na F4 e **removida na 1.0.0**. Não há mais compatibilidade: o template antigo deixa de compilar.

| Antes (removido)                                                                   | Depois                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `<shy-select [selectOptions]="opcoes">`                                            | `<shy-select [options]="opcoes">` (`{ value, label, disabled?, img? }`, sem `id`)           |
| `[selectedOption]="valor"` (string)                                                | `[(value)]="valor"`, `[(ngModel)]` ou `[formControl]` (qualquer tipo; array com `multiple`) |
| `(onSelectionChange)="f($event)"` (`selectedOption`)                               | `(valueChange)="f($event)"`, `ngModel` ou `formControl`                                     |
| `SelectOption`, `SelectionChangeEvent`                                             | `ShySelectOption`                                                                           |
| `<shy-snackbar #s>` + `@ViewChild` + `show({ element: s, text, delay, position })` | `inject(SnackbarService).show(texto, { duration: delay, position })` (sem elemento)         |
| `SnackbarComponent`, `SnackbarShowOptions`                                         | sem equivalente: remova o `<shy-snackbar>` e o `import`                                     |
| conteúdo projetado em `<shy-snackbar>`                                             | primeiro argumento de `show()` (texto); `intent` e `action` são novos                       |
| conteúdo projetado em `<shy-select>` como texto de "sem escolha"                   | continua valendo, mas prefira `placeholder`                                                 |

Tokens do painel do Select e dos toasts (`--shy-select-panel-*`, `--shy-select-option-*`, `--shy-snackbar-*`) agora valem em `:root`, não no elemento: o painel mora no contêiner de overlays. Os tokens do `<shy-snackbar>` antigo (largura/posição de um elemento fixo) seguem valendo para o toast novo (`--shy-snackbar-width`, `-offset`, `-radius`...).

Busca no seu projeto (bash): `grep -rnE 'selectOptions|selectedOption|onSelectionChange|SelectionChangeEvent|SelectOption\b|<shy-snackbar|SnackbarComponent|SnackbarShowOptions|element:' src`.

## 6. Novidades úteis

`ThemeService` + `<shy-theme-toggle>`, `ru()` (SCSS e TS), `z()` / `shy-layer`, `up()` / `down()`, `focus-ring`, `shy-state`, `state-layer`, fontes self-hosted, `npm run check:ds` para o seu projeto copiar a ideia dos scripts de `scripts/`.
