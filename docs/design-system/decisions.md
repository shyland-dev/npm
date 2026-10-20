# Decisões do Design System

Registro de premissas, exceções e decisões curtas (ADR). Fonte: `docs/DESIGN-SYSTEM-PLAN.md` (rev. 4).
Alterar uma linha daqui exige decisão do dono e atualização do plano no mesmo commit.

## Decisões fechadas (D1–D9)

Ver seção 2.1 do plano. Resumo: zero dependências de runtime (D1), tokens `--shy-*` em kebab-case (D2), gradiente `#4C00FF → #5F00D9` e tema escuro padrão (D3), fontes self-hosted (D4), showcase sem Storybook (D5), API pode quebrar em `0.x` (D6), logos fora da lib (D7), regra absoluta de unidades (D8), `--responsive-unit` depreciado até a `1.0.0` (D9).

## Premissas (P1–P6)

| #   | Premissa                                                                                                                                                                             | Status                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| P1  | Fórmula do ru inalterada: `calc(0.1rem + 0.1vmin)`. Nome canônico `--shy-responsive-unit`; `--responsive-unit` e `$responsive-unit` são alias depreciados até a `1.0.0` (seção 6.5). | Decidida (D9)                                                     |
| P2  | Fonte padrão da UI = mono (JetBrains Mono); Inter disponível por token para texto corrido.                                                                                           | Assumida; ver achado F0-6 (a pilha nunca pode ser só `monospace`) |
| P3  | Primeira release do refactor = `0.1.0` (breaking); bump minor por onda; `1.0.0` só com o checklist da F5 verde. Bump só a pedido.                                                    | Assumida                                                          |
| P4  | Só devDependencies de teste; nada em `dependencies`/`peerDependencies` além do Angular. Sem axe, Playwright, Storybook.                                                              | Assumida; runner proposto em ADR-F0-2 (aguarda aprovação)         |
| P5  | Angular 21: standalone, `OnPush`, `input()`/`output()`/`model()`, `inject()`, compatível com zoneless.                                                                               | Assumida                                                          |
| P6  | Propriedades lógicas de CSS (`margin-inline`, `padding-block`, `inset-inline`) por padrão.                                                                                           | Assumida                                                          |

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
