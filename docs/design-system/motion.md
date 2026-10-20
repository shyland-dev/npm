# Motion

Tokens em `tokens/motion.css`; keyframes em `animations.css`.

| Token                                          | Valor                                         | Uso                                         |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| `--shy-duration-instant/fast/base/slow/slower` | 80 / 120 / 200 / 320 / 500 ms                 | press, hover, switch/tabs, dialog, skeleton |
| `--shy-ease-standard`                          | `cubic-bezier(0.2, 0, 0, 1)`                  | mudanças de estado                          |
| `--shy-ease-enter` / `--shy-ease-exit`         | `(0.05, 0.7, 0.1, 1)` / `(0.3, 0, 0.8, 0.15)` | entrar / sair                               |
| `--shy-motion-distance`                        | `calc(ru * 3)`                                | deslocamento de slide                       |
| `--shy-transition-colors/opacity/transform`    | atalhos com `fast` + `standard`               |                                             |

## Regras

1. Animar só `opacity`, `transform`, cor, fundo e borda. Nunca `width/height/top/left` (colapso com `grid-template-rows: 0fr → 1fr`).
2. Entrada com `ease-enter`; saída com `ease-exit`, ~70% da duração.
3. `prefers-reduced-motion: reduce` e `[data-motion='reduced']` zeram as durações (`0.01ms`) e `--shy-motion-distance` **uma vez**, nos tokens. Componentes não precisam tratar de novo; o showcase tem o botão "Reduce motion".
4. Nada essencial depende de movimento; nada pisca mais de 3 vezes por segundo.

## Keyframes

`shy-fade-in/out`, `shy-scale-in/out`, `shy-slide-up/down/inline-start/inline-end`, `shy-collapse`, `shy-spin`, `shy-pulse`, `shy-shimmer`, `shy-progress-indeterminate`, `shy-shake`. Deslocamentos usam `--shy-motion-distance`.

## Enter/leave (confirmado na F0)

`animate.enter` / `animate.leave` do Angular 21 são estáveis e funcionam em zoneless; usar em elementos de `@if`. Para `<dialog>` e `[popover]` (top layer): `@starting-style` + `transition-behavior: allow-discrete` na entrada e `data-state="closing"` aguardando `transitionend` (com timeout) antes de `close()`/`hidePopover()` na saída (F4). Sem `@angular/animations`.
