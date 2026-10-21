# Progresso do Design System

Arquivo de estado lido pelo comando `/build` (ver CLAUDE.md). Atualizado a cada tarefa concluída.

## Estado atual

- Fase: **F4 Onda 2**, sessão **F4-S3** (Popover, Tooltip, Menu)
- Estado: `aguardando-gate`
- Branch: `feat/design-system`
- Relatório em "F4-S3: relatório do gate" abaixo. Sem decisão de alto impacto pendente. O próximo `/build` aprova o gate, marca a F4-S3 concluída e mostra o plano da F4-S4 (Select v2, com a decisão ADR-F4-2 a responder).

## Fases

| Fase                               | Status                    | Commit                                                        |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------- |
| F0 Preparação                      | concluída (gate aprovado) | 3e647b9, aa431bb, 65d080f, c25ef8d, 979bdf6 (só documentação) |
| F1 Unidades, tokens, temas, fontes | concluída (gate aprovado) | 0123029                                                       |
| F2 Refactor dos existentes         | concluída (gate aprovado) | eb359ac                                                       |
| F3 Onda 1                          | concluída (gate aprovado) | 39c815b, 53e2902, e119878, b410314, 87644db, 0db8496          |
| F4 Onda 2                          | em andamento (6 sessões)  |                                                               |
| F5 Onda 3 + hardening              | pendente (4 sessões)      |                                                               |

## Sessões

| Sessão | Escopo                                                                             | Status    | Commit  |
| ------ | ---------------------------------------------------------------------------------- | --------- | ------- |
| F3-S1  | Utilitários Onda 0 (tipografia, layout, sr-only, animateOut) + Button + IconButton | concluída | 39c815b |
| F3-S2  | Spinner, Skeleton, ProgressCircular, Progress                                      | concluída | 53e2902 |
| F3-S3  | FormField, Input, Textarea                                                         | concluída | e119878 |
| F3-S4  | Checkbox, Radio, Switch                                                            | concluída | b410314 |
| F3-S5  | Badge/Tag, Divider, Card, Alert                                                    | concluída | 87644db |
| F3-S6  | Fechamento da Onda 1                                                               | concluída | 0db8496 |
| F4-S1  | Núcleo de overlay (ADR-F4-1 e ADR-F4-4 decididas)                                  | concluída | 3ac709b |
| F4-S2  | Dialog, Drawer                                                                     | concluída | 95e5ab3 |
| F4-S3  | Popover, Tooltip, Menu                                                             | gate      |         |
| F4-S4  | Select v2 (decisão ADR-F4-2)                                                       | pendente  |         |
| F4-S5  | Snackbar v2 (decisão ADR-F4-3)                                                     | pendente  |         |
| F4-S6  | Fechamento da Onda 2                                                               | pendente  |         |
| F5-S1  | Escolha da Onda 3 + lote 1                                                         | pendente  |         |
| F5-S2  | Lote 2                                                                             | pendente  |         |
| F5-S3  | Lote 3 (sob demanda)                                                               | pendente  |         |
| F5-S4  | Hardening e fechamento                                                             | pendente  |         |

## Registro

- 2026-10-20: F2 aprovada e commitada (`eb359ac`), push em `feat/design-system`. Resíduos da Onda 0 (D-F2-1) ficam na F3-S1.
- 2026-10-20: F3 a F5 divididas em sessões curtas (`docs/design-system/sessions/`), para o dono rodar uma por sessão do Claude.
- 2026-10-20: `/build` aprovou o plano da F3-S1 e a executou. Gate em `aguardando-gate`; relatório abaixo.
- 2026-10-20: `/build` aprovou o plano da F3-S2 e a executou (Spinner, Skeleton, Progress, ProgressCircular, Button com o Spinner). Verificações verdes, commit e push em `feat/design-system`; gate em `aguardando-gate`.
- 2026-10-20: `/build` aprovou o gate da F3-S2 (`53e2902`, já enviado). F3-S3 em `aguardando-plano`.
- 2026-10-20: feedback do dono (não é aprovação): o sistema de z-index/overlay pode se basear no Angular Material/CDK (container fixo em tela cheia + backdrop, só renderizado quando há overlay). Impacta ADR-F0-7 / seção 7.5 do plano e a F4-S1. Decisão de alto impacto: alternativas comparadas na thread, aguardando resposta do dono; nada alterado no plano ainda. Estado segue `aguardando-plano` da F3-S3.
- 2026-10-20: dono escolheu o **híbrido** para o overlay (ADR-F4-1): container sob demanda com backdrop estilo CDK + top layer + `z()` fallback. Aplicado em ADR-F0-7 (emenda), plano 7.5 (item 3) e `sessions/F4-onda-2.md`. Estado segue `aguardando-plano` da F3-S3.
- 2026-10-20: `/build` aprovou o plano da F3-S3 e a executou (Input/Textarea, FormField, showcase, docs). Verificações verdes; gate em `aguardando-gate`.
- 2026-10-20: `/build` aprovou o gate da F3-S3 (`e119878`, já enviado). F3-S4 em `aguardando-plano`.
- 2026-10-20: `/build` aprovou o plano da F3-S4 e a executou (Checkbox, Switch, Radio, showcase, docs). Verificações verdes; gate em `aguardando-gate`.
- 2026-10-20: `/build` aprovou o gate da F3-S4 (`b410314`, já enviado). F3-S5 em `aguardando-plano`.
- 2026-10-21: `/build` aprovou o plano da F3-S5 e a executou (Badge, Divider, Card, Alert, showcase, docs). Verificações verdes; gate em `aguardando-gate`.
- 2026-10-21: `/build` aprovou o gate da F3-S5 (`87644db`, já enviado). F3-S6 em `aguardando-plano`.
- 2026-10-21: `/build` aprovou o plano da F3-S6 e a executou (formulário completo, auditoria no Chromium, 3 correções de a11y, docs). Verificações verdes; gate da F3 em `aguardando-gate`.
- 2026-10-21: `/build` aprovou o gate da F3-S6 e da fase F3 (`0db8496`, já enviado). **F3 concluída.** F4-S1 em `aguardando-plano`, com a ADR-F4-4 (API pública do `OverlayService`) aguardando decisão explícita do dono.
- 2026-10-21: `/build` recebido sem resposta à ADR-F4-4. Conforme a regra do `/build`, não aprova decisão de alto impacto: pergunta refeita ao dono (A, B ou C; recomendação B) e nada executado. Estado segue `aguardando-plano` da F4-S1.
- 2026-10-21: dono escolheu a **opção B** da ADR-F4-4 (`OverlayService.open(componente | TemplateRef, config)` → `ShyOverlayRef<R>`). Registrada em `decisions.md` e `sessions/F4-onda-2.md`. Estado segue `aguardando-plano` da F4-S1, sem pendência: o próximo `/build` executa.

## F4-S3: plano da sessão (2026-10-21)

Fonte: `sessions/F4-onda-2.md` (F4-S3), plano 8, 9.2, 10 (APG) e 12 (Onda 2), ADR-F4-4/F4-5/F4-6. Premissa de base: o `OverlayService` já cuida de camada, posição (`computePosition`), Esc na pilha, clique fora, promoção e foco. Popover, Tooltip e Menu são **diretivas no gatilho** que abrem conteúdo por ele.

### Como fica (resumo)

