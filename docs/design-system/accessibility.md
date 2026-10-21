# Acessibilidade (baseline WCAG 2.2 AA)

## O que a F1 já garante

- **Contraste:** `check-contrast` valida os 56 pares de `contrast-pairs.json` (texto ≥ 4,5:1; foco, borda de controle ≥ 3:1) nos dois temas e falha em regressão. O texto `text-disabled` é isento (WCAG 1.4.3).
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

## Controles de escolha (F3-S4)

| Componente                  | Teclado / ARIA                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shy-checkbox`              | Checkbox nativo: Espaço alterna; `indeterminate` anunciado como misto; `aria-invalid`, `aria-describedby` e `aria-errormessage` pelo `shy-form-field`                              |
| `shy-switch`                | Checkbox nativo com `role="switch"`: Espaço alterna; estado nativo (sem `aria-checked`); a posição do botão mostra o estado                                                        |
| `shy-radio-group` / `radio` | `role="radiogroup"` (nome por `label` ou `aria-labelledby` do campo), radios nativos com o mesmo `name`: Tab entra no marcado, setas movem e selecionam, desabilitados são pulados |

Estado marcado visível sem cor (glifo e posição) e em `forced-colors`; alvo ≥ `--shy-size-control-sm`; inválido tracejado em `forced-colors`.

## Feedback e conteúdo (F3-S5)

| Componente    | Teclado / ARIA                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shy-badge`   | Texto diz o estado (cor só reforça); só ponto exige `label` (`role="img"`); `removable`: botão com `aria-label` e alvo ≈ 30 px                              |
| `shy-divider` | `role="separator"`, `aria-orientation="vertical"` quando vertical; texto é visual                                                                           |
| `shy-card`    | Estático; `a[shyCard]`/`button[shyCard]` são nativos (Enter no link, Enter/Espaço no botão), foco `:focus-visible`, `disabled` nativo                       |
| `shy-alert`   | Ícone (muda por intenção) + `heading`: nunca só cor; `role="status"` por padrão, `role="alert"` só com `urgent` em warning/danger; botão de fechar com nome |

Contraste dos pares `*-soft`/`on-*-soft`/`*-text` e `on-*`/`*` nos dois temas conferido em `check-contrast`.

## Matriz da Onda 1 (fechamento F3-S6, 2026-10-21)

Consolidado dos componentes da F3, conferido no Chromium 141 (Playwright) sobre o build do showcase.

| Componente                    | Teclado                                        | Papel / ARIA                                                         | Foco visível         | `forced-colors`                   |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- | -------------------- | --------------------------------- |
| Button / IconButton           | Enter e Espaço (`button`), Enter (`a`)         | nativo; `aria-busy` no loading; IconButton `aria-label`              | anel 2 px            | `ButtonText`                      |
| Spinner / Skeleton / Progress | não focáveis                                   | `status` (com `label`) / `aria-hidden` / `progressbar` + valores     | n/a                  | `CanvasText`, `Highlight`         |
| Input / Textarea / FormField  | nativo                                         | `label for`, `aria-describedby`, `aria-invalid`, `aria-errormessage` | anel 2 px            | `FieldText`, inválido tracejado   |
| Checkbox / Switch             | Espaço                                         | checkbox nativo / `role="switch"`                                    | anel 2 px na marca   | glifo e posição visíveis          |
| Radio group                   | Tab entra no marcado; setas movem e selecionam | `radiogroup` + radios nativos                                        | anel 2 px na marca   | ponto `CanvasText` (ADR-F3-6)     |
| Badge                         | botão remover: Enter/Espaço                    | texto; `dot` só com `label` (`role="img"`)                           | anel 2 px no remover | borda `CanvasText`; ponto visível |
| Divider / Card                | `a`/`button[shyCard]` nativos                  | `separator`; cartão interativo nativo                                | anel 2 px no cartão  | `CanvasText` / `LinkText`         |
| Alert                         | botão fechar: Enter/Espaço                     | `status` (ou `alert` com `urgent`); ícone + título                   | anel 2 px no fechar  | borda e ícone `CanvasText`        |

