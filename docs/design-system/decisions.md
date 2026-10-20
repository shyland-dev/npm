# Decisões do Design System

Registro de premissas, exceções e decisões curtas (ADR). Fonte: `docs/DESIGN-SYSTEM-PLAN.md` (rev. 4).
Alterar uma linha daqui exige decisão do dono e atualização do plano no mesmo commit.

## Decisões fechadas (D1–D9; a D9 foi revogada em 2026-10-20, ver ADR-F1-4)

Ver seção 2.1 do plano. Resumo: zero dependências de runtime (D1), tokens `--shy-*` em kebab-case (D2), gradiente `#4C00FF → #5F00D9` e tema escuro padrão (D3), fontes self-hosted (D4), showcase sem Storybook (D5), API pode quebrar em `0.x` (D6), logos fora da lib (D7), regra absoluta de unidades (D8), `--responsive-unit` depreciado até a `1.0.0` (D9).

## Premissas (P1–P6)

| #   | Premissa                                                                                                                                                                                                                 | Status                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| P1  | Fórmula do ru inalterada: `calc(0.1rem + 0.1vmin)`. Nome canônico `--shy-responsive-unit`; `--responsive-unit`, `$responsive-unit` e `--dynamic-*`/`$dynamic-*` **deixam de existir** no `0.1.0`, sem alias (seção 6.5). | Revisada em 2026-10-20 (ADR-F1-4): antes mantinha alias depreciado (D9) |
| P2  | Fonte padrão da UI = mono (JetBrains Mono); texto corrido com stack sans do sistema por token (Inter descartada, ADR-F1-6).                                                                                              | Assumida; ver achado F0-6 (a pilha nunca pode ser só `monospace`)       |
| P3  | Primeira release do refactor = `0.1.0` (breaking); bump minor por onda; `1.0.0` só com o checklist da F5 verde. Bump só a pedido.                                                                                        | Assumida                                                                |
| P4  | Só devDependencies de teste; nada em `dependencies`/`peerDependencies` além do Angular. Sem axe, Playwright, Storybook.                                                                                                  | Assumida; runner proposto em ADR-F0-2 (aguarda aprovação)               |
| P5  | Angular 21: standalone, `OnPush`, `input()`/`output()`/`model()`, `inject()`, compatível com zoneless.                                                                                                                   | Assumida                                                                |
| P6  | Propriedades lógicas de CSS (`margin-inline`, `padding-block`, `inset-inline`) por padrão.                                                                                                                               | Assumida                                                                |

## Exceções da regra de unidades (E1–E4)

| #   | Exceção                                                                                         | Status / evidência F0                                      |
| --- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| E1  | `tokens/units.css` (definição do ru e das unidades dinâmicas de viewport).                      | Assumida                                                   |
| E2  | Condições de `@media`/`@container`, só em `_breakpoints.scss`.                                  | Assumida (CSS não aceita `var()` em condição de query)     |
| E3  | Valores que não são comprimento: `0`, `%`, `fr`, números puros, `ms`/`s`, `deg`, `auto`/`none`. | Assumida; `%` e `fr` continuam permitidos até o dono vetar |
| E4  | Atributos SVG/HTML fora do CSS (`viewBox`).                                                     | Assumida                                                   |

Fora das exceções, a F0 confirmou que `calc(var(--shy-responsive-unit) * N)` funciona em todas as propriedades usadas pela regra (ver ADR-F0-4).

## ADRs da F0 (2026-10-20)

### ADR-F0-1. Consumo do CSS da lib

- **Fato (testado no showcase e num app consumidor simulado com o pacote buildado):**
    - `angular.json > styles` apontando para `index.css` (com `@import` relativos e `@font-face` com `url()` relativo) funciona: o esbuild junta os `@import`, emite o `woff2` em `media/` e reescreve a URL.
    - Sass `@use` de um `.css` **isolado** funciona e também rebaseia `url()`.
    - Sass `@use` de um `.css` que contém `@import` **falha** (`Could not resolve "./fonts.css"`): o Sass repassa o `@import` como CSS puro e ele é resolvido a partir do arquivo que fez o `@use`.
    - CSS puro `@import '@shyland-dev/ui/styles/index.css'` **falha** com o `package.json` gerado hoje, porque o ng-packagr cria `exports` só com `.` e `./package.json`. Com `"./styles/*"` em `exports` passa a funcionar; o ng-packagr mescla esse campo vindo de `src/libs/ui/package.json` (testado).
    - Sass `@use '@shyland-dev/ui/styles/...'` funciona mesmo sem a entrada em `exports`.