- **Popover**: `<button [shyPopover]="tpl">` (aceita `TemplateRef` ou componente). Painel não modal na camada `popover`, ancorado no gatilho (`shyPopoverPlacement`, padrão `bottom-start`). Gatilho com `aria-expanded` e `aria-controls`; `aria-haspopup="dialog"`. Abre com foco no primeiro focável (se houver); Esc, clique fora e novo clique no gatilho fecham e **devolvem o foco ao gatilho**. Tab para além do último focável fecha e devolve o foco ao gatilho (o painel mora no fim do `body`, então sem isso o teclado não teria como sair dele na ordem certa). Superfície `shy-popover` (fundo, borda, sombra, padding) para o conteúdo.
- **Tooltip**: `<button shyTooltip="Salvar">`. Abre por hover (depois do atraso) e por `:focus-visible`; `role="tooltip"` e `aria-describedby` no gatilho enquanto aberto. WCAG 1.4.13: **dispensável** (Esc fecha sem mover o foco), **passável** (o ponteiro pode ir do gatilho ao tooltip sem fechar) e **persistente** (fica até perder hover e foco). Fecha ao clicar no gatilho (também evita o tooltip ficar inerte atrás de um modal que o clique abre). Não abre em toque; nunca é o único acesso à informação (documentado).
- **Menu**: `<button [shyMenu]="menu">` + `<ng-template #menu><shy-menu>…<button shyMenuItem>…</button></shy-menu></ng-template>`. Menu button APG: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`; painel `role="menu"` na camada `dropdown`, com `role="menuitem"` nos itens e foco por roving (`tabindex="-1"` e `focus()`): setas (↓ abre no primeiro, ↑ abre no último), Home/End, **typeahead**, Enter/Espaço ativam e fecham, Esc fecha e devolve o foco, Tab fecha. Item `disabled` fica focável com `aria-disabled` (APG) e não ativa. `shy-divider` entre grupos (`role="separator"`). **Sem submenus** nesta sessão (a sessão os chama de opcionais; ver premissas).
- Base interna `OverlayTrigger` (não exportada) para Popover e Menu: abrir/fechar/alternar, `expanded` (signal), id do painel e devolução de foco. O Tooltip é à parte (hover/foco/atraso).

### Tarefas

1. `overlay/overlay-trigger.ts` (base): `open()`, `close()`, `toggle()`, `expanded`, `aria-*` no host, limpeza no `ngOnDestroy`; usa `OverlayService.open` com `anchor` = host.
2. `components/popover/` (`[shyPopover]`, `shy-popover`), `components/tooltip/` (`[shyTooltip]`, painel interno do tooltip), `components/menu/` (`[shyMenu]`, `shy-menu`, `[shyMenuItem]`). Tipos em `types/` (`ShyPlacement` já existe).
3. Atrasos do tooltip em tokens de motion (`--shy-delay-tooltip` 500ms, `--shy-delay-tooltip-hide` 100ms), lidos com `getComputedStyle` (reduced motion não muda atraso; muda só a animação). Entrada por `@starting-style` (fade) e saída por `animateOut`.
4. Tokens de componente (padrão do Alert, com fallback): `--shy-popover-*`, `--shy-tooltip-*` (fundo `scrim-panel`, texto `on-scrim`, par já testado em `contrast-pairs.json`), `--shy-menu-*` (item hover/focus com `primary-soft`, selecionado, desabilitado). Hover só em `@media (hover: hover)`, `:focus-visible` com anel, `forced-colors`, sem literal de cor/unidade/tempo em SCSS.
5. Testes (happy-dom): abrir/fechar/alternar e `aria-*` dos três; foco inicial e devolução; Esc, clique fora e Tab; tooltip por hover com atraso (timers falsos), por foco, Esc, passar o ponteiro para o tooltip, clique fecha, `aria-describedby` só aberto; menu com setas, Home/End, typeahead (reinício por pausa), item desabilitado, Enter/Espaço fecham, Tab fecha, abre por ↓/↑.
6. Showcase: páginas `components/popover`, `components/tooltip`, `components/menu` (placements e flip na borda, tooltip em `IconButton`, popover com formulário, menu com divisor e item desabilitado, tudo dentro de um Dialog para exercitar a ADR-F4-5). Auditoria no Chromium nos 2 temas, 360 e 1366 px, RTL, reduced motion.
7. A11y: `contrast-pairs.json` só se surgir par novo (item hover do menu sobre `surface-raised`); `accessibility.md` com a verificação dos três padrões APG e do 1.4.13.
8. Docs: `src/libs/ui/README.md` e `README.md` (uso, tokens, exports), ADR-F4-7 em `decisions.md`, plano 12 e `sessions/F4-onda-2.md` se algo divergir.
9. Verificações (`check:ds`, testes, `build`, `build:showcase`), relatório do gate e commit `feat(ui): popover, tooltip e menu`.

### Premissas e decisões que valem se não houver objeção

- Sem breaking e sem dependência nova; Popover, Tooltip e Menu são novos. `Select` (F4-S4) vai reaproveitar a base `OverlayTrigger` e o painel de listbox próprio.
- **Submenus ficam fora** (o catálogo diz "opcionais"): são o maior risco de a11y/teclado do Menu (setas laterais, hover intent, foco). Entram depois, se houver demanda, sem quebrar a API (um `shyMenuItem` com `[shyMenu]` aninhado).
- Tooltip não abre em toque (sem hover/foco-visible); quem precisa de texto no toque usa `aria-label`/texto visível ou o Popover.
- Textos padrão em inglês e configuráveis quando houver texto da lib (nenhum previsto nesta sessão).

## F4-S3: relatório do gate (2026-10-21)

### Verificações

| Verificação              | Resultado                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `npm run check:ds`       | ok (6 verificações; 1 aviso antigo de tokens não usados)                                                                 |
| `npm test`               | 206 testes passando (20 novos: Popover, Menu, Tooltip)                                                                   |
| `npm run build`          | ok (`ui` e `utils`)                                                                                                      |
| `npm run build:showcase` | ok                                                                                                                       |
| Chromium (Playwright)    | dark/light, 360 e 1366 px, LTR e RTL, `forced-colors`: foco, ↑/↓, flip na borda, tooltip no foco/hover, dentro de Dialog |
| Node                     | 22 neste ambiente (o projeto pede 24.14.1); nada específico do Node 24                                                   |

Não verificado: leitor de tela, Safari/Firefox, toque real (o Tooltip ignora `pointerType: touch`, testado só por evento sintético).

### Resumo (arquivos principais)

- `overlay/overlay-trigger.ts`: base interna `OverlayTrigger` (abrir/fechar, `aria-expanded`/`aria-controls`, Tab). Não exportada.
- `components/popover/` (`[shyPopover]`, `shy-popover`), `components/menu/` (`[shyMenu]`, `shy-menu`, `shyMenuItem`), `components/tooltip/` (`[shyTooltip]` + conteúdo interno).
- Tokens `--shy-popover-*`, `--shy-menu-*`, `--shy-menu-item-*`, `--shy-tooltip-*` (com fallback no componente) e `--shy-delay-tooltip`/`--shy-delay-tooltip-hide` em `motion.css`.
- Showcase: `components/popover`, `components/menu`, `components/tooltip` (placements, borda, formulário, ícones, tudo dentro de um Dialog).
- Docs: ADR-F4-7, `accessibility.md`, `README.md` e `src/libs/ui/README.md`.

### Efeito prático

O app abre painéis ancorados com `[shyPopover]`, menus com `[shyMenu]` e dicas com `shyTooltip="texto"`, com teclado, foco e ARIA do APG, e funcionam também dentro de um Dialog.

### Decisões e premissas (ADR-F4-7 em `decisions.md`)

1. Diretivas de gatilho sobre uma base interna comum; o painel é componente/`TemplateRef` no `OverlayService`.
2. Tab que sai do painel fecha e segue a partir do gatilho (o painel fica no fim do `body`).
3. Menu sem submenus; itens desabilitados focáveis (`aria-disabled`); o `disabled` estático é removido do elemento nativo (achado nos testes).
4. Tooltip: sem toque, atrasos como tokens (não zerados por `reduced-motion`), só complementa o nome.
5. Sem par de contraste novo, sem dependência nova, sem bump de versão. README atualizado.
6. Divergência do plano: nenhuma além de "sem submenus" (já prevista no plano da sessão).

### Mensagem de commit proposta

`feat(ui): popover, tooltip e menu`

Corpo: diretivas `[shyPopover]`, `[shyMenu]` e `[shyTooltip]` sobre o `OverlayService`, com foco, teclado e ARIA do APG; tokens de atraso do tooltip; páginas no showcase.

## F4-S2: relatório do gate (2026-10-21)

### Verificações

| Verificação              | Resultado                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`       | ok (6 verificações; 1 aviso antigo de tokens não usados)                                                      |
| `npm test`               | 186 testes passando (16 novos: Dialog, Drawer, serviços, confirm/alert, TemplateRef)                          |
| `npm run build`          | ok (`ui` e `utils`); `drawer.css` sai em `dist/ui/styles`                                                     |
| `npm run build:showcase` | ok                                                                                                            |
| Chromium (Playwright)    | dark/light, 900×700 e 360×800, LTR e RTL, `reduced-motion` e `forced-colors` (detalhes em `accessibility.md`) |
| Node                     | 22 neste ambiente (o projeto pede 24.14.1); nada específico do Node 24                                        |

Não verificado: leitor de tela, Safari/Firefox, aparelho com notch (`safe-area`). Fontes web: nenhuma fonte externa nova nesta sessão (só a Baseline já registrada na ADR-F4-5).

### Resumo (arquivos principais)

- `components/dialog/` (`shy-dialog`, base interna `DialogSurface`, `PromptDialogComponent` interno) e `components/drawer/` (`shy-drawer`).
- `services/dialog/dialog.service.ts` (`open`, `confirm`, `alert`) e `services/drawer/drawer.service.ts` (`open`, `side`).
- `styles/drawer.css` (painel do Drawer por lado, entrada por `@starting-style`, RTL, `forced-colors`), importado em `index.css` e `_global.scss`.
- Tipos e interfaces: `types/dialog`, `interfaces/dialog`. Tokens `--shy-dialog-*` e `--shy-drawer-*` (com fallback, no padrão do Alert).
- Showcase: `components/dialog` (4 tamanhos, formulário, popover dentro do dialog, dialog sobre dialog, confirm, alert) e `components/drawer` (4 lados, corpo longo). Docs: `src/libs/ui/README.md`, `README.md`, ADR-F4-6, plano 12, `accessibility.md`.

### Efeito prático

O app abre diálogos com `DialogService.open(MeuComponente)` (ou `confirm()`/`alert()` em uma linha) e painéis laterais com `DrawerService.open`, recebendo o resultado por `await ref.closed`. Título, foco, Esc, scroll lock e devolução de foco vêm prontos; o popover ou select aberto dentro do dialog continua clicável.

### Decisões e premissas (ADR-F4-6 em `decisions.md`)

1. Dialog não fecha por clique no fundo (evita perder formulário); Drawer fecha. Ambos configuráveis. `confirm()`/`alert()` nunca fecham por clique fora.
2. `aria-labelledby`/`aria-describedby` ligados achando o painel pelo DOM, o que cobre também `TemplateRef` (onde o `ShyOverlayRef` não é injetável); no template, fechar é por `(dismissed)="ref.close()"`.
3. Sem `dialog.css` (o Dialog se dimensiona sozinho); só `drawer.css`. Divergência do plano, registrada.
4. Drawer com 4 lados (o plano listava 3). Achado na auditoria: o componente do app entre o painel e o `<shy-drawer>` impedia a rolagem; corrigido com `dialog.shy-drawer-pane > *` em flex.
5. Sem `env(safe-area-inset-*)` nem pares novos em `contrast-pairs.json` (os do painel já existiam). Reavaliar safe-area em aparelho real.
6. Efeito do scroll lock (`scrollbar-gutter: stable`): o `full` fica alguns px mais estreito que a tela em navegador com barra de rolagem clássica.
7. Sem dependência nova. README atualizado (`README.md` e `src/libs/ui/README.md`). Sem bump de versão.
8. **Para a F4-S3/S4:** o Select dentro do Dialog depende da regra da ADR-F4-5 (painel com `anchor` dentro do modal vira filho dele); já testada aqui com um popover.

### Mensagem de commit

Já commitada (`95e5ab3`): `feat(ui): dialog e drawer`.

## F4-S2: plano da sessão (2026-10-21)

Fonte: `sessions/F4-onda-2.md` (F4-S2), plano 11.2 e 12 (Onda 2), ADR-F4-4/F4-5. Premissa de base: o `OverlayService` já entrega `<dialog>`, foco, Esc, scroll lock e saída animada; Dialog e Drawer são a **superfície** (visual, título, ações, ARIA) e uma camada fina de abertura.

### Como fica (resumo)

- **Superfície** `shy-dialog` e `shy-drawer`: o conteúdo aberto pelo serviço renderiza `<shy-dialog heading="…">…</shy-dialog>`. Ele desenha o painel (fundo `surface-raised`, borda, raio, sombra, foco, `forced-colors`), liga `aria-labelledby`/`aria-describedby` ao `<dialog>` pai e traz o botão de fechar (`closeLabel`, padrão "Close"). Slots: cabeçalho (`heading` ou projetado), corpo e `slot="footer"` com as ações.
- **Abertura**: `DialogService.open(ComponenteOuTemplate, config)` e `DrawerService.open(…)` = `OverlayService.open` com defaults (camada `modal`/`drawer`, `role`, `closeOnOutsideClick`, classe de tamanho/lado). Devolvem o mesmo `ShyOverlayRef<R>`; sem API nova de ref.
- **Prontos**: `DialogService.confirm({ title, message, confirmLabel, cancelLabel, intent })` → `Promise<boolean>` e `DialogService.alert({ title, message, okLabel })` → `Promise<void>`, em `role="alertdialog"` com foco inicial no botão seguro (cancelar/OK) e sem fechar por clique fora.
- **Tamanhos do Dialog**: `sm`, `md` (padrão), `lg`, `full`. **Lados do Drawer**: `start`, `end`, `top`, `bottom` (a sessão lista 4 e o plano 3; vale a sessão, mais completa). Em telas estreitas o Dialog ocupa a largura toda e o Drawer `bottom` vira sheet.
- A posição do painel vem de CSS global da lib (`styles/dialog.css`, `styles/drawer.css`, importados em `index.css`/`_global.scss`), por classe no `paneClass`, já que o painel fica fora do componente (encapsulamento de estilo).

### Tarefas

1. `types/dialog/dialog.type.ts` (`ShyDialogSize`, `ShyDrawerSide`) e `interfaces/dialog/dialog.interface.ts` (`ShyDialogConfig`, `ShyConfirmOptions`, `ShyAlertOptions`, `ShyDrawerConfig`).
2. `components/dialog/dialog.component.*` (`shy-dialog`): `heading`, `dismissible`, `closeLabel`, slots; IDs únicos por contador; o botão de fechar chama `ShyOverlayRef.close()` quando há ref (opcional via `inject(ShyOverlayRef, { optional: true })`), senão emite `closed`.
3. `components/drawer/drawer.component.*` (`shy-drawer`): mesma estrutura, com `side`.
4. `services/dialog/dialog.service.ts` (`open`, `confirm`, `alert`) e `services/drawer/drawer.service.ts` (`open`). `confirm`/`alert` usam um componente interno (`ShyConfirmDialog`) não exportado.
5. `styles/dialog.css` e `styles/drawer.css`: tamanho, posição, entrada (`@starting-style`: `shy-scale-in` no dialog, slide por lado no drawer, via `--shy-motion-distance`), saída por `data-state="closing"`, mobile, `forced-colors`. Só tokens e `ru()`. Tokens novos: `--shy-dialog-width-{sm,md,lg}`, `--shy-dialog-padding`, `--shy-dialog-radius`, `--shy-dialog-bg`, `--shy-dialog-shadow`, `--shy-drawer-width`, `--shy-drawer-height`, mais o padrão de 3 camadas (componente → semântico → primitivo).
6. **Safe-area**: avaliar `env(safe-area-inset-*)` para o Drawer `bottom`/Dialog `full`. É unidade de comprimento fora do `calc(ru)`: se for necessário, vira exceção documentada (sessão prevê), com `check-units` ajustado e registro no plano 6.4. Se o layout do showcase dispensar, não entra.
7. Testes (happy-dom): abre/fecha por serviço, título liga `aria-labelledby`, `confirm`/`alert` (resultado, foco inicial no botão seguro, Esc = `false`/`undefined`), tamanhos e lados por classe, `dismissible: false` oculta o X, Esc e foco devolvido.
8. Showcase: páginas `components/dialog` e `components/drawer` (tamanhos, lados, confirm/alert, formulário dentro, dialog sobre dialog, popover sobre dialog para exercitar a ADR-F4-5); nav e rotas. Auditoria no Chromium nos 2 temas, 360 e 1366 px.
9. A11y: `contrast-pairs.json` com os pares do painel (texto/`surface-raised`, borda do painel, foco) nos 2 temas; `check:ds` falha se regredir; `accessibility.md`.
10. Docs: `src/libs/ui/README.md` e `README.md` (uso, tokens, exports), ADR-F4-6 em `decisions.md`, plano 12 (Drawer: 4 lados), `sessions/F4-onda-2.md` se algo divergir.
11. Verificações (`check:ds`, testes, `build`, `build:showcase`), relatório do gate e commit `feat(ui): dialog e drawer`.