Resultado da auditoria:

- **Ordem de Tab** em `examples/form`: Name, Email, Message, radio marcado (ou o primeiro), Email updates, SMS updates, Public profile, Terms, Create account, Reset. Todos com anel `solid` 2 px (no próprio elemento ou na `.mark` do controle), nos dois temas.
- **Envio inválido**: alerta `role="status"` com a lista dos campos, mensagens com ícone + texto, `aria-invalid` nos 4 campos e foco no primeiro inválido. Envio válido: botão com `aria-busy` mantém o foco; alerta de sucesso `status`.
- **Contraste em runtime**: todo texto visível das 16 páginas da Onda 1 (15 componentes + formulário), em dark e light, 1366 e 360 px: nenhum par abaixo de 4,5:1 (3:1 para texto grande). Elementos desabilitados ficam de fora (WCAG 1.4.3).
- **Layout**: sem scroll horizontal e sem erro de console nas mesmas 64 combinações.
- **Reduced motion**: com `data-motion="reduced"` o spinner do botão só pulsa (`shy-pulse`).

Corrigido no fechamento (ADR-F3-6): contorno do controle marcado no escuro (2,6:1 → `primary-text`), rótulo do campo apagado por uma opção de radio desabilitada, ponto do radio e do badge invisíveis em `forced-colors`.

Não verificado: leitor de tela real (NVDA, VoiceOver, TalkBack); Windows em alto contraste real (só a emulação do Chromium); RTL; zoom 200% (limite conhecido acima); ponteiro grosso em dispositivo real.

## Por componente (F2 em diante)

Teclado completo sem armadilha, ordem de foco lógica, nome acessível em todo controle, `aria-*` conforme APG (Listbox/Select, Combobox, Dialog, Tabs, Menu button, Tooltip, Switch, Radio group, Checkbox, Accordion, Alert/Status), mensagens dinâmicas com `role="status"`/`role="alert"`, cor nunca como única pista. Checklist manual por onda: só teclado; zoom 200%; largura 320 px; `forced-colors`; `reduced-motion`; claro e escuro; 360×800, 1366×768 e 1920×1080.

## Overlays (F4-S1, `OverlayService`)

- **Modal** (`<dialog>.showModal()`): resto da página `inert` pelo navegador, Tab preso entre o primeiro e o último focável, foco inicial no primeiro focável (ou `[autofocus]`), foco devolvido a quem abriu ao fechar, scroll da página travado. O nome vem de `ariaLabel`/`ariaLabelledBy` (o Dialog da F4-S2 liga o título).
- **Esc** fecha só a camada do topo e só se o conteúdo não tratou a tecla; o `cancel` nativo é bloqueado para a pilha do serviço decidir.
- **Popover/tooltip/toast** (`[popover="manual"]`) não roubam foco por padrão (`initialFocus: 'none'`); quem abre o painel é responsável por `aria-expanded`/`aria-controls` (Popover, Menu e Select da F4-S3/S4).
- **Limitação conhecida**: overlay aberto antes de um modal fica visível, mas inerte, até o modal fechar (ADR-F4-5). Painel ancorado em conteúdo do modal é filho dele e continua interativo.
- **Verificado no Chromium** (página `foundations/layers`, dark e light): ordem de empilhamento nas 3 ordens de abertura, Esc um por vez, Tab preso, clique no backdrop não fecha o modal, clique fora fecha o popover, container e scroll lock removidos ao fechar, foco devolvido; popover irmão do modal fica inerte (hit-test cai no dialog) e popover filho do dialog recebe o clique (confirma a ADR-F4-5). **Não verificado**: leitor de tela, reduced motion no overlay (só a lógica do `animateOut`, testada em unidade), RTL real no navegador (testado só em unidade), Safari/Firefox.

