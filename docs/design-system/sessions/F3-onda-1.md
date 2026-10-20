# F3 Onda 1: formulários e feedback básico

Fonte: plano mestre seção 12 (tabela Onda 1) e seções 8 a 11. Cada sessão é independente do ponto de vista de contexto, mas segue a ordem (S2 em diante usa o que S1 criou).

Inclui os resíduos da Onda 0 (decisão D-F2-1): classes de tipografia, `.shy-sr-only`, layout e `animateOut`.

---

## F3-S1: utilitários da Onda 0 + Button + IconButton

**Escopo**

- `styles/typography.css`: `.shy-h1`…`.shy-h6`, `.shy-body`, `.shy-caption`, `.shy-code` (só tokens `--shy-text-*`, `--shy-weight-*`, `--shy-leading-*`); `.shy-sr-only` (usa o mixin `visually-hidden`).
- `styles/layout.css`: `shy-stack`, `shy-cluster`, `shy-grid`, `shy-container` (gap por token `--shy-space-*`, propriedades lógicas). Entram no `index.css` e no `_global.scss`.
- `animateOut(el, {name?, onDone})` em `lib/utils/` (usa `animationend`/`transitionend` + fallback por timer vindo do token `--shy-duration-*`, respeita `data-motion="reduced"` e `prefers-reduced-motion`), exportado; teste. Pesquisar `animate.leave` do Angular 21 (ver ADR da F0) para decidir se o helper é só fallback.
- `Button` (`button[shyButton]`, `a[shyButton]`): `variant` solid|soft|outline|ghost|link, `intent` (primary, neutral, success, warning, danger, info), `size` sm|md|lg, `loading`, `loadingPosition` start|end|replace, `loadingText`, `block`. Loading = `aria-busy` + desabilita ação sem sair do foco; spinner provisório via `shy-icon`/CSS (o `Spinner` completo vem na S2).
- `IconButton` (`button[shyIconButton]`): `label` obrigatório (vira `aria-label`), alvo mínimo `--shy-size-control-*` (coarse pointer maior).
- Showcase: `components/button`, `components/icon-button`, `foundations/typography` ganha as classes.

**Arquivos**: `styles/{typography,layout}.css`, `lib/utils/animate-out.ts`, `lib/components/{button,icon-button}/*`, `public-api.ts`, `src/apps/app/**`, `src/libs/ui/README.md`.

**Gate**: matriz variant × intent × size × estado nos dois temas sem contraste abaixo de 4,5:1 (adicionar pares novos em `scripts/contrast-pairs.json`); teclado (Enter/Space em `button`; Space não ativa `a`); `loading` mantém largura; testes de estado e `aria-busy`.

**Commit proposto**: `feat(ui): button, icon-button, tipografia e layout utilitários`

---

## F3-S2: Spinner, Skeleton, ProgressCircular, Progress

**Escopo**

- `Spinner` (`shy-spinner`): variantes ring, ring-track, dash, dots, bars, pulse, orbit, breathe; tamanhos xs a lg; `label` opcional (`role="status"`); cor por `currentColor`/token; motion só por `animations.css`/tokens, sem animar com `reduced-motion` (troca por indicador estático).
- `Skeleton` (`shy-skeleton`): shape text|circle|rect, `lines`, shimmer por token, `aria-hidden` + região `aria-busy` documentada.
- `ProgressCircular` e `Progress` (linear): `value`, `max`, indeterminado, `label`; `role="progressbar"` com `aria-valuenow/min/max`.
- Trocar o spinner provisório do Button pelo `Spinner`.
- Showcase: `components/{spinner,skeleton,progress}`.

**Gate**: indeterminado respeita reduced-motion; ARIA de progressbar testada; Button loading usa o `Spinner`; contraste de trilho/barra ≥ 3:1.

**Commit proposto**: `feat(ui): spinner, skeleton e progress`

---

## F3-S3: FormField + Input + Textarea