### Premissas e decisões que valem se não houver objeção

- Sem breaking: Dialog e Drawer são novos; nada existente muda. Sem dependência nova.
- `confirm`/`alert` ficam no `DialogService` (não em serviço à parte) e não exportam o componente interno.
- O Dialog não trava o `closeOnOutsideClick` do serviço: padrão `false` (modal) e `true` só se o app pedir; `alert` sempre `false`.
- Texto padrão em inglês ("Close", "Cancel", "OK", "Confirm"), configurável por input/opção; a lib não traduz (mesmo critério de `Alert`/`Badge`).

## F4-S1: relatório do gate (2026-10-21)

### Verificações

| Verificação                         | Resultado                                                                                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`                  | ok (6 verificações; 1 aviso antigo de tokens não usados)                                                                                                 |
| `npm test`                          | 170 testes passando (56 novos: posição 13, foco 9, serviço 34)                                                                                           |
| `npm run build`                     | ok (`ui` e `utils`); `overlay.css` sai em `dist/ui/styles`                                                                                               |
| `npm run build:showcase`            | ok                                                                                                                                                       |
| Chromium (Playwright, dark e light) | 3 ordens de abertura, Esc um por vez, Tab preso, backdrop, clique fora, container/scroll lock removidos, foco devolvido (detalhes em `accessibility.md`) |
| Node                                | 22.22.0 neste ambiente (o projeto pede 24.14.1, `.nvmrc`); nada específico do Node 24 foi usado                                                          |

Não rodado: leitor de tela, Safari/Firefox, RTL no navegador (só em teste de unidade), CSS Anchor Positioning (fora de escopo). O MDN está bloqueado na rede deste ambiente: o suporte foi confirmado em `web-features` 3.43.0 (ADR-F4-5), com a ressalva registrada lá.

### Resumo (arquivos principais)

- `lib/overlay/overlay.service.ts`: `OverlayService.open(componente | TemplateRef, config)` → `ShyOverlayRef` (ADR-F4-4, opção B). Container sob demanda, `<dialog>` (modal/drawer) e `[popover="manual"]` (resto), promoção por ordem de abertura, Esc só no topo, clique fora, scroll lock, fallback sem top layer, `closeAll`.
- `lib/overlay/overlay-ref.ts` (`ShyOverlayRef`, `SHY_OVERLAY_DATA`), `position.ts` (`computePosition`), `focus-scope.ts` (`FocusScopeDirective` + `focusInitial`, `trapTab`, `restoreFocus`), `layers.ts` (`shyLayer`, `layerRank`).
- `styles/overlay.css` (container, painel, backdrop, `@starting-style`, saída por `data-state="closing"`, scroll lock), tipos e interfaces em `types/overlay` e `interfaces/overlay`.
- Showcase `foundations/layers`: botões para abrir modal, popover e toast em 3 ordens, com a ordem de abertura ao vivo.
- Docs: `src/libs/ui/README.md` e `README.md` (API e exports), ADR-F4-5, plano 7.5/11.2, `accessibility.md`.

### Efeito prático

O app (e os componentes da F4-S2 a S5) abre qualquer componente ou template em camada com uma chamada e recebe o resultado por `await ref.closed`. Toast e popover abertos antes de um modal continuam por cima dele; Esc fecha um por vez; foco e scroll são tratados pelo serviço.

### Decisões e premissas (ADR-F4-5 em `decisions.md`)

1. Painel ancorado dentro de um modal vira filho do `<dialog>` e fecha com ele. Motivo: `showModal()` deixa inerte tudo fora dele, inclusive popover do top layer (confirmado no Chromium). Sem isso, Select dentro de Dialog não recebe clique.
2. **Limitação a decidir antes da F4-S5 (alto impacto, Snackbar):** toast/tooltip abertos antes de um modal ficam visíveis, mas inertes até ele fechar; um toast com ação sobre um modal não é clicável. Alternativas para o Snackbar v2: (a) ação só quando não há modal (recomendada: simples e previsível), (b) toast espera o modal fechar, (c) toast vira filho do dialog e some com ele. Entra na ADR-F4-3 na F4-S5; **não precisa de resposta agora**.
3. `computePosition` em px, serviço converte de/para ru com sonda de `--shy-responsive-unit` (mantém a regra de unidades); `left`/`top` físicos porque vêm de `getBoundingClientRect`.
4. Esc em fase de bolha (conteúdo pode consumir antes), `cancel` nativo sempre cancelado; clique fora só na camada do topo, âncora nunca conta como fora.
5. Scroll lock via `data-shy-scroll-lock` (`overflow: hidden` + `scrollbar-gutter: stable`); em página sem barra de rolagem o `stable` reserva uma faixa em navegadores com barra clássica.
6. Estilos de posição do painel com `:where()` (especificidade 0); o painel é transparente, e o visual (fundo, borda, foco, `forced-colors`) é do conteúdo.
7. Sem dependência nova (nem dev). `happy-dom` já tinha `showModal`/`close`; os stubs de popover do `test-setup.ts` bastaram.
8. README: atualizado (`README.md` e `src/libs/ui/README.md`). Sem bump de versão.

### Mensagem de commit

Já commitada (`3ac709b`): `feat(ui): núcleo de overlay (posicionamento, foco e camadas)`.

## F4-S1: plano da sessão (2026-10-21)

Fonte: `sessions/F4-onda-2.md` (F4-S1), plano 7.5 (itens 1 a 3), 9.4, 11.2 e ADR-F0-7 com a emenda ADR-F4-1 (híbrido, já decidido).

### ADR-F4-4, API pública do `OverlayService` (decidida: B, dono em 2026-10-21)

| Opção                                    | O que exporta                                                                                                                                                          | Prós                                                                                                                                                  | Contras                                                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **A. Baixo nível (elemento)**            | `OverlayService.attach(pane: HTMLElement, config)` → `ShyOverlayRef`; quem chama cria e renderiza o conteúdo                                                           | API menor; serviço não conhece Angular (`createComponent`)                                                                                            | Dialog, Popover, Menu, Select e Snackbar repetem a renderização dinâmica; o app não consegue abrir um componente sem boilerplate |
| **B. Componente/template (recomendada)** | `OverlayService.open(componentOuTemplate, config)` → `ShyOverlayRef<R>` com `close(result)`, `closed: Promise<R \| undefined>`, `updatePosition()`; `SHY_OVERLAY_DATA` | É o que o plano 11.2 já descreve; Dialog/Snackbar/Popover/Select viram camadas finas; app consegue overlays próprios; modelo conhecido (CDK/Material) | Mais superfície pública para manter; o serviço cuida de `createComponent`/`appRef.attachView`                                    |
| **C. Interno**                           | Nada público na F4-S1 (`ɵOverlayService`); o consumidor só usa Dialog, Popover, Menu etc.                                                                              | Zero compromisso de API agora                                                                                                                         | App não cria overlay próprio; se exportar depois, vira breaking de qualquer forma                                                |

**Recomendação: B.** Motivo: todos os overlays da F4 (S2 a S5) abrem um componente ou um `TemplateRef`; centralizar isso evita cinco cópias da mesma lógica de render/destroy, e o próprio plano (11.2) já previa `ref.close(result)`. Em 0.x a superfície pode ser ajustada com depreciação.

Esboço da API na opção B (nomes seguem o padrão do repo: serviço sem prefixo, tipos `Shy*`):

```ts
const ref = inject(OverlayService).open<MyComp, Data, Result>(MyComp /* ou TemplateRef */, {
    layer: 'modal', // 'dropdown' | 'drawer' | 'modal' | 'popover' | 'tooltip' | 'toast'
    modal: true, // default: true em modal/drawer. Backdrop, trap de foco, inert no fundo e scroll lock
    anchor: buttonEl, // opcional: posiciona com computePosition
    position: { placement: 'bottom-start', offset: 2 /* em ru */, flip: true, shift: true, matchWidth: false },
    closeOnEscape: true, // Esc fecha só a camada do topo
    closeOnOutsideClick: true, // default: true fora de modal
    restoreFocus: true,
    initialFocus: 'first', // 'first' | 'pane' | 'none' | HTMLElement
    data: { id: 1 }, // inject(SHY_OVERLAY_DATA) no conteúdo
    injector, // opcional
    paneClass: 'my-pane',
});
await ref.close(result); // animateOut e depois remove; resolve ref.closed
const result = await ref.closed;
```

Dentro do conteúdo: `inject(ShyOverlayRef)`. Sem RxJS na API (Promise + `signal` `isOpen`), para não amarrar o consumidor a Observable.

### Tarefas (opção B)

1. **Confirmar suporte** de `<dialog>`/`showModal()`, Popover API (`popover="manual"`), `inert` e `@starting-style` no MDN, com data; registrar no relatório e em `decisions.md`.
2. **`computePosition`** (`lib/overlay/position.ts`): TS puro sobre `DOMRect` (sem DOM de tamanho; guarda SSR), `placement` (12 posições, lógicas `start/end` com RTL), `offset` em ru (via `ru()`), `flip`, `shift`, `matchWidth`, viewport por `visualViewport`. Testes de unidade de flip/shift com rects falsos.
3. **`ShyFocusScope`** (`[shyFocusScope]` + funções usadas pelo serviço): guarda o foco anterior, foco inicial, Tab cíclico quando `trap`, devolve o foco ao fechar. Em `<dialog>` modal o `inert` é nativo; no fallback aplica `inert` nos irmãos do container.
4. **`OverlayService`** (`lib/overlay/overlay.service.ts`), conforme a opção escolhida: container `.shy-overlay-container` sob demanda (cria no 1º, remove no último); painel `<dialog>` para `modal`/`drawer` e `[popover="manual"]` para o resto; fallback `position: fixed` + `z()` sem top layer; pilha por abertura com **promoção** (`data-promoting`, sem animação) de popover/tooltip/toast acima de um modal novo; Esc só no topo; clique fora configurável; scroll lock (`overflow: hidden` no `html` + compensação da barra via `scrollbar-gutter`, sem px); `animateOut` na saída; `DestroyRef` limpa tudo.
5. **Estilos** (`styles/overlay.css` ou SCSS do serviço): container, painel, backdrop (`--shy-color-scrim`), entrada com `@starting-style`, saída por `data-state="closing"`, reduced-motion e `forced-colors`. Só tokens e `ru()`.
6. **Testes** (happy-dom com os stubs de `test-setup.ts`, ampliados para `showModal`/`close` se faltarem): ordem da pilha e promoção, Esc só no topo, clique fora, foco inicial e retorno, trap de Tab, scroll lock aplicado e removido, container criado e removido, `closed` resolvendo com o resultado.
7. **Showcase** `foundations/layers`: abrir três camadas (modal, popover, toast) em ordens diferentes e mostrar a ordem; conferir no Chromium nos dois temas.
8. **Docs**: `src/libs/ui/README.md` (API do overlay), README raiz se mudar uso, `decisions.md` (ADR-F4-4), plano 11.2 se a API final divergir.
9. Verificações (`check:ds`, testes, `build`, `build:showcase`), relatório do gate e commit `feat(ui): núcleo de overlay (posicionamento, foco e camadas)`.

### Premissas

- Sem dependência nova (runtime ou dev). Os stubs de `showModal` entram em `test-setup.ts` se o happy-dom não tiver.
- `OverlayService` `providedIn: 'root'`, sem `provideShyOverlay()` obrigatório.
- Os componentes (Dialog, Popover etc.) ficam para a F4-S2+; a F4-S1 entrega só o núcleo e a página de camadas.

## F3-S6: relatório do gate e fechamento da F3 (2026-10-21)

### Verificações

| Verificação               | Resultado                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`        | verde (6 verificações); aviso de 27 tokens não usados **sem órfão novo**: 26 primitivos/atalhos da F1 (escalas 100/300/500/900, `gradient-brand`, `transition-*`, `tracking-normal`, `dynamic-*-unit`) e o `--shy-button-radius` do exemplo de override do showcase |
| `check-contrast`          | 56 pares × 2 temas; todos os pares usados pela Onda 1 estão cobertos (lista em `tokens.md`). Os de fora são decorativos (`border`, `line`, `track` contra a página)                                                                                                 |
| `npm test`                | verde: 21 arquivos, 114 testes (sem teste novo: as correções são de CSS `:has()`/`forced-colors`, que o happy-dom não calcula; conferidas no Chromium)                                                                                                              |
| `npm run build`           | verde (`ui` e `utils`)                                                                                                                                                                                                                                              |
| `npm run build:showcase`  | verde                                                                                                                                                                                                                                                               |
| Contraste em runtime      | Chromium 141 sobre o build: todo texto visível de 16 páginas (15 componentes + `examples/form`) × dark/light × 1366/360 px: nenhum par abaixo de 4,5:1 (3:1 texto grande); sem erro de console; sem scroll horizontal                                               |
| Teclado (`examples/form`) | ordem de Tab = ordem visual (10 paradas), anel `solid` 2 px em todas nos dois temas; seta no radio seleciona; Espaço no checkbox e no switch; Enter envia                                                                                                           |
| Envio inválido / válido   | alerta `status` "Fix 4 field(s)", `aria-invalid` nos 4 campos, foco no primeiro inválido (no radio group, o primeiro radio); válido: `aria-busy` com foco mantido, progress `aria-valuenow=4`, alerta de sucesso                                                    |
| Foco nos demais           | remover do Badge, fechar do Alert, cartão-link, Button e IconButton: `solid` 2 px                                                                                                                                                                                   |
| Reduced motion            | spinner do botão só pulsa (`shy-pulse`)                                                                                                                                                                                                                             |
| forced-colors (emulação)  | formulário e 11 páginas capturados; radio marcado e ponto do badge agora visíveis                                                                                                                                                                                   |
| Ambiente                  | Node 22.22.0 e npm 10.9.4 (repo pede 24.14.1 / 11.11.0); `npm ci` funcionou                                                                                                                                                                                         |