- **Recomendação (F1):** caminho oficial = `angular.json > styles` com `@shyland-dev/ui/styles/index.css`; adicionar `"./styles/*"` em `exports` (aditivo) para habilitar `@import` em CSS; para quem consome via Sass, um `styles/_global.scss` que faz `@use` de cada `.css` (sem `@import` aninhado). `_index.scss` continua só com funções/mixins, para não duplicar tokens em cada componente.
- **Decisão (2026-10-20, dono): aprovada.** Entra na F1.

### ADR-F0-2. Test runner e DOM de teste

- **Fato:** o builder `@angular/build:unit-test` vem no `@angular/build` 21.2.8 instalado (`runner` padrão `vitest`; peer opcional `vitest ^4.0.8`). Nenhum projeto tem target `test` em `angular.json` e não há `vitest`, `jsdom` nem `happy-dom` instalados.
- **Fato (testado em pasta temporária, fora do repo):**

| API                               | jsdom 29.1.1 | happy-dom 21.0.3                     |
| --------------------------------- | ------------ | ------------------------------------ |
| `dialog.showModal()` / `close()`  | não existe   | funciona (`open`, `returnValue`)     |
| `:modal`                          | `false`      | `false`                              |
| `showPopover()` / `hidePopover()` | não existe   | não existe (atributo `popover` lido) |
| `matchMedia`                      | não existe   | existe                               |
| `element.getAnimations()`         | não existe   | existe                               |
| `inert`                           | não existe   | existe                               |

- **Inferência:** com happy-dom, só a Popover API precisa de stub; com jsdom, dialog, popover e `matchMedia` precisam. O evento `close` é síncrono no happy-dom e assíncrono no navegador, então teste nenhum deve depender dessa ordem.
- **Recomendação:** devDependencies `vitest` (^4) e `happy-dom`; target `test` com `@angular/build:unit-test` em `ui` (e `utils` quando tiver testes); stub de `showPopover`/`hidePopover`/`togglePopover` num `setupFiles`.
- **Decisão (2026-10-20, dono): aprovada** (`vitest` ^4 + `happy-dom`, stub da Popover API). Instalar na F1.

### ADR-F0-3. Enter/leave com `animate.enter` / `animate.leave`

- **Fato:** no `@angular/core` 21.2.10 instalado, `AnimationFunction`/`AnimationCallbackEvent` estão marcados `@publicApi 20.2` (estáveis, não `@developerPreview`). A documentação oficial descreve a API em angular.dev/guide/animations (consultada via busca em 2026-10-20; o acesso direto a angular.dev está bloqueado pela rede deste ambiente).
- **Fato (Chromium, showcase, `@if` + `OnPush`):** `animate.enter="probe-enter"` aplica a classe, roda a animação e remove a classe ao fim. `animate.leave="probe-leave"` aplica a classe no frame seguinte e só remove o elemento do DOM depois da animação (300 ms: presente em 150 ms, removido em 350 ms). Sem `@angular/animations`.
- **Decisão:** usar `animate.enter`/`animate.leave` para elementos de `@if`/`@for`. `animateOut(el)` fica só para `<dialog>`/`[popover]` (seção 9.4).

### ADR-F0-4. Unidades ru nas propriedades da regra

- **Fato (Chromium headless, DPR 1, `getComputedStyle`):** os valores calculados batem com `N × ru` em `font-size`, `letter-spacing`, `box-shadow` (offset, blur e spread negativo), `translate`, `transform: translateX()`, `text-underline-offset`, `backdrop-filter: blur()`, `border-radius` e `outline-offset`, em 360×800, 1366×768, 1920×1080 e 3840×2160.
- **Fato:** `border-width` e `outline-width` são arredondados para pixel de dispositivo: `0.5 ru` dá `1px` de 360×800 até 4K em DPR 1; `1 ru` de outline dá 1/2/2/3 px nos quatro viewports. Valor entre 0 e 1 px vira 1 px.
- **Não medido:** DPR 2/3 (fica para a página `/foundations/units` da F1).

### ADR-F0-5. Ambiente