## Dialog e Drawer (F4-S2)

- `<dialog>` modal nativo; nome acessível pelo `heading` (`aria-labelledby`) ou `ariaLabel`/`ariaLabelledBy` da abertura; descrição = corpo (`aria-describedby`). Confirmações e alertas usam `role="alertdialog"`, foco inicial no botão seguro (Cancelar/OK) e não fecham por clique fora.
- Botão de fechar com nome (`closeLabel`, padrão "Close"); alvo ≥ `control-sm`. O corpo rola sozinho (`overscroll-behavior: contain`).
- **Verificado no Chromium** (dark/light, 900×700 e 360×800, LTR e RTL): 4 tamanhos do Dialog sem scroll horizontal, nome e descrição ligados, popover ancorado dentro do dialog clicável, dialog sobre dialog com Esc um por vez, Tab preso, foco devolvido ao botão que abriu, backdrop não fecha Dialog e fecha Drawer, 4 lados do Drawer e corpo com rolagem, `reduced-motion` (fechamento imediato) e `forced-colors` (borda `CanvasText`, fundo `Canvas`). **Não verificado**: leitor de tela, Safari/Firefox, aparelho com notch (safe-area).

## Popover, Menu e Tooltip (F4-S3)

- **Popover:** gatilho com `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls`; foco no primeiro focável; Esc, clique fora e novo clique fecham e devolvem o foco; Tab que sai do painel fecha e segue a partir do gatilho.
- **Menu (APG menu button):** `role="menu"` nomeado pelo botão, `role="menuitem"`, roving focus, setas com volta, Home/End, typeahead; ↓ abre no primeiro item e ↑ no último; Esc/Tab fecham; itens desabilitados com `aria-disabled` e focáveis. Sem submenus.
- **Tooltip (WCAG 1.4.13):** dispensável (Esc sem mover o foco), pairável (o ponteiro entra na dica) e persistente; só complementa o nome (`aria-describedby` enquanto aberta); não abre no toque. `forced-colors`: borda `CanvasText`/`Highlight`.
- **Verificado no Chromium** (dark/light, 360 e 1366 px, LTR e RTL, `forced-colors`): foco inicial e retorno, ↑/↓, tooltip no foco por teclado e no hover, flip/shift na borda, popover/menu/tooltip clicáveis dentro de um Dialog, sem erros de console. **Não verificado:** leitor de tela real, Safari/Firefox.

## Select (F4-S4)

- **Select-only combobox (APG):** botão `role="combobox"` com `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` e `aria-activedescendant`; painel `role="listbox"` (`aria-multiselectable` em `multiple`), opções `role="option"` com `aria-selected` e `aria-disabled`. O foco fica no botão.
- **Teclado:** ↓/↑/Enter/Espaço abrem; ↓/↑/Home/End movem (pulando desabilitadas); Enter/Espaço escolhem; digitar salta para a opção; Esc fecha sem mover o foco; Tab fecha e segue.
- **Formulários:** nome pelo `label` do `shy-form-field` (`for`/`id`) ou `label` (`aria-label`); `aria-describedby`, `aria-invalid`, `aria-errormessage`, `aria-required`. Inválido nunca só cor (`forced-colors`: borda tracejada).
- **Verificado no Chromium** (dark/light, 360 e 1366 px, LTR e RTL, `forced-colors`): foco permanece no botão, opção ativa, multiple, seleção dentro de um Dialog, sem erros de console. **Não verificado:** leitor de tela real (NVDA/VoiceOver), Safari/Firefox. Risco conhecido: `aria-activedescendant` apontando para um nó em outro contêiner do DOM (o painel) depende do leitor de tela; o padrão APG o usa, mas vale testar com leitor real.

## Snackbar (F4-S5)