Achados corrigidos nesta sessão (ADR-F3-6):

1. **Contorno do controle marcado no tema escuro**: Checkbox, Radio e Switch marcados tinham a borda em `primary` (2,6:1 sobre `bg`, 2,1:1 sobre `surface-raised`), abaixo de 3:1 (WCAG 1.4.11). Agora a borda usa `--shy-*-checked-border` (padrão `primary-text`). No claro nada muda.
2. **Campo inteiro apagado por uma opção desabilitada**: `.field:has(:disabled)` no `shy-form-field` pegava um `shy-radio` desabilitado dentro do grupo. Agora só o controle direto do campo conta.
3. **Ponto invisível em `forced-colors`**: o radio marcado e o `dot` do badge usavam `background: currentColor`, que o alto contraste troca por `Canvas`.

Não verificado: leitor de tela real; Windows em alto contraste real; RTL; zoom 200% (limite conhecido em `accessibility.md`); ponteiro grosso em dispositivo real.

### Resumo da F3 (Onda 1)

| Sessão | Entregou                                                                                      | Commit  |
| ------ | --------------------------------------------------------------------------------------------- | ------- |
| F3-S1  | tipografia, layout, `.shy-sr-only`, `animateOut`, Button, IconButton                          | 39c815b |
| F3-S2  | Spinner (8 variantes), Skeleton, Progress, ProgressCircular                                   | 53e2902 |
| F3-S3  | FormField, Input, Textarea                                                                    | e119878 |
| F3-S4  | Checkbox, Radio/RadioGroup, Switch                                                            | b410314 |
| F3-S5  | Badge, Divider, Card, Alert                                                                   | 87644db |
| F3-S6  | `examples/form`, auditoria a11y, 3 correções, matriz da Onda 1, tokens de componente nos docs | 0db8496 |

16 componentes novos na Onda 1, 114 testes, zero dependência de runtime nova, nenhuma devDependency nova. Sem bump, tag ou publish.

### Arquivos principais (F3-S6)

- Showcase: `src/apps/app/examples/form/` (novo), rota e grupo "Examples" no menu (`app.routes.ts`, `app.ts`).
- Lib: `checkbox`, `radio`, `switch` (`.scss`: `checked-border`), `radio` e `badge` (`.scss`: `forced-colors`), `form-field` (`.scss`: seletor de desabilitado).
- Docs: `tokens.md` (tokens de componente e pares da Onda 1; contagem 52 → 56 corrigida), `accessibility.md` (matriz da Onda 1 e resultado da auditoria), `decisions.md` (ADR-F3-6), `README.md` (exemplo de formulário), `src/libs/ui/README.md` (token `checked-border`).

### Efeito prático

- Controles marcados com contorno visível no escuro; formulário com radio desabilitado não parece desabilitado; radio e badge com ponto legíveis em alto contraste.
- Tokens novos e opcionais: `--shy-{checkbox,radio,switch}-checked-border`. Nenhuma API removida ou renomeada.

### Decisões e premissas

- Mover o foco para o primeiro campo inválido fica no app (mostrado no exemplo), não no `shy-form-field`: depende do fluxo da página. Se quiser isso embutido na lib, é mudança de API para a F4/F5.
- Tipo do commit: o arquivo da sessão propunha `docs:`, mas a sessão mudou CSS da lib que o consumidor vê; usei `fix(ui):` para o changelog refletir isso.
- A sessão pedia "screenshot dos componentes nos dois temas": foram capturados (dark/light, forced-colors), mas não versionados no repo (binários sem uso na lib); ficam como evidência deste relatório.

### Mensagem de commit

```
fix(ui): fechar onda 1 (formulário completo, a11y e tokens)

- showcase: examples/form com todos os controles da Onda 1 no shy-form-field
- fix: borda do checkbox/radio/switch marcados em primary-text (3:1 no tema escuro)
- fix: shy-form-field só apaga rótulo/dica quando o próprio controle está desabilitado
- fix: ponto do radio e do badge visível em forced-colors
- docs: tokens de componente e pares da Onda 1, matriz de a11y, ADR-F3-6, README
```

## F3-S5: relatório do gate (2026-10-21)

### Verificações

| Verificação              | Resultado                                                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`       | verde (6 verificações); mesmo aviso de 27 tokens ainda não usados; 56 pares de contraste (nenhum novo: os pares `*-soft`/`on-*-soft`/`*-text` e `on-*`/`*` já cobriam Badge e Alert)                          |
| `npm test`               | verde: 21 arquivos, 114 testes (novos: `badge` 4, `divider` 1, `card` 3, `alert` 5)                                                                                                                           |
| `npm run build`          | verde (`ui` e `utils`)                                                                                                                                                                                        |
| `npm run build:showcase` | verde                                                                                                                                                                                                         |
| Papéis do Alert          | Chromium: `status` nos 4 alertas padrão e `alert` no danger com `urgent`; jsdom: `urgent` só vira `alert` em warning/danger, info/success continuam `status`; ícone diferente por intenção (4 SVGs distintos) |
| Dismiss e remover        | botão de fechar do Alert (nome "Dismiss error") oculta e emite `dismissed`; remover do Badge tem `aria-label` e remove o item (3 para 2 tags no Chromium); alvo do remover ≈ 30 px (ícone 15 px + `::before`) |
| Card interativo          | `a`/`button[shyCard]`: foco `solid` 2 px; botão-cartão dispara por Espaço e Enter (2 cliques no Chromium); `disabled` nativo; `shy-card` sem `tabindex`                                                       |
| Temas e viewports        | badge, divider, card e alert em dark e light, 1366 e 360 px: sem erro de console, sem scroll horizontal                                                                                                       |
| forced-colors (emulação) | bordas `CanvasText`/`LinkText`, badge sólido em `Highlight`/`HighlightText`, ícone do Alert em `CanvasText`; capturado mas não inspecionado em detalhe: conferir no Windows                                   |
| Ambiente                 | Node 22.22.0 e npm 10.9.4 (repo pede 24.14.1 / 11.11.0); `npm ci` funcionou                                                                                                                                   |

Achados corrigidos durante a sessão: o atributo `title` no `shy-alert` virava tooltip e nome acessível do host (agora o input é `heading`); `1lh` é proibido pelo `check-units`; páginas do showcase com estado em campo comum não re-renderizam em zoneless (viraram `signal`).

Não verificado: leitor de tela real (NVDA/VoiceOver); Windows em alto contraste real; RTL; ponteiro grosso com dispositivo real.

### Arquivos principais

- `lib/components/badge/`, `divider/`, `card/`, `alert/` (`.ts`, `.html`, `.scss`, specs; divider sem `.html`) e `lib/types/{badge,divider,card,alert}/`; exports em `components/index.ts` e `types/index.ts`.
- Showcase: `components/{badge,divider,card,alert}`, rotas e menu.
- Docs: `README.md` raiz, `src/libs/ui/README.md` (API, tokens, exports), `decisions.md` (ADR-F3-5), `accessibility.md`.

### Efeito prático

- `<shy-badge>` (intent × soft/solid/outline, `count`, `dot`, `removable`), `<shy-divider>`, `<shy-card>` e cartões interativos `a[shyCard]`/`button[shyCard]`, `<shy-alert>` com ícone por intenção, `urgent`, ação e `dismissible`.
- Nenhuma API existente mudou. Sem dependência nova, bump, tag ou publish.

### Decisões e premissas (ADR-F3-5 em `decisions.md`)

- Card interativo é o elemento nativo (`a`/`button`), não um input `interactive` num `div`; Alert usa `heading` (não `title`) e `urgent` default `false`; `dismissible` se oculta sozinho e o foco depois é do app; mixins de cor do Button reaproveitados; texto padrão do botão de remover/fechar em inglês, sobrescrevível.
- O arquivo da sessão dizia "`interactive` vira link/botão": o resultado é o mesmo, pelo elemento nativo.

### Mensagem de commit

```
feat(ui): badge, divider, card e alert

