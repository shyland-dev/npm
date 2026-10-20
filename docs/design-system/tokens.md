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

## Verificação

`npm run check:ds` roda:

| Script              | Garante                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `check-tokens`      | mesmos tokens semânticos nos dois temas; `var(--shy-x)` sem fallback sempre definido; `$layers` = `layers.css` |
| `check-contrast`    | 52 pares de `scripts/contrast-pairs.json` ≥ 4,5:1 (texto) ou 3:1 (UI, foco, borda de controle) nos dois temas  |
| `check-calibration` | tamanhos em px nos viewports de referência                                                                     |
| `check-hardcoded`   | sem cor, tempo, easing, `z-index` nem `font-family` literais em SCSS de componente                             |

Para ajustar uma cor, mude o primitivo/semântico e rode `npm run check:ds`; a página `/foundations/colors` mostra o resultado nos dois temas.

## Camadas (z-index)

`base 0 → raised 100 → dropdown 200 → sticky 300 → fixed 400 → drawer 500 → modal 600 → popover 700 → tooltip 800 → toast 900`.

SCSS: `z(modal, 1)` ou `@include shy-layer(tooltip)`; `$offset` de -50 a 50, camada inexistente é `@error`. Elementos no top layer (`<dialog>.showModal()`, `[popover]`) ignoram `z-index` entre si e seguem a ordem de abertura; a promoção dos overlays é da F4. `z-index` literal só `0`, `1`, `-1` dentro de componente com `isolation: isolate`.
