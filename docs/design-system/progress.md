# Progresso do Design System

Arquivo de estado lido pelo comando `/build` (ver CLAUDE.md). Atualizado a cada tarefa concluída.

## Estado atual

- Fase: **F1 Unidades, tokens, temas, fontes**
- Estado: `aguardando-gate`
- Branch: `feat/design-system`
- F1 executada (T1–T11); relatório do gate abaixo. O próximo `/build` aprova o gate **e** a mensagem de commit proposta, commita, faz push em `feat/design-system` e avança para a F2 em `aguardando-plano`.

## Fases

| Fase                               | Status                    | Commit                                                        |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------- |
| F0 Preparação                      | concluída (gate aprovado) | 3e647b9, aa431bb, 65d080f, c25ef8d, 979bdf6 (só documentação) |
| F1 Unidades, tokens, temas, fontes | executando                |                                                               |
| F2 Refactor dos existentes         | pendente                  |                                                               |
| F3 Onda 1                          | pendente                  |                                                               |
| F4 Onda 2                          | pendente                  |                                                               |
| F5 Onda 3 + hardening              | pendente                  |                                                               |

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