- shy-badge: intent, soft/solid/outline, count, dot e removable com botão nomeado
- shy-divider: role="separator", horizontal/vertical, texto opcional
- shy-card e a/button[shyCard]: slots header/footer, elevation 0 a 3, interativo pelo elemento nativo
- shy-alert: ícone por intenção, heading, ação, urgent (role="alert") e dismissible
- tokens --shy-badge-*, --shy-card-*, --shy-alert-* e --shy-divider-*
- showcase: components/badge, divider, card e alert; README e ADR-F3-5
```

## F3-S4: relatório do gate (2026-10-20)

### Verificações

| Verificação              | Resultado                                                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`       | verde (6 verificações); mesmo aviso de 27 tokens ainda não usados; 57 pares de contraste (2 novos)                                                                                                                                            |
| `npm test`               | verde: 17 arquivos, 101 testes (novos: `checkbox` 7, `switch` 2, `radio-group` 7)                                                                                                                                                             |
| `npm run build`          | verde (`ui` e `utils`)                                                                                                                                                                                                                        |
| `npm run build:showcase` | verde                                                                                                                                                                                                                                         |
| Teclado (Chromium)       | Espaço marca o checkbox e o switch; no radio, setas movem **e selecionam** (↓ de Free vai a Pro; o próximo ↓ pula o desabilitado e volta a Free); anel de foco `solid` 2 px na marca                                                          |
| ARIA (Chromium)          | switch: `role=switch`, nome "Label", `checked` na árvore de acessibilidade (sem `aria-checked`); radiogroup com `role` e `aria-label`; jsdom: `aria-describedby`/`aria-invalid`/`aria-errormessage` no form-field, `aria-labelledby` no grupo |
| Erro nos formulários     | checkbox: erro após blur ou `markAllAsTouched`, some ao marcar; radio: erro só quando o foco **sai do grupo** (mover entre radios não conta) ou no submit                                                                                     |
| Alvo de toque            | `.box` do switch com 35,6 px de altura a 1366×768 (≥ `--shy-size-control-sm`; ≥ 24 px)                                                                                                                                                        |
| Temas e viewports        | checkbox, switch e radio em dark e light, 1366 e 360 px: sem erro de console, sem scroll horizontal                                                                                                                                           |
| forced-colors (emulação) | glifo do checkbox continua visível (opacidade 1) quando marcado, borda `ButtonText`, inválido tracejado, marcado do switch em `Highlight`; conferir no Windows                                                                                |
| Ambiente                 | Node 22.22.0 e npm 10.9.4 (repo pede 24.14.1 / 11.11.0); `npm ci` funcionou                                                                                                                                                                   |

Não verificado: leitor de tela real (NVDA/VoiceOver); Windows em alto contraste real; RTL (a regra `:dir(rtl)` do botão do switch foi escrita, não medida); ponteiro grosso com dispositivo real.

### Arquivos principais

- `lib/components/checkbox/`, `switch/`, `radio/` (`radio-group.component.ts`, `radio.component.ts`, `radio.token.ts`, `.html`, `.scss`, specs) e `toggle/` interno (`control-base.ts`, `toggle-base.ts`, `_toggle-theme.scss`, não exportados); `types/radio/radio.type.ts`; exports em `components/index.ts` e `types/index.ts`.
- `form-field`: `labelId` no contexto e `id` no `<label>` (aditivo).
- `scripts/contrast-pairs.json` (+ `text-muted`/`track` 3:1, `on-primary`/`primary` 4,5:1).
- Showcase: `components/{checkbox,switch,radio}` (matriz de estados, select-all com indeterminate, dentro do form-field), rotas e menu.
- Docs: `README.md` raiz, `src/libs/ui/README.md` (API, tokens, exports), `decisions.md` (ADR-F3-4), `accessibility.md`.

### Efeito prático

- `<shy-checkbox>`, `<shy-switch>` e `<shy-radio-group>`/`<shy-radio>` com `[(checked)]`/`[(value)]`, `ngModel`, `formControl` e `formControlName`, estados do contrato e integração com o `shy-form-field` (invalid, hint, erro).
- Nenhuma API existente mudou (só o `labelId` aditivo no contexto do form-field). Sem dependência nova, bump, tag ou publish.

### Decisões e premissas (ADR-F3-4 em `decisions.md`)

- Controles sobre inputs nativos ocultos só visualmente (teclado e leitor de tela do navegador); radio com `name` compartilhado em vez de roving tabindex manual; switch sem `aria-checked`; CVA registrado pelo `NgControl` com base interna `ControlBase<T>`; erro do grupo de radio ao sair do grupo.
- O arquivo da sessão dizia "roving tabindex, setas movem e selecionam" no Radio: o resultado é o mesmo, entregue pelo navegador.

### Mensagem de commit

```
feat(ui): checkbox, radio e switch

- shy-checkbox e shy-switch sobre checkbox nativo: [(checked)], indeterminate, CVA, invalid pelo NgControl
- shy-radio-group e shy-radio sobre radios nativos: setas e roving tabindex do navegador, CVA, aria-labelledby do form-field
- glifo e posição do botão mostram o estado sem depender de cor; forced-colors e alvo de toque ≥ control-sm
- tokens --shy-checkbox-*, --shy-radio-* e --shy-switch-*; labelId no form-field
- showcase: components/checkbox, radio e switch; README e ADR-F3-4
```

## F3-S3: relatório do gate (2026-10-20)

### Verificações

| Verificação              | Resultado                                                                                                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`       | verde (6 verificações); mesmo aviso de 27 tokens ainda não usados; 55 pares de contraste (3 novos)                                                                                                                                                 |
| `npm test`               | verde: 14 arquivos, 85 testes (novos: `form-field` 11, `input` 3)                                                                                                                                                                                  |
| `npm run build`          | verde (`ui` e `utils`)                                                                                                                                                                                                                             |
| `npm run build:showcase` | verde                                                                                                                                                                                                                                              |
| ARIA (jsdom + Chromium)  | `label[for]` = `id` do controle; `aria-describedby` = dica + erro; `aria-invalid`/`aria-errormessage` só inválido; no Chromium a árvore de acessibilidade dá nome "Name", descrição "As on your ID This field is required", `required` e `invalid` |
| Quando o erro aparece    | só com touched/dirty (blur) ou `markAllAsTouched` (submit, sem blur); some ao ficar válido; `invalid` forçado no campo ou no controle (testado)                                                                                                    |
| Foco, prefixo, contador  | anel `solid` na cor `--shy-color-focus`; recuo do texto = altura do campo (45,8 px) com prefixo; contador `3/40` acompanha a digitação                                                                                                             |
| forced-colors (emulação) | borda `FieldText` (branca na emulação) e inválido `dashed`; conferir no Windows em alto contraste                                                                                                                                                  |
| Temas e viewports        | form-field, input e textarea em dark e light, 1366 e 360 px: sem erro de console, sem scroll horizontal                                                                                                                                            |
| Contraste                | `text-muted`, `text-subtle` e `danger-text` sobre `surface-sunken` (4,5:1) e `border-strong` sobre ele (3:1, já existia) nos dois temas                                                                                                            |
| Ambiente                 | Node 22.22.0 e npm 10.9.4 (repo pede 24.14.1 / 11.11.0); `npm ci` funcionou. O lock foi ajustado à mão (só a linha do peer `@angular/forms`) porque o npm 10 remove campos `libc` do lock                                                          |

Não verificado: leitor de tela real (NVDA/VoiceOver); autofill de verdade (o Chromium headless não preenche; a regra `:-webkit-autofill` só foi compilada); Windows em alto contraste.

### Arquivos principais

- `lib/components/input/` (`input.component.{ts,scss,spec.ts}`, `_input-theme.scss` com os tamanhos) e `lib/components/form-field/` (`.ts`, `.html`, `.scss`, `form-field.token.ts`, spec); `types/input/input.type.ts`; exports em `components/index.ts` e `types/index.ts`.
- `scripts/contrast-pairs.json` (+3 pares); `src/libs/ui/package.json` e `package-lock.json` (peer `@angular/forms`).
- Showcase: `components/{form-field,input,textarea}` (formulário reativo, matriz de estados × tamanho, prefixo/sufixo, override de token), rotas e menu.
- Docs: `README.md` raiz, `src/libs/ui/README.md` (API, tokens `--shy-input-*`/`--shy-form-field-*`, exports, requisitos), `decisions.md` (ADR-F3-3), `accessibility.md`.

### Efeito prático

- `<input shyInput>` e `<textarea shyInput>` funcionam com `ngModel`/`formControl`/`formControlName`, em `sm|md|lg`, com `invalid`, `required`, `readonly`, `disabled`.
- `<shy-form-field label hint error counter size>` liga o ARIA sozinho e mostra o erro com ícone e texto; slots `prefix`/`suffix`.
- Nenhuma API existente mudou. Sem bump, tag ou publish. Única dependência nova: peer `@angular/forms` (já usado pelo app).

### Decisões e premissas (ADR-F3-3 em `decisions.md`)

- `@angular/forms` como peer do `ui` (só `NgControl`); componente de template vazio em vez de diretiva com CSS global; tamanho em `shyInput="lg"` (o `size` nativo conflita); caixa no próprio input, com prefixo/sufixo absolutos e recuo por `:has()`; ligação por token `SHY_FORM_FIELD`; erro como string; autofill e forced-colors tratados.
- O arquivo da sessão pedia prefixo/sufixo no Input; eles ficam no `shy-form-field` (precisam de um contêiner), e o Input sozinho não os tem.

### Mensagem de commit

```
feat(ui): form-field, input e textarea

- input[shyInput] e textarea[shyInput]: tamanhos sm/md/lg, invalid pelo NgControl, forced-colors e autofill
- shy-form-field: label, dica, erro com ícone, contador e ARIA (for/id, describedby, invalid, errormessage)
- slots prefix e suffix; token SHY_FORM_FIELD para os próximos controles
- peer @angular/forms; tokens --shy-input-* e --shy-form-field-*
- showcase: components/form-field, input e textarea; README e ADR-F3-3
```

## F3-S2: relatório do gate (2026-10-20)

### Verificações

| Verificação                     | Resultado                                                                                                                                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`              | verde (6 verificações); mesmo aviso de 27 tokens ainda não usados (todos os tokens novos estão em uso)                                                                                                                                  |
| `npm test`                      | verde: 12 arquivos, 71 testes (novos: `spinner` 11, `skeleton` 3, `progress` + `progress-circular` 4; `button` confere o `shy-spinner` decorativo)                                                                                      |
| `npm run build`                 | verde (`ui` e `utils`)                                                                                                                                                                                                                  |
| `npm run build:showcase`        | verde                                                                                                                                                                                                                                   |
| Contraste                       | par novo `primary-text` sobre `track` (≥ 3:1): **4,59:1** no escuro e **5,82:1** no claro                                                                                                                                               |
| Reduced motion (Chromium)       | `prefers-reduced-motion` e `data-motion="reduced"`: as 8 variantes do Spinner, o indeterminado linear (barra cheia) e o circular e o shimmer do Skeleton param de se mover e só rodam `shy-pulse` (2 s); nada interno anima             |
| ARIA                            | `role="progressbar"`, `aria-valuemin/max/now`, indeterminado sem `aria-valuenow`, valor limitado a `[0, max]` (testado); Spinner com `label` = `role="status"`, sem `label` = `aria-hidden`                                             |
| Button loading (Chromium)       | usa o `shy-spinner` (`ring`) do tamanho do ícone (20,3 px = `shy-icon` md a 1366×768); largura igual antes/durante (186,4 px); `aria-busy="true"`                                                                                       |
| Progress determinado (Chromium) | barra de 60% ocupa 0,60 do trilho (translate, sem animar `width`)                                                                                                                                                                       |
| Temas e viewports               | spinner, skeleton, progress e button em dark e light, 1366 e 360 px: sem erro de console, sem scroll horizontal                                                                                                                         |
| forced-colors (emulação)        | pontos/barras do Spinner em `CanvasText`; Progress com borda `CanvasText` e barra `Highlight`; ProgressCircular com trilho `GrayText` e barra `Highlight` (a paleta da emulação do Chromium deixa os dois escuros; conferir no Windows) |
| Ambiente                        | Node 22.22.0 e npm 10.9.4 (repo pede 24.14.1 / 11.11.0); `npm ci` funcionou                                                                                                                                                             |