- Node do ambiente em nuvem: 22.22.0 (o `.nvmrc` pede 24.14.1). Angular 21.2.x aceita `^20.19 || ^22.12 || >=24`, então os builds são válidos, mas a CI de publicação usa 24.14.1.
- Linha de base em 2026-10-20: `npm run build` e `npm run build:showcase` verdes. `npm ci` reporta 35 vulnerabilidades em dependências de desenvolvimento (não tratadas na F0).

### ADR-F0-6. Achado: `font-family: monospace` puro encolhe o `rem`

- **Fato (Chromium):** com `html { font-family: monospace }` (como no `styles.scss` atual do showcase), o `font-size` raiz cai para 13 px; com `monospace, monospace` ou uma pilha nomeada (`'JetBrains Mono', ui-monospace, monospace`) volta a 16 px. Como `ru = 0.1rem + 0.1vmin`, hoje o showcase calcula o ru com `rem` = 13 px (≈ 0,3 px a menos por ru).
- **Consequência:** a tabela da seção 6.4 (rem = 16) só vale com a pilha da seção 5.4. Regra para F1/F2: nenhum `font-family` termina só em `monospace` sem fonte nomeada antes; `check-calibration` assume 16 px.

### ADR-F0-7. Camadas de z-index (2026-10-20, pedido do dono)

- **Pedido:** funções SCSS para z-index por componente, sem valores "mágicos" como `9999`.
- **Fato:** elementos do top layer (`dialog.showModal()`, `[popover]`) ignoram `z-index` entre si; vale a ordem de abertura. Só uma função SCSS não resolve "tooltip atrás de dialog".
- **Decisão:** escala nomeada + `z()` para o que está fora do top layer, e promoção por ordem de abertura no `OverlayService` para o top layer. Detalhes na seção 7.5 do plano. Implementação: tokens/função na F1, promoção na F4.
- **Risco aceito:** promoção reinicia o popover (sem animação nessa troca).

### ADR-F0-8. Showcase de design e catálogo ampliado (2026-10-20)

- **Decisão do dono:** camadas de z-index de 100 em 100 e custo da promoção dos overlays aceitos; quer mais refinamento e o máximo de componentes úteis.
- **Showcase no Claude** (referência visual, px livre; não é código da lib): fundações, ação/formulário, feedback/overlays, loading/progresso, navegação/dados, nos dois temas.
- **Catálogo:** Onda 1 ganha `Spinner` com 8 variantes, `Skeleton` e `ProgressCircular`; `Button` ganha `loadingPosition` (`start|end|replace`) e `loadingText`. Onda 3 detalha Tabs (underline/pill), Avatar, Table (seleção e ordenação).
- **Achado do showcase:** o ícone de loading do botão sumia em uma variação porque dependia de `sc-if` aninhado no runtime do artifact; passou a existir sempre, escondido por classe. Problema do showcase, não do desenho do botão.

### ADR-F0-9. Ajustes da revisão visual do showcase (2026-10-20)

Dono revisou os boards e pediu 5 correções, aplicadas no showcase e registradas no plano (seção 7.1 e checklist 11.3):

| Achado                                                          | Causa                                                                         | Regra para a lib                                                                                                  |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Spinner colado na borda esquerda do botão em loading            | Células estreitas (6 colunas) e padding de 12 px; conteúdo quase da largura   | Respiro lateral mínimo no botão (≥ `--shy-space-6`); matriz do showcase em 3 colunas                              |
| Dots e spinner invisíveis no botão outline/ghost do tema escuro | Botão sem `background` na base: o navegador pintou o fundo claro padrão       | `background: transparent` na base de todo botão; cor do spinner = `currentColor`                                  |
| Texto "Carregando relatório" escuro sobre scrim no tema claro   | Scrim de 40% sobre fundo claro dá cinza médio; texto usava `--shy-color-text` | Tokens `--shy-color-scrim-panel` e `--shy-color-on-scrim`: painel escuro com texto claro (≥ 4,5:1) nos dois temas |
| Chip "+4" do grupo de avatares quase da cor do fundo            | Usava `surface-raised`, que mal difere da superfície nos dois temas           | Tokens `--shy-color-neutral-soft` / `--shy-color-on-neutral-soft`                                                 |
| Linha do stepper pouco visível                                  | Usava `border` (decorativa)                                                   | Token `--shy-color-line` (mais claro no escuro, mais escuro no claro)                                             |

Os novos pares entram em `scripts/contrast-pairs.json` na F1 (texto ≥ 4,5:1; `line` sobre `surface` ≥ 3:1).