**Escopo**

- `FormField` (`shy-form-field`): label, hint, erro, contador opcional; liga `for`/`id`, `aria-describedby`, `aria-invalid`, `aria-errormessage` via contexto injetado (sem CDK). Estado `invalid` vem do `NgControl` (touched + errors) ou do input `invalid`.
- `Input` (`input[shyInput]`) e `Textarea` (`textarea[shyInput]`): tamanhos, prefixo/sufixo (slots), `disabled`, `readonly`, `invalid`, `required`; CVA onde necessário (diretiva sobre o elemento nativo, então o nativo já funciona com `ngModel`/`formControl`).
- Tokens `--shy-input-*`; foco visível com `focus-ring`; erro nunca só por cor (ícone + texto).
- Showcase: `components/{form-field,input,textarea}` com formulário reativo de exemplo.

**Gate**: leitura do erro por leitor de tela (ARIA testada em jsdom/happy-dom); autofill e `forced-colors` conferidos no Chromium; `check-units` verde.

**Commit proposto**: `feat(ui): form-field, input e textarea`

---

## F3-S4: Checkbox + Radio + Switch (CVA)

**Escopo**

- `Checkbox` (`shy-checkbox`): `checked` (`model()`), `indeterminate`, CVA, label por projeção; input nativo visualmente oculto (`visually-hidden`), não `display:none`.
- `Radio` + `RadioGroup` (`shy-radio-group`/`shy-radio`): `role="radiogroup"`, roving tabindex, setas movem e selecionam, CVA no grupo.
- `Switch` (`shy-switch`): `role="switch"`, `aria-checked`, Space alterna, CVA.
- Tokens `--shy-checkbox-*`, `--shy-radio-*`, `--shy-switch-*`; alvo de toque ≥ `--shy-size-control-sm` em coarse pointer.
- Showcase: `components/{checkbox,radio,switch}`.

**Gate**: teclado conforme APG (checkbox, radio group, switch); integração com `FormField` (invalid/disabled); forced-colors mostra o estado marcado.

**Commit proposto**: `feat(ui): checkbox, radio e switch`

---

## F3-S5: Badge/Tag, Divider, Card, Alert

**Escopo**

- `Badge`/`Tag` (`shy-badge`): intent, variant soft|solid|outline, `removable` (botão com `label`), contador/ponto.
- `Divider` (`shy-divider`): horizontal/vertical, `role="separator"`, com texto opcional.
- `Card` (`shy-card`): header/body/footer por slots, `interactive` (vira link/botão com foco e hover), elevação por `--shy-shadow-*`.
- `Alert` (`shy-alert`): intent info|success|warning|danger, ícone + título + ação, `role="alert"` só para danger/warning urgentes, `role="status"` nos demais, `dismissible`.
- Showcase: `components/{badge,divider,card,alert}`.

**Gate**: contraste dos pares `*-soft`/`*-text` nos dois temas; Alert nunca informa só por cor; `Card interactive` com foco visível.

**Commit proposto**: `feat(ui): badge, divider, card e alert`

---

## F3-S6: fechamento da Onda 1

**Escopo**

- Revisão cruzada: `FormField` com todos os controles; página de exemplo "formulário completo" no showcase nos dois temas e com `Reduce motion`.
- `check-tokens` sem tokens órfãos novos; `check-contrast` com todos os pares da Onda 1.
- Auditoria de teclado (tab order, foco visível) no Chromium; screenshot dos componentes nos dois temas.
- Docs: `docs/design-system/tokens.md` (tokens de componente), `accessibility.md` (matriz de teclado/ARIA da Onda 1), README (tabela de componentes e exports).
- Gate da F3 completo e relatório consolidado.

**Gate**: todos os gates anteriores + relatório final da F3; ao aprovar, avança para F4-S1.

**Commit proposto**: `docs: fechar onda 1 (formulário completo, a11y e tokens)`