Não verificado: leitor de tela real (NVDA/VoiceOver) anunciando o `role="status"`; Windows em alto contraste real.

### Arquivos principais

- Tokens: `--shy-duration-loop`, `-loop-slow`, `-breathe` (`motion.css`), `--shy-opacity-track` (`primitives.css`), `--shy-color-track` (`semantic-dark.css`/`semantic-light.css`); keyframes `shy-spinner-dash`, `-dot`, `-bar`, `-ping` (`animations.css`); mixin `reduced-motion` (`_mixins.scss`).
- `lib/components/spinner/`, `skeleton/`, `progress/` (inclui `progress-value.ts`, base interna), `progress-circular/` (`.ts`, `.html`, `.scss`, spec); tipos em `types/{spinner,skeleton,progress}/`; exports em `components/index.ts` e `types/index.ts`.
- Button: `<shy-spinner class="spinner">` no lugar do anel provisório; mixin `spinner` removido de `_button-theme.scss`.
- `scripts/contrast-pairs.json` (+ `primary-text`/`track`).
- Showcase: `components/spinner`, `components/skeleton`, `components/progress`, rotas e menu.
- Docs: `README.md` raiz, `src/libs/ui/README.md` (API, tokens, exports), `decisions.md` (ADR-F3-2), `motion.md`, `tokens.md`, `accessibility.md` (contagem de pares corrigida), `sessions/F3-onda-1.md` (regra de reduced motion alinhada ao plano 12).

### Efeito prático

- `<shy-spinner>` com 8 variantes e 4 tamanhos, cor herdada; `<shy-skeleton>` text/circle/rect; `<shy-progress>` e `<shy-progress-circular>` determinados e indeterminados.
- Button em loading usa o Spinner (`ring`); com reduced motion ele pulsa em vez de ficar parado.
- Sem dependência nova; sem bump, tag ou publish. Nenhuma API existente mudou (só o visual do spinner do botão).

### Decisões e premissas (ADR-F3-2 em `decisions.md`)

- Reduced motion = pulso de opacidade (plano 12), não indicador estático (texto da sessão): o arquivo da sessão foi alinhado.
- Durações de laço próprias que não zeram com reduced motion; token `track` para trilho/skeleton; barra padrão `primary-text`.
- Tamanhos do Spinner/ProgressCircular pela escala de ícones (lg = `ru(16)`); Progress sem `intent` (cor por token, `--shy-progress-bar`).

### Mensagem de commit

```
feat(ui): spinner, skeleton e progress

- shy-spinner: 8 variantes, tamanhos xs a lg, label opcional (role="status")
- shy-skeleton: text/circle/rect, lines, shimmer/still
- shy-progress e shy-progress-circular: role="progressbar", value/max, indeterminado
- reduced motion troca o movimento por pulso de opacidade
- button em loading passa a usar o shy-spinner
- tokens --shy-color-track, --shy-opacity-track e --shy-duration-loop*
- showcase: components/spinner, skeleton e progress; README e ADR-F3-2
```

## F3-S1: relatório do gate (2026-10-20)

### Verificações

| Verificação                                     | Resultado                                                                                                                                                                                |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`                              | verde (6 verificações); 1 aviso de tokens ainda não usados (27; revisão na F5)                                                                                                           |
| `npm test`                                      | verde: 9 arquivos, 53 testes (novos: `animate-out` 6, `button` 10, `icon-button` 3)                                                                                                      |
| `npm run build`                                 | verde (`ui` e `utils`); `typography.css` e `layout.css` saem em `dist/ui/styles/`                                                                                                        |
| `npm run build:showcase`                        | verde                                                                                                                                                                                    |
| Contraste da matriz (Chromium, cor renderizada) | variant × intent de Button e IconButton: mínimo **4,76:1** no escuro (danger sólido) e **6,02:1** no claro (success sólido); par novo `bg`/`text` no `check-contrast` (19,15:1)          |
| Loading (Chromium)                              | largura igual antes/durante (`start` + `loadingText`: 193,4 px; `replace`: 203,1 px); `aria-busy="true"`; foco continua no botão; Enter e Espaço durante o loading não disparam o clique |
| Teclado (Chromium)                              | Espaço no `button` ativa; Espaço no `a[shyButton]` não navega; Enter no `a` navega (com `routerLink`); clique no `a` com `disabled` não navega                                           |
| Estados                                         | `data-shy-state`: state layer 0,08 (hover) e 0,12 (active); anel de foco sólido; disabled com `--shy-opacity-disabled`                                                                   |
| Temas e viewports                               | dark e light em 1366 e 360 px: sem erro de console, sem scroll horizontal; IconButton md = 33 px em 360 (≥ 24 px)                                                                        |
| forced-colors                                   | bordas visíveis (`ButtonText`), state layer desligado, variante `link` sem caixa                                                                                                         |
| Ambiente                                        | Node 22.22.0 e npm 10.9.4 (repo pede 24.14.1 / 11.11.0); `npm ci` funcionou sem o `npx npm@11`                                                                                           |

Não verificado: ponteiro grosso (`pointer: coarse`) com dispositivo real; o token já cresce por CSS (F1) e a página mostra os tamanhos.

### Arquivos principais

- Estilos: `styles/typography.css` (`.shy-display`, `.shy-h1`…`.shy-h6`, `.shy-body-lg`, `.shy-body`, `.shy-small`, `.shy-caption`, `.shy-overline`, `.shy-code`, `.shy-sr-only`), `styles/layout.css` (`.shy-stack`, `.shy-cluster`, `.shy-grid`, `.shy-container`), ambos em `index.css` e `_global.scss`.
- `lib/utils/animate-out.ts` + spec, exportado.
- `lib/components/button/` (`button.component.{ts,html,scss,spec.ts}`, `_button-theme.scss` compartilhado) e `lib/components/icon-button/` (`.ts`, `.scss`, spec).
- Tipos: `types/button/button.type.ts` (`ShyButtonVariant`, `ShyButtonSize`, `ShyButtonLoadingPosition`, `ShyIconButtonVariant`), `types/intent/intent.type.ts` (`ShyIntent`).
- `scripts/contrast-pairs.json` (+ `bg` sobre `text`).
- Showcase: `components/button`, `components/icon-button` (matriz variant × intent, tamanhos, estados, loading ao vivo, link/block, override de token), "Text styles" em `foundations/typography`, "Layout utilities" em `foundations/spacing`, `.demo-box` em `styles.scss`, rotas e menu.
- Docs: `README.md` raiz, `src/libs/ui/README.md` (API, tokens `--shy-button-*`/`--shy-icon-button-*`, classes, exports), `decisions.md` (ADR-F3-1).

### Efeito prático

- `<button shyButton>` / `<a shyButton>` com 5 variantes × 6 intenções × 3 tamanhos, `loading` sem perder o foco nem mudar a largura (`replace`), `loadingText`, `block`, `disabled` também em link.
- `<button shyIconButton label="…">` com nome acessível obrigatório e alvo pelo token de controle.
- Classes utilitárias de texto e layout disponíveis só com o `index.css`.
- `animateOut` pronto para os overlays da F4.
- Sem dependência nova; sem bump, tag ou publish. Nenhuma API existente mudou.

### Decisões e premissas (ADR-F3-1 em `decisions.md`)

- `loadingPosition` padrão `replace`; em `start`/`end` sem ícone na ponta o botão cresce (documentado).
- Ícones nas pontas por `slot="start"`/`slot="end"`; intenção `neutral` = sólido invertido; padding lateral mínimo `space-6`.
- IconButton sem `link` e sem `loading` nesta sessão; spinner provisório parado com reduced motion até a S2.

### Mensagem de commit proposta

```
feat(ui): button, icon-button, tipografia e layout utilitários

- button[shyButton] e a[shyButton]: variant, intent, size, loading (aria-busy, foco mantido), loadingPosition, loadingText, block, disabled
- button[shyIconButton] com label obrigatório (aria-label)
- typography.css e layout.css no index.css e no _global.scss
- animateOut para a saída de dialog/popover
- showcase: components/button, components/icon-button, estilos de texto e layout
- par de contraste bg/text; README e ADR-F3-1
```

## F2: relatório do gate (2026-10-20)

### Verificações

| Verificação                                  | Resultado                                                                                                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`                           | verde com **baselines removidas**: nenhum literal de cor, unidade, tempo, easing, z-index ou font-family em SCSS (lib e showcase); 1 aviso (tokens ainda não usados) |
| `npm test`                                   | verde: 6 arquivos, 34 testes (`icon` 6, `select` 8, `snackbar` 5 + service 1, mais os 14 da F1)                                                                      |
| `npm run build`                              | verde (`ui` e `utils`)                                                                                                                                               |
| `npm run build:showcase`                     | verde                                                                                                                                                                |
| Chromium (showcase buildado, claro e escuro) | sem erro de console; select abre por teclado, foca a opção, Enter seleciona e o foco volta ao trigger; snackbar aparece e é legível nos dois temas                   |

### Arquivos principais

- `icon`: `icon.component.{ts,html,scss}` (`input()`, `name`, `label`, `aria-hidden` por padrão, `--shy-icon-size`, OnPush).
- `select`: `select.component.{ts,html,scss}` (tokens `--shy-select-*`, ARIA de listbox, teclado básico, `z(dropdown)`, hover só com ponteiro fino, foco visível, forced-colors).
- `snackbar`: `snackbar.component.{ts,html,scss}` (tokens `--shy-snackbar-*`, `role="status"`, `z(toast)`, motion por token).
- `styles/_variables.scss` apagado; `scripts/units-baseline.json` e `hardcoded-baseline.json` apagados.
- Showcase: `components/{icon,select,snackbar}` no lugar de `pages/{home,icons}`.
- Testes novos: `icon.component.spec.ts`, `select.component.spec.ts`, `snackbar.component.spec.ts`.
- Docs: `README.md` (raiz e `ui`), `docs/design-system/{migration-0.0-to-0.1,units,tokens,decisions}.md`.

### Efeito prático

- Os três componentes seguem os dois temas e o contrato de tokens; nenhum valor fixo no SCSS.
- Breaking (já previsto no `0.1.0`): `--shyIconSize`, `--shySelect*`, `--shySnackbar*` viram kebab-case (tabela de-para em `migration-0.0-to-0.1.md`); `$color-*` não existem mais.
- Correções de passagem: ícone com nome inexistente agora mostra `question-circle`; ícone reage à mudança do nome projetado.
- Sem dependências novas; sem bump de versão, tag ou publish.

### Decisões e premissas (ADR-F2-1 em `decisions.md`)

- ARIA e teclado básico do select entraram já na fase A (a API não mudou); a reescrita é F4.
- Matriz de estados do select/snackbar limitada aos estados reais da API.
- Catálogo de ícones do showcase limitado a 240 resultados.

### Mensagem de commit proposta

```
refactor(ui): icon, select e snackbar com tokens e remoção de $color-*

- icon: input(), name/label, decorativo por padrão, --shy-icon-size
- select: tokens --shy-select-*, ARIA de listbox e teclado básico
- snackbar: tokens --shy-snackbar-*, role="status", sem transform horizontal
- remove _variables.scss e as baselines do check:ds
- showcase com páginas components/icon, select e snackbar
- testes de icon, select, snackbar e SnackbarService

BREAKING CHANGE: --shyIconSize, --shySelect* e --shySnackbar* renomeados; $color-* removidos
```

## F2: plano (2026-10-20)

