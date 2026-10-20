# F4 Onda 2: overlays e reescrita de Select e Snackbar

Fonte: plano mestre seção 12 (Onda 2), seção sobre camadas/overlay e ADR-F0-7 (z-index por abertura). Sem `@angular/cdk`: posicionamento, foco e overlay são do próprio repo.

---

## F4-S1: núcleo de overlay

**Escopo**

- `computePosition(anchor, floating, {placement, offset, flip, shift, matchWidth})` em TS puro (sem DOM de tamanho em SSR), usando `getBoundingClientRect`; testes de unidade para flip/shift.
- `FocusScope` (diretiva/serviço): trap de foco, restaurar foco ao fechar, `inert` no fundo quando modal.
- `OverlayService`: abre/fecha camadas via top layer (`<dialog>`/Popover API quando disponível, fallback com `position: fixed` + `z()`); ordem por abertura (promoção: a última aberta fica por cima); Esc fecha só a camada do topo; fecha ao clicar fora (configurável); `animateOut` na saída.
- Teste de integração no showcase `foundations/layers` (abrir três camadas, conferir ordem).

**ADR-F4-1 (estratégia decidida pelo dono em 2026-10-20: híbrido)**: container `.shy-overlay-container` sob demanda com backdrop (modelo CDK) + top layer quando disponível + `z()` como fallback (plano 7.5, item 3). Falta só detalhar a API pública do `OverlayService` no plano da sessão; se a API tiver alternativas de alto impacto, comparar e esperar resposta antes de executar.

**Gate**: Esc/foco/scroll lock testados; sem dependências; Popover API stubada nos testes (ver `test-setup.ts`).

**Commit proposto**: `feat(ui): núcleo de overlay (posicionamento, foco e camadas)`

---

## F4-S2: Dialog + Drawer

**Escopo**: `Dialog` (`shy-dialog`/`DialogService.open`) com `role="dialog"` ou `alertdialog`, `aria-modal`, `aria-labelledby`, trap de foco, scroll lock; `Drawer` (lados start|end|top|bottom). Tokens `--shy-dialog-*`/`--shy-drawer-*`, scrim com `scrim-panel`, animação por token com reduced-motion.

**Gate**: teclado (Esc, Tab cíclico, foco inicial e retorno); contraste do texto sobre scrim; mobile (largura total, safe-area por token, sem `env()` em unidade fora da regra: usar só o necessário e documentar como exceção se surgir).

**Commit proposto**: `feat(ui): dialog e drawer`

---

## F4-S3: Popover + Tooltip + Menu

**Escopo**: `Popover` (`shyPopover`, não modal, `aria-expanded`/`aria-controls`); `Tooltip` (`shyTooltip`, `role="tooltip"`, `aria-describedby`, abre em hover/foco, atraso por token, não é o único acesso à informação); `Menu` (`shyMenu`, `role="menu"`/`menuitem`, setas, Home/End, typeahead, submenus opcionais). Todos usam `computePosition` e `OverlayService`.

**Gate**: teclado conforme APG (menu button); tooltip some com Esc e permanece ao passar o ponteiro (WCAG 1.4.13).

**Commit proposto**: `feat(ui): popover, tooltip e menu`

---

## F4-S4: reescrita do Select

**Escopo**: `shy-select` v2: CVA, listbox APG (`aria-activedescendant` ou foco por item), typeahead, `multiple` opcional, `placeholder`, `invalid`/`disabled`, integração com `FormField`, painel via `OverlayService`. Manter a API antiga marcada `@deprecated` com substituto, `check:ds` falha em uso interno, remoção só na próxima major (regra de depreciação).

**Decisão de alto impacto (ADR-F4-2)**: quebra ou compat da API antiga (`selectOptions`, `onSelectionChange`). Comparar e esperar resposta.

**Gate**: teclado completo, leitor de tela (ARIA testada), testes de CVA (`ngModel`, `formControl`, signals).

**Commit proposto**: `feat(ui)!: select com CVA, typeahead e overlay`

---

## F4-S5: reescrita do Snackbar

**Escopo**: outlet global (`provideShySnackbar`/`<shy-snackbar-outlet>`), fila, `SnackbarService.show(msg, opts)` (intent, ação, duração, posição), pausa em hover/foco, `role="status"` (`alert` para erro), sem depender de `ViewChild`. API antiga depreciada com guia de troca.

**Decisão de alto impacto (ADR-F4-3)**: compatibilidade da API de `SnackbarService.show({element,…})`.

**Gate**: fila e pausa testadas; WCAG 2.2.1 (tempo ajustável); reduced-motion.

**Commit proposto**: `feat(ui)!: snackbar com outlet global e fila`

---

## F4-S6: fechamento da Onda 2

**Escopo**: exemplo integrado no showcase (dialog com formulário e select dentro, tooltip em IconButton, menu), auditoria de foco/camadas, docs (`accessibility.md`, `tokens.md`, `migration-0.0-to-0.1.md` com selects/snackbars), README e relatório consolidado da F4.

**Commit proposto**: `docs: fechar onda 2 (overlays, select e snackbar)`
