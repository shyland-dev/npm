# Acessibilidade (baseline WCAG 2.2 AA)

## O que a F1 já garante

- **Contraste:** `check-contrast` valida os 55 pares de `contrast-pairs.json` (texto ≥ 4,5:1; foco, borda de controle ≥ 3:1) nos dois temas e falha em regressão. O texto `text-disabled` é isento (WCAG 1.4.3).
- **Tamanho mínimo:** `check-calibration` mantém texto ≥ 12 px, corpo ≥ 14 px e controle ≥ 24 px (WCAG 2.5.8) em 360×800; com `pointer: coarse` o controle `md` chega a 44 px.
- **Foco:** `:focus-visible` com anel em `--shy-color-focus` (largura/offset em ru) no `base.css` e em `@include focus-ring`; em `forced-colors: active` o anel usa `Highlight`.
- **Movimento:** `prefers-reduced-motion` e `[data-motion='reduced']` tratados nos tokens ([motion.md](motion.md)).
- **Tema:** `color-scheme` por tema; `<shy-theme-toggle>` é um radiogroup (APG) com roving tabindex e setas.
- **Fonte do usuário:** o `ru` não depende de `px`, então a parte `rem` respeita a fonte configurada pelo usuário.

## Limite conhecido: zoom 200% (WCAG 1.4.4)

O `ru` = `0.1rem + 0.1vmin`. Ao dar zoom de 200%, a janela em px CSS diminui pela metade e o `vmin` encolhe junto, então o texto cresce só ≈ 1,6× (FHD) a 1,8× (celular), não 2×. A regra de unidades foi mantida e o risco fica registrado aqui. Se algum projeto exigir conformidade estrita com 1.4.4, a alternativa (ex.: modo de escala fixa por atributo) só será implementada com aprovação.

## Campos de texto (F3-S3)

| Componente                 | Teclado / ARIA                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `input/textarea[shyInput]` | Elemento nativo (Tab, digitação, Esc do navegador). `aria-invalid="true"` e `aria-errormessage` só quando inválido; `aria-describedby` = dica + erro; `required` nativo; anel de foco `:focus-visible` |
| `shy-form-field`           | `<label for>` ligado ao `id` do controle; asterisco `aria-hidden` (o `required` nativo informa); erro com ícone + texto em `aria-live="polite"`; contador fora do `aria-describedby`                   |

Contraste dos pares sobre `surface-sunken` conferido em `check-contrast`. `forced-colors`: borda `FieldText`, inválido tracejado.

## Por componente (F2 em diante)

Teclado completo sem armadilha, ordem de foco lógica, nome acessível em todo controle, `aria-*` conforme APG (Listbox/Select, Combobox, Dialog, Tabs, Menu button, Tooltip, Switch, Radio group, Checkbox, Accordion, Alert/Status), mensagens dinâmicas com `role="status"`/`role="alert"`, cor nunca como única pista. Checklist manual por onda: só teclado; zoom 200%; largura 320 px; `forced-colors`; `reduced-motion`; claro e escuro; 360×800, 1366×768 e 1920×1080.
