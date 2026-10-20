# Progresso do Design System

Arquivo de estado lido pelo comando `/build` (ver CLAUDE.md). Atualizado a cada tarefa concluída.

## Estado atual

- Fase: **F3 Onda 1**, sessão **F3-S4** (Checkbox, Radio, Switch)
- Estado: `aguardando-plano`
- Branch: `feat/design-system`
- Gate da F3-S3 aprovado pelo `/build` de 2026-10-20 (commit `e119878`). O plano da F3-S4 está em `sessions/F3-onda-1.md`; o próximo `/build` o aprova e executa a sessão.

## Fases

| Fase                               | Status                    | Commit                                                        |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------- |
| F0 Preparação                      | concluída (gate aprovado) | 3e647b9, aa431bb, 65d080f, c25ef8d, 979bdf6 (só documentação) |
| F1 Unidades, tokens, temas, fontes | concluída (gate aprovado) | 0123029                                                       |
| F2 Refactor dos existentes         | concluída (gate aprovado) | eb359ac                                                       |
| F3 Onda 1                          | em andamento (6 sessões)  |                                                               |
| F4 Onda 2                          | pendente (6 sessões)      |                                                               |
| F5 Onda 3 + hardening              | pendente (4 sessões)      |                                                               |

## Sessões

| Sessão | Escopo                                                                             | Status    | Commit  |
| ------ | ---------------------------------------------------------------------------------- | --------- | ------- |
| F3-S1  | Utilitários Onda 0 (tipografia, layout, sr-only, animateOut) + Button + IconButton | concluída | 39c815b |
| F3-S2  | Spinner, Skeleton, ProgressCircular, Progress                                      | concluída | 53e2902 |
| F3-S3  | FormField, Input, Textarea                                                         | concluída | e119878 |
| F3-S4  | Checkbox, Radio, Switch                                                            | plano     |         |
| F3-S5  | Badge/Tag, Divider, Card, Alert                                                    | pendente  |         |
| F3-S6  | Fechamento da Onda 1                                                               | pendente  |         |
| F4-S1  | Núcleo de overlay (decisão ADR-F4-1)                                               | pendente  |         |
| F4-S2  | Dialog, Drawer                                                                     | pendente  |         |
| F4-S3  | Popover, Tooltip, Menu                                                             | pendente  |         |
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
