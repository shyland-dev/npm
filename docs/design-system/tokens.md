# Tokens

Arquivos em `src/libs/ui/src/lib/styles/tokens/`. CSS puro, sem build step. Nomes `--shy-*` em kebab-case.

| Arquivo              | Conteúdo                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `units.css`          | `--shy-responsive-unit`, `--shy-dynamic-height/width` (+ `-unit`)                                                                                                                         |
| `primitives.css`     | escalas de cor (6 × 11 passos + `neutral-850`), `--shy-gradient-brand`, fontes, `--shy-text-*`, pesos, leading, tracking, espaço, raio, tamanhos, borda, foco, `--shy-state-*`, opacidade |
| `semantic-dark.css`  | `:root` (padrão): cores semânticas e `--shy-shadow-1…5`                                                                                                                                   |
| `semantic-light.css` | `:root[data-theme='light']`: os mesmos nomes                                                                                                                                              |
| `motion.css`         | durações, easings, `--shy-motion-distance`, atalhos de transition, reduced motion                                                                                                         |
| `layers.css`         | `--shy-z-*` (passo de 100)                                                                                                                                                                |

## Cores semânticas

Superfícies: `bg`, `surface`, `surface-raised`, `surface-sunken`. Texto: `text`, `text-muted`, `text-subtle`, `text-disabled`. Borda: `border` (decorativa), `border-strong` (controles, ≥ 3:1), `line` (conectores), `track` (trilho de progress e base do skeleton). Outros: `focus`, `scrim`, `scrim-panel` (+ `scrim-panel-border`, `on-scrim`), `neutral-soft` / `on-neutral-soft`.

Por intenção `X` ∈ `primary | success | warning | danger | info`: `--shy-color-X` (fundo sólido), `--shy-color-on-X` (texto sobre o sólido), `--shy-color-X-text` (texto/ícone/borda sobre superfície), `--shy-color-X-soft` (fundo suave), `--shy-color-on-X-soft`.

Hover e pressed não têm cor própria: usam a camada de estado (`--shy-state-hover: 0.08`, `--shy-state-pressed: 0.12`) via `@include state-layer`.

### Por que o `primary` muda de passo por tema

`#4C00FF` sobre `#070811` tem só 2,6:1. No escuro, o fundo sólido é o 600 (com texto branco) e texto/borda/foco usam o 400 (`#818BFD`); no claro, texto e foco usam o 600.

## Tokens de componente (Onda 1)

Terceira camada: `--shy-<componente>-*`, **nunca definidos pela lib**. O componente lê `var(--shy-<comp>-x, var(--shy-color-…))`, então o padrão vem do semântico (e muda com o tema) e o app sobrescreve só o que precisar, em qualquer seletor (`:root`, uma classe, `style=""`). Padrões e descrição de cada um: tabelas "… Tokens" em [`src/libs/ui/README.md`](../../src/libs/ui/README.md).

| Componente                | Tokens                                                                                                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                    | `--shy-button-{bg,fg,border-color,radius,height,pad-x,gap,font-size,font-weight}`                                                                                                                                                                                            |
| IconButton                | `--shy-icon-button-size` (+ os do Button)                                                                                                                                                                                                                                    |
| Spinner                   | `--shy-spinner-{size,color}`                                                                                                                                                                                                                                                 |
| Skeleton                  | `--shy-skeleton-{bg,highlight,radius,width,height,size,line-height,gap}`                                                                                                                                                                                                     |
| Progress / circular       | `--shy-progress-{bar,track,height,radius}`, `--shy-progress-circular-{bar,track,size}`                                                                                                                                                                                       |
| Input / FormField         | `--shy-input-{bg,fg,border-color,border-color-hover,border-color-invalid,placeholder,radius,height,pad-x,font-size}`, `--shy-form-field-{gap,label-color,hint-color,error-color}`                                                                                            |
| Checkbox / Radio / Switch | `--shy-{checkbox,radio,switch}-{bg,fg,gap,border-color,border-color-hover,mark-color,checked-bg,checked-border}`, `--shy-{checkbox,radio}-size`, `--shy-checkbox-radius`, `--shy-switch-{width,height,thumb,thumb-checked,thumb-size}`, `--shy-radio-group-{gap,gap-inline}` |
| Badge                     | `--shy-badge-{bg,fg,border-color,height,pad-x,gap,font-size,radius,dot-size}`                                                                                                                                                                                                |
| Divider                   | `--shy-divider-{color,text-color,gap}`                                                                                                                                                                                                                                       |
| Card                      | `--shy-card-{bg,fg,border-color,border-color-hover,shadow,radius,pad-x,pad-y}`                                                                                                                                                                                               |
| Alert                     | `--shy-alert-{bg,fg,border-color,icon-color,pad,gap,radius}`                                                                                                                                                                                                                 |

Regras: cor de componente sempre cai num semântico que já está em `contrast-pairs.json` (ao sobrescrever, o app assume o contraste); medidas caem em `--shy-space-*`, `--shy-size-*`, `--shy-radius-*` ou `ru(N)`. Variáveis `--_x` dentro do SCSS são privadas e não fazem parte da API.

## Tokens de componente (Onda 2)