Escopo do plano mestre (seções 13 e 16, fase A): `icon` refatorado; `select` e `snackbar` re-skin com tokens (API intacta, nada hardcoded); showcase migrado; README. Entram os resíduos da F1: esvaziar as duas baselines, apagar `_variables.scss` (`$color-*`), tokens camelCase → kebab-case e o `ThemeService`/toggle já feitos.

| #   | Tarefa                                                                                                                                                                                                                                                                                         | Arquivos principais                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| T1  | `shy-icon`: `input()` para `hoverFill`/`hoverFillDelay`, `name` e `label` opcionais, `aria-hidden` por padrão (com `label`: `role="img"` + `aria-label`), OnPush; `1em` vira `--shy-icon-size` (padrão `--shy-size-icon-md`); `--shyIconSize` → `--shy-icon-size`; zera a baseline de unidades | `icon.component.*`                 |
| T2  | `shy-select` (fase A): tokens `--shy-select-*` (mapa da seção 13), cores/estados/motion/z-index por token (`z(dropdown)`), contrato de estados e foco, contraste do hover corrigido, fonte por token                                                                                           | `select.component.*`               |
| T3  | `shy-snackbar` (fase A): `--shy-snackbar-*`, intenção por token, `z(toast)`, motion por token e `reduced-motion`, `role="status"`; remove o `.icon-layer` duplicado                                                                                                                            | `snackbar.component.*`             |
| T4  | Apagar `_variables.scss` e o `forward`; trocar os últimos `$color-*`; `check-units` e `check-hardcoded` com baseline vazia (e arquivos de baseline removidos)                                                                                                                                  | `styles/`, `scripts/`              |
| T5  | Showcase: páginas `home`/`icons` viram `components/icon`, `components/select`, `components/snackbar` com matriz de estados nos dois temas, só tokens                                                                                                                                           | `src/apps/app/**`                  |
| T6  | Testes: `icon`, `select` (teclado, ARIA, estados), `snackbar` e `SnackbarService`                                                                                                                                                                                                              | `*.spec.ts`                        |
| T7  | README (raiz e `ui`): novos tokens de componente, tabela `$color-*` → token final; `migration-0.0-to-0.1.md`                                                                                                                                                                                   | `README.md`, `docs/design-system/` |

Gate da F2: `check:ds` verde com baselines vazias (nenhum literal de cor/unidade/tempo); testes dos três passam; `npm run build` e `npm run build:showcase` verdes; relatório; mensagem de commit; parar. Sem bump (o `0.1.0` só a pedido).

### Decisão pequena (alto impacto não; recomendação vale se não houver resposta)

| #      | Decisão                                                                                                                                                                  | Recomendação                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| D-F2-1 | Resíduos da Onda 0 não feitos na F1: classes de tipografia (`.shy-h1`…), `.shy-sr-only`, layout (`shy-stack`, `shy-cluster`, `shy-grid`, `shy-container`) e `animateOut` | **F3** (junto com os componentes que os usam), para a F2 ficar só no refactor |

## F1: plano (2026-10-20)

Escopo do plano mestre (seção 16): `styles/` (6.2), `units.css` + `ru()` + helper TS, `ThemeService` + toggle, `fonts.css` + arquivos, base/motion/animations, scripts da seção 15, showcase `/foundations/*`. Entram também as decisões já aprovadas: exports `./styles/*` + `_global.scss` (ADR-F0-1), `vitest` + `happy-dom` (ADR-F0-2), camadas `z()` (ADR-F0-7, só tokens e função; a promoção de overlays é da F4) e os tokens da ADR-F0-9. Sem bump de versão (o `0.1.0` é ao fechar a F2).

### Tarefas

| #   | Tarefa                                                                                                                                                                                                                                                           | Arquivos principais                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| T1  | Unidades: `--shy-responsive-unit` e `--shy-dynamic-*` (sem nenhum alias: ADR-F1-4); `ru()` em SCSS; helper `ru(n)` em TS exportado; `_breakpoints.scss` (único lugar com px, em condição de `@media`)                                                            | `styles/tokens/units.css`, `styles/_functions.scss`, `styles/_breakpoints.scss`, `src/lib/utils/ru.ts`            |
| T2  | Tokens: primitivos (7.1), semânticos escuro (padrão) e claro com os tokens novos (`line`, `neutral-soft`, `scrim-panel`), tipografia, espaço/raio/tamanho/borda/foco (7.2–7.3), sombras, `layers.css` + `_layers.scss` (`z()`), `motion.css`, `animations.css`   | `styles/tokens/*.css`, `styles/_layers.scss`, `styles/animations.css`                                             |
| T3  | `base.css` (reset moderno, foco, seleção, scrollbar, forced-colors, `font-family` nunca só `monospace`) e `index.css` (um `@import` por arquivo); `_mixins.scss` (focus-ring, state, motion, visually-hidden) e `_index.scss`; `_global.scss` para Sass          | `styles/base.css`, `styles/index.css`, `styles/_mixins.scss`, `styles/_index.scss`, `styles/_global.scss`         |
| T4  | Fontes self-hosted: `fonts.css` (`font-display: swap`, `unicode-range`) + `woff2` + `OFL.txt` (decisão D-F1-2)                                                                                                                                                   | `src/libs/ui/src/assets/fonts/**`, `styles/fonts.css`                                                             |
| T5  | Empacotamento: `ng-package.json` com assets `.css`/`.woff2`; `package.json` do ui com `exports` `./styles/*`; conferir o pacote buildado com um consumidor simulado (como na F0)                                                                                 | `src/libs/ui/ng-package.json`, `src/libs/ui/package.json`                                                         |
| T6  | `ThemeService` (`dark\|light\|system`, padrão `dark`, `localStorage`, `matchMedia`, `data-theme`, `meta theme-color`, guarda SSR), `provideShyTheme`, `shy-theme-toggle`, script anti-flash documentado                                                          | `src/lib/services/theme/*`, `src/lib/components/theme-toggle/*`, `public-api.ts`                                  |
| T7  | Scripts Node puro: `check-units`, `check-calibration`, `check-tokens`, `check-contrast` (+ `contrast-pairs.json`), `check-hardcoded`, `check-fonts`, `check-ds`; script npm `check:ds`                                                                           | `scripts/*.mjs`, `scripts/contrast-pairs.json`, `package.json` (só `scripts`)                                     |
| T8  | Testes: devDependencies `vitest` (^4) e `happy-dom`; target `test` (`@angular/build:unit-test`) em `ui`; `setupFiles` com stubs da Popover API; testes de `ru()`, `ThemeService` e do toggle; script npm `test`                                                  | `package.json` (devDependencies), `angular.json`, `src/libs/ui/src/test-setup.ts`, `*.spec.ts`                    |
| T9  | Migração dos nomes sem prefixo internos (`$responsive-unit`/`--responsive-unit` → `ru()`/`--shy-responsive-unit`; `$dynamic-*`/`--dynamic-*` → `--shy-dynamic-*`) em select, snackbar e showcase, só o necessário para `check-units` passar; o redesenho é da F2 | `select.component.scss`, `snackbar.component.scss`, `src/apps/styles.scss`, `app.scss`, `home.scss`, `icons.scss` |
| T10 | Showcase: `angular.json > styles` com `index.css`; shell com toggle de tema/motion/fonte; páginas `/foundations/colors`, `typography`, `units` (tabela por viewport), `spacing`, `motion`, `layers`; tudo em ru                                                  | `src/apps/app/**`, `angular.json`                                                                                 |
| T11 | Docs: `docs/design-system/{principles,tokens,units,theming,motion,accessibility,migration-0.0-to-0.1}.md`; README raiz e `src/libs/ui/README.md` (consumo do CSS, `ThemeService`, `ru()`, `check:ds`, `test`)                                                    | `docs/design-system/*.md`, `README.md`, `src/libs/ui/README.md`                                                   |

### Gate da F1 (todos obrigatórios)

`npm run check:ds` verde (incluindo `check-units` e `check-calibration`); `npm test`, `npm run build` e `npm run build:showcase` verdes; temas sem flash; contraste ok nos dois temas; zero unidade proibida (exceto a baseline da D-F1-1); relatório com arquivos principais, efeito prático e decisões; mensagem de commit proposta (pt-BR); parar.

### Decisões (respondidas pelo dono em 2026-10-20; detalhes em `decisions.md`, ADR-F1-1 a 3)

| #      | Decisão                                                          | Escolha                                                                                                                   |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| D-F1-1 | `1em` do `icon.component.scss`                                   | **a**: baseline `scripts/units-baseline.json` só com esse arquivo; a F2 a esvazia                                         |
| D-F1-2 | Origem das fontes                                                | **a**: copiar uma vez os `woff2` de `@fontsource-variable/*` (sem dependência) com `OFL.txt` conferida na página oficial  |
| D-F1-3 | `_variables.scss` (`$color-*`, `$responsive-unit`, `$dynamic-*`) | **b**: removido no `0.1.0`, sem shim publicado; shim interno só na F1/F2 (T3/T9 mantêm o arquivo até a F2 migrar os usos) |

Ajustes no plano por causa dessas respostas (e da ADR-F1-4: nenhum alias, tudo com `shy`): T1, T3 e T9 não criam alias nenhum; `_variables.scss` fica na F1 só com `$color-*` (interno); a F2 passa a incluir a migração dos `$color-*` e a exclusão de `_variables.scss`; `migration-0.0-to-0.1.md` (T11) traz a tabela `$color-*` → token. A seção 6.5 do plano foi atualizada.

### Premissas desta fase

- O helper TS fica em `src/libs/ui/src/lib/utils/ru.ts`, exportado pelo entrypoint principal (`@shyland-dev/ui`).
- `check-calibration` assume `rem` = 16 px (ADR-F0-6) e roda nos 7 viewports de referência; os valores iniciais da escala vêm da seção 7.2 do plano.
- `check-contrast` lê os hex dos CSS e os pares de `scripts/contrast-pairs.json`, incluindo os pares novos da ADR-F0-9.
- Node do ambiente de nuvem é 22.22.0; os scripts não dependem de recursos exclusivos do Node 24.

## F1: relatório do gate (2026-10-20)

### Verificações