- **Regiões vivas** fixas (existem antes do primeiro toast): `role="status"` (`aria-live="polite"`) e `role="alert"` (só `intent: 'danger'`). Cada toast tem ícone + texto (nunca só cor); alvos de ação e de fechar ≥ `control-sm`.
- **WCAG 2.2.1 (tempo ajustável):** `duration` configurável (`0` = não fecha sozinho), padrão mais longo com ação, pausa com ponteiro/foco e aba oculta, botão de fechar. **2.4.11/2.1.1:** a ação e o X são botões focáveis; o contêiner não captura Esc.
- **Com modal aberto** o toast fica `inert` (ADR-F4-5): a ação é ocultada (ADR-F4-3b) e o texto continua anunciado; o X não recebe clique até o modal fechar.
- **Verificado no Chromium** (dark/light, 360 e 1366 px, LTR e RTL, `forced-colors`, `reduced-motion`): fila de 3, pausa em hover, `danger` na região `alert`, Esc fecha o Dialog por baixo, toast visível sobre o modal, sem erros de console. **Não verificado:** leitor de tela real (anúncio das regiões), Safari/Firefox, toque real.

## Onda 2: resumo de fechamento (F4-S6)

- **Camadas:** ordem de abertura decide o empilhamento; Esc fecha só o topo (o contêiner de toasts é `passive` e não captura Esc nem clique fora); modal deixa o resto `inert`; painel ancorado dentro de um modal vira filho do `<dialog>`; scroll lock e `inert` são removidos ao fechar tudo.
- **Foco:** retorna ao elemento de origem; o Menu devolve o foco ao botão **antes** do `(click)` do item, então um Dialog aberto por um item lembra o botão e devolve o foco a ele ao fechar.
- **Exemplo integrado** (showcase, `examples > overlays together`): Menu → Dialog (Select e Tooltip dentro) → toast → confirmação → toast com ação. Verificado no Chromium (dark/light, 360 e 1366 px, LTR e RTL, `reduced-motion`): Esc um por vez, sem painéis nem `inert`/scroll lock sobrando, sem erros de console.
- **Não verificado na Onda 2:** leitor de tela real (NVDA/VoiceOver; atenção ao `aria-activedescendant` do Select e às regiões vivas do Snackbar), Safari/Firefox, toque real. Fica para a auditoria da F5-S4.

## Tabs, Accordion, Breadcrumb e Pagination (F5-S1)

- **Tabs (APG Tabs):** `tablist` nomeada (`label`), `tab` com `aria-selected`/`aria-controls`, `tabpanel` com `aria-labelledby` e `tabindex="0"`; roving tabindex, setas com volta (invertidas em RTL), Home/End, desabilitadas puladas; ativação automática ou manual. Indicador por borda (sobrevive ao `forced-colors`, onde vira `Highlight`).
- **Accordion (APG Accordion):** cabeçalho `role="heading"` + `aria-level` com botão `aria-expanded`/`aria-controls`; painel `role="region"` com `aria-labelledby`, `inert` fechado (fora do Tab e dos leitores). ↓/↑/Home/End entre cabeçalhos. Altura animada só com `--shy-duration-base` (zerada em reduced motion).
- **Breadcrumb:** `navigation` nomeada, lista de `listitem`, `aria-current="page"` só no item atual; separador CSS com texto alternativo vazio (fora da árvore de acessibilidade).
- **Pagination:** `nav` nomeada, botões nativos nomeados ("Page 3", "Previous page"), `aria-current="page"`, reticências `aria-hidden`; textos traduzíveis por input. Alvos ≥ `size-control-md` (crescem em ponteiro grosso).
- **Contraste:** nenhum par novo (ver `tokens.md`). **Verificado no Chromium** (dark/light, 360 e 1366 px, LTR e RTL, `forced-colors`, `reduced-motion`): sem scroll horizontal nem erros de console; teclado das abas em LTR/RTL. **Não verificado:** leitor de tela real, Safari/Firefox, toque real (vai para a F5-S4).