**Complemento (mesmo dia):** no tema escuro o painel `scrim-panel` (preto 82%) sumia sobre o scrim preto. Passou a ser neutral-800 com borda neutral-500 e sombra no escuro; no claro continua `rgb(7 8 17 / 82%)`.

## ADRs da F1 (decisões do dono em 2026-10-20)

### ADR-F1-1. Baseline de unidades para o ícone (D-F1-1: opção a)

`scripts/units-baseline.json` lista só `icon.component.scss` (5 linhas com `1em`) até o refactor do ícone na F2. O `check-units` falha em qualquer violação fora da baseline e em baseline que não encolhe; o gate da F2 exige a baseline **vazia**.

### ADR-F1-2. Fontes copiadas dos pacotes oficiais (D-F1-2: opção a)

Os `woff2` variáveis latin de JetBrains Mono e Inter são copiados **uma vez** de `@fontsource-variable/*` para `src/libs/ui/src/lib/styles/fonts/<família>/` (ajuste de caminho na execução: ver ADR-F1-5), com o `OFL.txt`. Nenhum pacote entra em `package.json`. Antes do commit: conferir o texto da OFL e o copyright com a página oficial de cada fonte e o orçamento (≲ 150 KB, `check-fonts`).

### ADR-F1-3. `_variables.scss` removido no `0.1.0` (D-F1-3: opção b)

- **Decisão:** `$color-*` (paleta Ionic), `$responsive-unit` e `$dynamic-*` saem no `0.1.0`, sem shim publicado. Permitido em `0.x` (D6); é exceção explícita à política de depreciação (seção 6.5), que continua valendo para o alias **CSS** `--responsive-unit` (D9, até a `1.0.0`).
- **Efeito no plano:** a F1 mantém o arquivo só como shim interno (select, snackbar e showcase ainda o importam); a F2 migra os usos restantes e o apaga, e o `check-units` passa a falhar em qualquer uso. `migration-0.0-to-0.1.md` traz a tabela `$color-*` → token e o passo de `$responsive-unit` → `ru()`.
- **Confirmado pelo dono (ver ADR-F1-4):** as variáveis CSS sem prefixo `--dynamic-height`, `--dynamic-width` e `*-unit` (também em `_variables.scss`) saem junto; viram `--shy-dynamic-*`. Só `--responsive-unit` mantém alias (D9). Se você quiser alias para elas, diga.
- **Risco:** consumidores que ainda usam `$color-*` ou `$responsive-unit` quebram ao subir para `0.1.0`; por isso a migração fica documentada e o bump só acontece a pedido.

### ADR-F1-4. Nenhum alias: tudo com o prefixo `shy` (2026-10-20)

- **Decisão do dono:** "tudo tem que ficar com o prefixo shy, pode tirar os alias". O dono corrige os projetos consumidores depois.
- **Efeito:** `--responsive-unit`, `$responsive-unit`, `--dynamic-height/width/*-unit` e `$dynamic-*` (e `$color-*`) saem no `0.1.0`, sem alias. A **D9 está revogada** e a **P1** perdeu a cláusula do alias. Isso também substitui a parte "alias CSS até a `1.0.0`" da ADR-F1-3.
- **Conflito apontado e resolvido a favor da instrução:** o `CLAUDE.md` e a regra 2 das instruções do projeto davam o `--responsive-unit` como depreciado (alias até a `1.0.0`). O `CLAUDE.md` e a seção 17 do plano foram atualizados; a regra 2 das instruções do projeto no app deve ser ajustada pelo dono.
- **Consequências no plano:** `units.css` sem linha de alias (T1); `_index.scss` sem alias SCSS (T3); T9 migra também `$dynamic-*` e `--dynamic-*` dos arquivos internos; `check-units` falha em qualquer nome sem prefixo (inclusive nas strings de CSS dos consumidores simulados do showcase); `migration-0.0-to-0.1.md` traz a tabela de nomes antigos → novos e os comandos de busca (seção 6.5).
- **Risco:** todo projeto que usa a lib quebra ao subir para `0.1.0` (esperado, aceito). Mitigação: guia de migração e bump só a pedido.

### ADR-F1-5. Ajustes feitos na execução da F1 (2026-10-20)