| Verificação                               | Resultado                                                                                                                                                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:ds`                        | verde: check-units, check-calibration, check-tokens (2 avisos), check-contrast (100 pares, 2 temas), check-hardcoded, check-fonts (40 KB de 150)                                                               |
| `npm test`                                | verde: 3 arquivos, 14 testes (`ru()`, `ThemeService`, `shy-theme-toggle`)                                                                                                                                      |
| `npm run build`                           | verde (`ui` e `utils`)                                                                                                                                                                                         |
| `npm run build:showcase`                  | verde; emite `JetBrainsMono-Variable.woff2` em `media/`                                                                                                                                                        |
| Chromium (showcase buildado)              | sem erro de console; `data-theme` e `<meta theme-color>` corretos nos dois temas; fonte carregada; 360×800 sem scroll horizontal; com `light` salvo e o `main.js` bloqueado, o DOM já nasce claro (anti-flash) |
| Consumidor simulado com o pacote buildado | 3 formas de consumo funcionam: `index.css` no `angular.json`, `@import` em CSS, `@use '.../styles/global'`; `ru()`/`z()`/`up()` compilam; fontes emitidas nos 3                                                |
| Ambiente                                  | Node 22.22.0 (repo pede 24.14.1) e npm 10.9.4 (pede 11.11.0); `npm i` só funcionou com `npx npm@11.11.0` (ADR-F1-5, item 8)                                                                                    |

### Arquivos principais

- `src/libs/ui/src/lib/styles/`: `tokens/{units,primitives,semantic-dark,semantic-light,motion,layers}.css`, `fonts.css` + `fonts/**` (woff2 e OFL), `animations.css`, `base.css`, `index.css`, `_global.scss`, `_functions.scss`, `_breakpoints.scss`, `_layers.scss`, `_mixins.scss`, `_index.scss`, `_variables.scss` (só `$color-*`, interno).
- `src/libs/ui/src/lib/`: `utils/ru.ts`, `services/theme/theme.service.ts`, `components/theme-toggle/*` e specs.
- Empacotamento: `ng-package.json` (assets `.css`, `.woff2`, `OFL.txt`), `src/libs/ui/package.json` (`exports` `./styles/*`).
- Testes: `angular.json` (target `test`), `tsconfig.spec.json`, `src/test-setup.ts` (stub da Popover API), devDependencies `vitest` e `happy-dom`.
- Qualidade: `scripts/check-*.mjs`, `_shared.mjs`, `contrast-pairs.json`, `units-baseline.json`, `hardcoded-baseline.json`.
- Showcase: novo shell (tema, reduce motion, fonte), páginas `/foundations/{colors,typography,units,spacing,motion,layers}`, anti-flash no `index.html`; `select`, `snackbar` e as páginas antigas migradas só nos nomes (`ru()`, `--shy-dynamic-*`).
- Docs: `docs/design-system/{principles,tokens,units,theming,motion,accessibility,migration-0.0-to-0.1}.md`, `README.md` raiz e `src/libs/ui/README.md`.

### Efeito prático

- Um CSS (`index.css`) entrega tokens, temas, fontes e base; tema escuro por padrão, claro/sistema por `ThemeService` ou `<shy-theme-toggle>`.
- Toda medida nova é `ru(N)`; o `check:ds` bloqueia unidade, cor, tempo, easing, z-index e fonte literais fora das baselines.
- `--responsive-unit`, `$responsive-unit`, `--dynamic-*` e `$dynamic-*` não existem mais (sem alias). Consumidores quebram até migrar (guia com comandos bash e PowerShell).
- Breaking visível: `$color-*` segue só para `select`/`snackbar`/páginas antigas até a F2.

### Decisões e premissas (detalhes em `decisions.md`, ADR-F1-5)

- Fontes em `styles/fonts/` (não `src/assets/fonts/`); baseline também para `check-hardcoded` (extensão da D-F1-1); breakpoints sm 600 / md 840 / lg 1200 / xl 1600 (ponto de partida); nenhum token de cor precisou mudar após `check-contrast`.
- Licença: Inter removida por decisão do dono (ADR-F1-6); só JetBrains Mono (OFL 1.1).
- Sem bump de versão, tag ou publish.

### Mensagem de commit proposta

```
feat(ui): fundação de tokens, temas, unidades e fontes

- tokens --shy-* (primitivo e semântico dark/light), motion, camadas z()
- ru() em SCSS e TS, _breakpoints, mixins de estado e foco
- ThemeService, provideShyTheme e <shy-theme-toggle>
- fonte JetBrains Mono self-hosted (OFL)
- scripts check:ds, testes com vitest e happy-dom
- showcase com páginas /foundations e docs em docs/design-system
- remove --responsive-unit, $responsive-unit e --dynamic-* sem alias

BREAKING CHANGE: nomes sem prefixo shy removidos; ver migration-0.0-to-0.1.md
```

## F0: plano de verificações

Nenhum código de feature nesta fase. Cada item vira uma linha do relatório com fato confirmado, inferência e fonte (com data).

1. **Consumo de CSS:** como `angular.json` (`styles`, `stylePreprocessorOptions`) e os `@import`/`@use` do showcase chegam aos estilos da lib, e como um app consumidor faria o mesmo com `@shyland-dev/ui/styles`.
2. **Fontes:** se um `@font-face` com `url()` relativo dentro da lib resolve no build do showcase e do consumidor (teste com um `woff2` temporário fora do commit).
3. **Motion:** status de `animate.enter`/`animate.leave` no Angular 21 (angular.dev) e teste mínimo num `@if` do showcase.
4. **Testes:** se há builder `@angular/build:unit-test` configurado; se não, qual devDependency mínima ele exige (proposta, sem instalar sem aprovação).
5. **DOM de teste:** suporte a `<dialog>.showModal()` e Popover API no ambiente de teste escolhido; decidir se precisa de stubs.
6. **Unidades:** `calc(var(--shy-responsive-unit) * N)` em `border-width`, `outline`, `box-shadow`, `font-size` e `translate()`, conferido no `getComputedStyle` do showcase.
7. **Ambiente:** versão do Node vs `.nvmrc` (24.14.1) e se `npm run build` e `npm run build:showcase` passam no estado atual (linha de base).
8. **Registro:** premissas P1 a P6 e exceções E1 a E4 em `docs/design-system/decisions.md`.

Arquivos de teste temporários (fonte, página de verificação) são removidos ao fim da fase; só `decisions.md` e este arquivo entram no commit da F0.

## F0: relatório do gate (2026-10-20)

Nenhum código de feature. Arquivos de teste (fonte temporária, página `/f0-probe`, mudanças em `angular.json`, `ng-package.json`, `styles.scss`) foram criados, medidos e removidos; o working tree só tem `decisions.md` e este arquivo. Detalhes e evidências em `decisions.md` (ADR-F0-1 a 6).

| #   | Verificação    | Resultado                                                                                                                                                                                             |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Consumo de CSS | `angular.json > styles` com `index.css` funciona (showcase e consumidor). Sass `@use` de `.css` com `@import` aninhado falha; CSS `@import` do pacote falha sem `"./styles/*"` em `exports`. ADR-F0-1 |
| 2   | Fontes         | `@font-face` com `url()` relativo resolve: `woff2` emitido em `media/` e URL reescrita, nos dois caminhos que funcionam. Fonte carregada (`document.fonts` = `loaded`)                                |
| 3   | Motion         | `animate.enter`/`animate.leave` estáveis (`@publicApi 20.2` no core 21.2.10) e funcionando num `@if` com OnPush. ADR-F0-3                                                                             |
| 4   | Testes         | `@angular/build:unit-test` disponível (runner padrão vitest), mas sem target `test` e sem `vitest`/DOM instalados. Proposta: `vitest` + `happy-dom`. ADR-F0-2                                         |
| 5   | DOM de teste   | happy-dom tem `<dialog>`, `matchMedia`, `getAnimations`, `inert`; falta Popover API (stub). jsdom não tem nenhum dos quatro                                                                           |
| 6   | Unidades       | `calc(var(--shy-responsive-unit) * N)` correto em todas as propriedades testadas; `border-width`/`outline-width` arredondam para pixel de dispositivo. ADR-F0-4                                       |
| 7   | Ambiente       | Node 22.22.0 (≠ `.nvmrc` 24.14.1, mas suportado pelo Angular 21). `npm run build` e `npm run build:showcase` verdes                                                                                   |
| 8   | Registro       | P1–P6, E1–E4 e ADRs em `decisions.md`                                                                                                                                                                 |

Achado extra (ADR-F0-6): `html { font-family: monospace }` no showcase atual derruba o `rem` para 13 px no Chromium; a pilha da seção 5.4 resolve. Entra como regra na F1/F2.

Não rodou: `npm run check:ds` (script ainda não existe; nasce na F1) e testes (sem target `test`; depende da ADR-F0-2). README não precisou mudar (nenhuma mudança de uso, API, script ou build).

Mensagem de commit proposta:

```
docs: registrar verificações da F0 e decisões do design system

Adiciona docs/design-system/decisions.md (premissas P1–P6, exceções E1–E4 e ADRs da F0)
e o relatório do gate F0 em progress.md. Sem mudança de código.
```

## Log

- 2026-10-20: plano copiado para `docs/`, `CLAUDE.md` e comando `/build` criados.
- 2026-10-20: `/build` aprovou o plano da F0; verificações 1–8 executadas, `decisions.md` criado, estado `aguardando-gate`.
- 2026-10-20: dono aprovou ADR-F0-1 (exports `./styles/*` + `_global.scss`) e ADR-F0-2 (`vitest` + `happy-dom`); push em `feat/design-system` autorizado; F0 commitada (3e647b9) e enviada.
- 2026-10-20: refino do plano antes da F1: seção 7.5 (camadas de z-index, `z()`, promoção de overlays no top layer) e ADR-F0-7; showcase de design publicado no Claude (artifact "Shyland UI Showcase"), só para avaliação visual.
- 2026-10-20: dono aprovou camadas de 100 em 100 e o custo da promoção; pediu mais refinamento e componentes. Showcase ampliado (loading/progresso e navegação/dados), plano com Spinner (8 variantes), Skeleton, ProgressCircular e `loadingPosition` (ADR-F0-8).
- 2026-10-20: dono revisou os boards e pediu 5 ajustes visuais; aplicados no showcase e anotados na ADR-F0-9 e no plano (novos tokens `line`, `neutral-soft`, `scrim-panel`). Após esse ajuste, o dono considera o plano pronto para seguir.
- 2026-10-20: `/build` no estado `aguardando-gate`: gate da F0 aprovado (commits só de documentação, já enviados). F1 passou para `planejar` → plano escrito acima, estado `aguardando-plano`,
- 2026-10-20: dono respondeu D-F1-1 a D-F1-3 (a, a, b); registrado em ADR-F1-1 a 3 e na seção 6.5 do plano. Estado segue `aguardando-plano`: falta o `/build` que aprova o plano da F1.
- 2026-10-20: dono decidiu **sem nenhum alias** (tudo com prefixo `shy`): D9 revogada, P1 revisada, plano rev. 5, `CLAUDE.md` atualizado, ADR-F1-4. Estado segue `aguardando-plano`.
- 2026-10-20: `/build` aprovou o plano da F1 e a executou (T1–T11). Gate em `aguardando-gate`; relatório acima.
- 2026-10-20: dono aprovou o gate da F1 e pediu risco zero de licença: Inter removida (ADR-F1-6). Revalidado, commit e push em `feat/design-system`.
- 2026-10-20: F1 commitada (0123029) e enviada para `feat/design-system`. F2 em `planejar` → plano escrito; estado `aguardando-plano`.
- 2026-10-20: `/build` aprovou o plano da F2 e a executou (T1–T7). Gate em `aguardando-gate`; relatório acima.
- 2026-10-20: `/build` aprovou o plano da F3-S1 e a executou (utilitários, `animateOut`, Button, IconButton, showcase, README). Gate em `aguardando-gate`; relatório na seção "F3-S1: relatório do gate".
- 2026-10-20: dono liberou commit após os testes e o push; F3-S1 commitada (`39c815b`) e enviada para `feat/design-system`. F3-S2 em `aguardando-plano`.
- 2026-10-20: `/build` aprovou o plano da F3-S2 e a executou; verificações verdes; commit `53e2902` e push em `feat/design-system`. Estado `aguardando-gate`.
- 2026-10-21: dono escolheu a opção B da ADR-F4-4; `/build` aprovou o plano da F4-S1 e a executou (overlay core, showcase, docs). Verificações verdes; commit `3ac709b`. Estado `aguardando-gate`.
- 2026-10-21: `/build` aprovou o gate da F4-S1 (`3ac709b`, já enviado). **F4-S1 concluída.** F4-S2 (Dialog, Drawer) em `aguardando-plano`; plano escrito acima, sem decisão de alto impacto pendente.
- 2026-10-21: `/build` aprovou o plano da F4-S2 e a executou (Dialog, Drawer, serviços, showcase, docs). Verificações verdes; commit `95e5ab3`. Estado `aguardando-gate`.
- 2026-10-21: `/build` aprovou o gate da F4-S2 (`95e5ab3`, já enviado). **F4-S2 concluída.** F4-S3 (Popover, Tooltip, Menu) em `aguardando-plano`; plano escrito acima, sem decisão de alto impacto pendente.
