# Migração 0.0.x → 0.1.0

A `0.1.0` é breaking e **não mantém alias** (decisão de 2026-10-20). O que muda na F1 está abaixo; a F2 (componentes existentes) acrescenta a troca dos `$color-*` e dos tokens camelCase de `select` e `snackbar`.

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

## 4. `$color-*` (sai na F2)

Continuam existindo nesta fase só para `select`, `snackbar` e as páginas antigas do showcase. Troca prevista (a tabela final sai na F2):

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

## 6. Novidades úteis

`ThemeService` + `<shy-theme-toggle>`, `ru()` (SCSS e TS), `z()` / `shy-layer`, `up()` / `down()`, `focus-ring`, `shy-state`, `state-layer`, fontes self-hosted, `npm run check:ds` para o seu projeto copiar a ideia dos scripts de `scripts/`.