| #   | Ajuste                                                                                                                                                                                           | Motivo                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Fontes em `styles/fonts/<família>/` (não em `src/assets/fonts/` como no plano 5.3)                                                                                                               | O `ng-packagr` copia `styles/**` para `./styles` e o `url('./fonts/...')` do `fonts.css` fica relativo; testado em 3 consumidores simulados (`index.css` no `angular.json`, `@import` em CSS, `@use '.../styles/global'`): o build emite os `woff2` em `media/` nos três |
| 2   | Baseline também para `check-hardcoded` (`scripts/hardcoded-baseline.json`: `icon`, `select`, `snackbar` e as páginas antigas `home`/`icons` do showcase)                                         | Esses SCSS têm `$color-*`, `250ms ease-in-out`, `z-index: 1000/9999` e `monospace`; só a F2 os redesenha. Extensão da D-F1-1; a F2 exige as duas baselines vazias                                                                                                        |
| 3   | Breakpoints de `_breakpoints.scss`: `sm` 600, `md` 840, `lg` 1200, `xl` 1600 px                                                                                                                  | O plano não define valores; escolhidos como ponto de partida (mudar não quebra nada: só `up()`/`down()` usam)                                                                                                                                                            |
| 4   | `check-tokens` trata `var('--shy-' + x)` de template como prefixo dinâmico                                                                                                                       | Evita falso "token não definido" nas páginas do showcase                                                                                                                                                                                                                 |
| 5   | Sombras (`--shy-shadow-1…5`) ficam em `semantic-dark/light.css` (não em `primitives.css`)                                                                                                        | Mudam por tema (plano 7.4)                                                                                                                                                                                                                                               |
| 6   | Pares de contraste: 100 (texto, muted, subtle, foco, borda de controle, `on-X`/`X`, `X-text` em `bg`/`surface`/`raised`, `on-X-soft`/`X-soft`, `X-text`/`X-soft`, `neutral-soft`, `scrim-panel`) | Todos passam com os valores do plano 7.1; nenhum token precisou ser ajustado                                                                                                                                                                                             |
| 7   | `scripts/_shared.mjs` (utilitários dos checks) e `README` dos dois pacotes atualizados                                                                                                           | Código dividido entre scripts; mudança de uso/API                                                                                                                                                                                                                        |
| 8   | Node do ambiente é 22.22.0 (o repo pede 24.14.1) e npm 10.9.4 (o repo pede 11.11.0)                                                                                                              | `npm i` com npm 10 falhou (`edgesOut` no arborist); as devDependencies foram instaladas com `npx npm@11.11.0 i -D vitest@^4 happy-dom`, então o lock segue o npm 11                                                                                                      |

### Licença das fontes (conferida em 2026-10-20)

- JetBrains Mono: OFL 1.1, copyright "2020 The JetBrains Mono Project Authors" (repositório oficial JetBrains/JetBrainsMono; pacote `@fontsource-variable/jetbrains-mono@5.3.0` com `license: OFL-1.1` e o mesmo texto).
- Inter: OFL 1.1, copyright "2016 The Inter Project Authors" (repositório rsms/inter). **"Inter" é Reserved Font Name.** Os `woff2` são o subset latin do Fontsource (o mesmo tratamento que o Google Fonts dá); o texto da OFL acompanha. Risco residual: se o subset for considerado "versão modificada", a OFL exigiria outro nome. Prática de mercado é aceitar; se quiser risco zero, usar só JetBrains Mono (sem RFN).
- Obrigações cumpridas: texto da OFL junto dos arquivos; fonte não vendida isoladamente.
- Fonte da conferência: buscas web em 2026-10-20; o acesso direto às páginas oficiais está bloqueado neste ambiente (proxy), então a conferência é do texto da licença nos pacotes e de resultados de busca. Recomendo você abrir a página de cada fonte uma vez.

### ADR-F1-6. Inter removida; só JetBrains Mono (2026-10-20, decisão do dono)

- **Decisão:** "risco zero" de licença. "Inter" é Reserved Font Name e o `woff2` é subset do Fontsource, então foi retirada do pacote (arquivos, `@font-face`, `OFL.txt`).
- **Efeito:** `--shy-font-family-sans` passa a ser só a stack do sistema (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`); o toggle de fonte do showcase compara JetBrains Mono com "System sans". Orçamento de fontes: 40 KB. Esta ADR substitui o item sobre Inter da ADR-F1-2 e a seção "Licença das fontes" da ADR-F1-5 (a parte do JetBrains Mono continua valendo: OFL 1.1, sem Reserved Font Name).