Mesma regra da Onda 1 (nunca definidos pela lib; o componente lê com fallback no semântico). Painéis que moram no contêiner de overlays (Select, Snackbar, Popover, Menu, Tooltip, Dialog, Drawer) leem os tokens **do ancestral do `<body>`**: defina em `:root` (ou numa classe no `html`/`body`), não no elemento que abriu o painel. Os tokens do botão do Select valem no próprio elemento.

| Componente | Tokens                                                                                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dialog     | `--shy-dialog-{width,bg,fg,border-color,shadow,radius,padding}`                                                                                                                                                            |
| Drawer     | `--shy-drawer-{width,height,bg,fg,border-color,shadow,radius,padding}`                                                                                                                                                     |
| Popover    | `--shy-popover-{bg,fg,border-color,shadow,radius,padding,max-width}`                                                                                                                                                       |
| Menu       | `--shy-menu-*` (superfície) e `--shy-menu-item-*`                                                                                                                                                                          |
| Tooltip    | `--shy-tooltip-{bg,fg,border-color,radius,padding,max-width}`; atrasos `--shy-delay-tooltip` (500 ms) e `--shy-delay-tooltip-hide` (100 ms) em `motion.css`                                                                |
| Select     | `--shy-select-{height,width,radius,bg,fg,border,border-color-invalid,placeholder-fg,font-family,font-size,icon-size,panel-bg,panel-shadow,panel-max-height,selected-fg,option-hover-bg,option-hover-fg,option-img-radius}` |
| Snackbar   | `--shy-snackbar-{bg,fg,border,width,radius,offset,gap,font-family,font-size,icon-size}`                                                                                                                                    |

Os atrasos do tooltip são intenção, não movimento: `prefers-reduced-motion` não os zera. Pares de contraste: nenhum par novo na Onda 2 (Popover/Menu/Select/Dialog usam `surface-raised`; Tooltip usa `on-scrim` sobre `scrim-panel`; toasts por intenção usam os pares `*-soft` do Alert).

## Tokens de componente (Onda 3, lote 1)

Mesma regra (nunca definidos pela lib; o componente lê com fallback no semântico). Tudo vive no elemento do componente, sem painel em overlay.

| Componente | Tokens                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| Tabs       | `--shy-tabs-{fg,fg-hover,fg-selected,bg-hover,bg-active,indicator-color,line-color,height,pad-x,gap,list-gap,panel-pad-y}` |
| Accordion  | `--shy-accordion-{bg,border-color,radius,content-color,height,pad-x,gap,content-pad-y}`                                    |
| Breadcrumb | `--shy-breadcrumb-{fg,fg-current,separator,gap}`                                                                           |
| Pagination | `--shy-pagination-{fg,bg-current,fg-current,size,radius,gap}`                                                              |

Pares de contraste: nenhum par novo (`text`/`text-muted`/`text-subtle` sobre `bg`/`surface`, `on-neutral-soft` sobre `neutral-soft` no hover/active da aba, `on-primary` sobre `primary` na página atual e `focus` já estão em `contrast-pairs.json`).

### Pares de contraste da Onda 1

Todos os pares que os componentes da Onda 1 usam estão em `contrast-pairs.json` (56 pares × 2 temas): texto sobre superfícies (`text*`/`surface*`), sólidos (`on-X`/`X`), suaves (`on-X-soft`/`X-soft`, `X-text`/`X-soft`), texto de intenção sobre superfícies (`X-text`), borda de controle e foco (`border-strong`, `focus`, ≥ 3:1), trilho (`primary-text`/`track`, `text-muted`/`track`). Ficam de fora, por serem decorativos (WCAG 1.4.11 não exige): `border`, `line` (divider, borda de card), `track` contra a página e o fundo do skeleton. O fundo `primary` sólido no tema escuro (2,6:1 sobre `bg`) só aparece com texto/glifo `on-primary` por cima; o contorno dos controles marcados usa `primary-text` (ADR-F3-6).

## Verificação

`npm run check:ds` roda:

| Script              | Garante                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `check-tokens`      | mesmos tokens semânticos nos dois temas; `var(--shy-x)` sem fallback sempre definido; `$layers` = `layers.css` |
| `check-contrast`    | 56 pares de `scripts/contrast-pairs.json` ≥ 4,5:1 (texto) ou 3:1 (UI, foco, borda de controle) nos dois temas  |
| `check-calibration` | tamanhos em px nos viewports de referência                                                                     |
| `check-hardcoded`   | sem cor, tempo, easing, `z-index` nem `font-family` literais em SCSS de componente                             |

Para ajustar uma cor, mude o primitivo/semântico e rode `npm run check:ds`; a página `/foundations/colors` mostra o resultado nos dois temas.

## Camadas (z-index)

`base 0 → raised 100 → dropdown 200 → sticky 300 → fixed 400 → drawer 500 → modal 600 → popover 700 → tooltip 800 → toast 900`.

SCSS: `z(modal, 1)` ou `@include shy-layer(tooltip)`; `$offset` de -50 a 50, camada inexistente é `@error`. Elementos no top layer (`<dialog>.showModal()`, `[popover]`) ignoram `z-index` entre si e seguem a ordem de abertura; a promoção dos overlays é da F4. `z-index` literal só `0`, `1`, `-1` dentro de componente com `isolation: isolate`.
