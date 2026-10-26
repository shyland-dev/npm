# Unidades

## Regra

Toda unidade de comprimento em CSS é `calc(var(--shy-responsive-unit) * N)`:

| Onde       | Como                                                              |
| ---------- | ----------------------------------------------------------------- |
| CSS puro   | `calc(var(--shy-responsive-unit) * 4)`                            |
| SCSS       | `ru(4)` (`@use '@shyland-dev/ui/styles' as *`); negativo `ru(-1)` |
| TypeScript | `ru(4)` de `@shyland-dev/ui` (nunca `style.width = '12px'`)       |

Proibido fora das exceções: `px`, `rem`, `em`, `vw`, `vh`, `vmin`, `vmax`, `dvw`, `dvh`, `svw`, `svh`, `lvw`, `lvh`, `ch`, `ex`, `cap`, `lh`, `rlh`, `pt`, `pc`, `cm`, `mm`, `in`, `cq*`.

## Definição

`tokens/units.css` é o único lugar com unidade literal:

```css
--shy-responsive-unit: calc(0.1rem + 0.1vmin);
```

Com `rem` = 16 px, **1 ru = 1,6 px + (menor lado da janela) / 1000**. Também vivem ali `--shy-dynamic-height` / `--shy-dynamic-width` (`100dvh`/`100dvw` com fallback para `vh`/`vw`) e as `*-unit` (1/100 deles).

## Exceções (E1–E4)

| #   | Exceção                                                                                        |
| --- | ---------------------------------------------------------------------------------------------- |
| E1  | `tokens/units.css`                                                                             |
| E2  | Condições de `@media`/`@container`, só em `_breakpoints.scss` (o CSS não aceita `var()` ali)   |
| E3  | Valores que não são comprimento: `0`, `%`, `fr`, números puros, `ms`/`s`, `deg`, `auto`/`none` |
| E4  | Atributos SVG/HTML fora do CSS (`viewBox`)                                                     |

`check-units` ainda ignora `icons.ts` (strings de SVG geradas) e `src/libs/ui/src/assets/` (fontes dos ícones, não vão para o pacote). Não há baseline: a F2 zerou os usos de `1em` do ícone e o `check-units` falha em qualquer violação.

## Quanto vale cada ru

| Viewport  | 1 ru (px) | 7,5 ru (corpo) | 18 ru (controle md) |
| --------- | --------- | -------------- | ------------------- |
| 360×800   | 1,96      | 14,7           | 35,3                |
| 768×1024  | 2,37      | 17,8           | 42,6                |
| 1366×768  | 2,37      | 17,8           | 42,6                |
| 1920×1080 | 2,68      | 20,1           | 48,2                |
| 3840×2160 | 3,76      | 28,2           | 67,7                |

A tabela completa é a página `/foundations/units` do showcase; `node scripts/check-calibration.mjs --table` imprime os tokens por viewport.

## Medidas do ponteiro (exceção de código)

O arrasto (swipe do toast, drag do Drawer) escreve `--_swipe-x`/`--_drag-x|y` com o deslocamento real do dedo, em pixels do evento. Isso é uma medida de entrada, não um tamanho de design, e não existe em `ru`. O helper `devicePx(n)` (`utils/drag.ts`, interno) concentra essa conversão: nenhum SCSS/CSS de componente tem `px` literal. Os tokens `--shy-safe-area-*` (`env()`, fallback `0px`) ficam em `tokens/units.css` (E1), como as demais unidades literais.

## Consequências conhecidas

1. A escala é calibrada para o pior caso (360×800); `check-calibration` falha se texto < 12 px, corpo < 14 px ou controle < 24 px nele, ou se o crescimento 4K/celular passar de 2,1×.
2. Em telas grandes a UI cresce (corpo ≈ 20 px em FHD, ≈ 28 px em 4K). É consequência direta do ru.
3. Zoom do navegador a 200%: o texto cresce ≈ 1,6× (FHD) a 1,8× (celular), não 2×. Ver [accessibility.md](accessibility.md).
