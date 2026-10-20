# Progresso do Design System

Arquivo de estado lido pelo comando `/build` (ver CLAUDE.md). Atualizado a cada tarefa concluída.

## Estado atual

- Fase: **F1 Unidades, tokens, temas, fontes**
- Estado: `aguardando-plano`
- Branch: `feat/design-system`
- Próximo `/build`: aprova o plano da F1 abaixo (tarefas T1–T11) e o executa, **somente depois** que o dono responder às decisões D-F1-1 a D-F1-3. Um `/build` sem resposta a elas NÃO as aprova.

## Fases

| Fase                               | Status                     | Commit                                                        |
| ---------------------------------- | -------------------------- | ------------------------------------------------------------- |
| F0 Preparação                      | concluída (gate aprovado)  | 3e647b9, aa431bb, 65d080f, c25ef8d, 979bdf6 (só documentação) |
| F1 Unidades, tokens, temas, fontes | plano aguardando aprovação |                                                               |
| F2 Refactor dos existentes         | pendente                   |                                                               |
| F3 Onda 1                          | pendente                   |                                                               |
| F4 Onda 2                          | pendente                   |                                                               |
| F5 Onda 3 + hardening              | pendente                   |                                                               |

## F1: plano (2026-10-20)

Escopo do plano mestre (seção 16): `styles/` (6.2), `units.css` + `ru()` + helper TS, `ThemeService` + toggle, `fonts.css` + arquivos, base/motion/animations, scripts da seção 15, showcase `/foundations/*`. Entram também as decisões já aprovadas: exports `./styles/*` + `_global.scss` (ADR-F0-1), `vitest` + `happy-dom` (ADR-F0-2), camadas `z()` (ADR-F0-7, só tokens e função; a promoção de overlays é da F4) e os tokens da ADR-F0-9. Sem bump de versão (o `0.1.0` é ao fechar a F2).

### Tarefas

| #   | Tarefa                                                                                                                                                                                                                                                         | Arquivos principais                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| T1  | Unidades: `--shy-responsive-unit` (+ alias depreciado `--responsive-unit`), `--shy-dynamic-*`; `ru()` em SCSS; helper `ru(n)` em TS exportado; `_breakpoints.scss` (único lugar com px, em condição de `@media`)                                               | `styles/tokens/units.css`, `styles/_functions.scss`, `styles/_breakpoints.scss`, `src/lib/utils/ru.ts`            |
| T2  | Tokens: primitivos (7.1), semânticos escuro (padrão) e claro com os tokens novos (`line`, `neutral-soft`, `scrim-panel`), tipografia, espaço/raio/tamanho/borda/foco (7.2–7.3), sombras, `layers.css` + `_layers.scss` (`z()`), `motion.css`, `animations.css` | `styles/tokens/*.css`, `styles/_layers.scss`, `styles/animations.css`                                             |
| T3  | `base.css` (reset moderno, foco, seleção, scrollbar, forced-colors, `font-family` nunca só `monospace`) e `index.css` (um `@import` por arquivo); `_mixins.scss` (focus-ring, state, motion, visually-hidden) e `_index.scss`; `_global.scss` para Sass        | `styles/base.css`, `styles/index.css`, `styles/_mixins.scss`, `styles/_index.scss`, `styles/_global.scss`         |
| T4  | Fontes self-hosted: `fonts.css` (`font-display: swap`, `unicode-range`) + `woff2` + `OFL.txt` (decisão D-F1-2)                                                                                                                                                 | `src/libs/ui/src/assets/fonts/**`, `styles/fonts.css`                                                             |
| T5  | Empacotamento: `ng-package.json` com assets `.css`/`.woff2`; `package.json` do ui com `exports` `./styles/*`; conferir o pacote buildado com um consumidor simulado (como na F0)                                                                               | `src/libs/ui/ng-package.json`, `src/libs/ui/package.json`                                                         |
| T6  | `ThemeService` (`dark\|light\|system`, padrão `dark`, `localStorage`, `matchMedia`, `data-theme`, `meta theme-color`, guarda SSR), `provideShyTheme`, `shy-theme-toggle`, script anti-flash documentado                                                        | `src/lib/services/theme/*`, `src/lib/components/theme-toggle/*`, `public-api.ts`                                  |
| T7  | Scripts Node puro: `check-units`, `check-calibration`, `check-tokens`, `check-contrast` (+ `contrast-pairs.json`), `check-hardcoded`, `check-fonts`, `check-ds`; script npm `check:ds`                                                                         | `scripts/*.mjs`, `scripts/contrast-pairs.json`, `package.json` (só `scripts`)                                     |
| T8  | Testes: devDependencies `vitest` (^4) e `happy-dom`; target `test` (`@angular/build:unit-test`) em `ui`; `setupFiles` com stubs da Popover API; testes de `ru()`, `ThemeService` e do toggle; script npm `test`                                                | `package.json` (devDependencies), `angular.json`, `src/libs/ui/src/test-setup.ts`, `*.spec.ts`                    |
| T9  | Migração mínima dos usos depreciados internos (`$responsive-unit`/`--responsive-unit` → `ru()`/`--shy-responsive-unit`) em select, snackbar e showcase, só o necessário para `check-units` passar; o redesenho é da F2                                         | `select.component.scss`, `snackbar.component.scss`, `src/apps/styles.scss`, `app.scss`, `home.scss`, `icons.scss` |
| T10 | Showcase: `angular.json > styles` com `index.css`; shell com toggle de tema/motion/fonte; páginas `/foundations/colors`, `typography`, `units` (tabela por viewport), `spacing`, `motion`, `layers`; tudo em ru                                                | `src/apps/app/**`, `angular.json`                                                                                 |
| T11 | Docs: `docs/design-system/{principles,tokens,units,theming,motion,accessibility,migration-0.0-to-0.1}.md`; README raiz e `src/libs/ui/README.md` (consumo do CSS, `ThemeService`, `ru()`, `check:ds`, `test`)                                                  | `docs/design-system/*.md`, `README.md`, `src/libs/ui/README.md`                                                   |

### Gate da F1 (todos obrigatórios)

`npm run check:ds` verde (incluindo `check-units` e `check-calibration`); `npm test`, `npm run build` e `npm run build:showcase` verdes; temas sem flash; contraste ok nos dois temas; zero unidade proibida (exceto a baseline da D-F1-1); relatório com arquivos principais, efeito prático e decisões; mensagem de commit proposta (pt-BR); parar.

### Decisões em aberto (alto impacto: o `/build` NÃO as aprova)

| #      | Decisão                                                                                                                                                                                                                                                                                                                                                                                                                                               | Recomendação                                                                                                                                                                                      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-F1-1 | O `icon.component.scss` usa `1em` (5 linhas), unidade proibida, mas é o jeito de o ícone acompanhar o `font-size` de quem o usa; trocar por tamanho em ru é breaking e pertence ao refactor do ícone (F2). Como o gate da F1 exige zero unidade proibida: (a) fixar uma **baseline** `scripts/units-baseline.json` só com esse arquivo, que a F2 esvazia (o gate da F2 exige baseline vazia); (b) refatorar o ícone já na F1, adiantando parte da F2. | (a): F1 fica só em fundação e o breaking do ícone entra junto do refactor, com a troca documentada.                                                                                               |
| D-F1-2 | Origem dos arquivos de fonte (D4: self-hosted, OFL incluída): (a) eu baixo **uma vez** os `woff2` variáveis latin dos pacotes oficiais `@fontsource-variable/jetbrains-mono` e `@fontsource-variable/inter` (OFL, não viram dependência: só os arquivos e o texto da licença são copiados para o repo); (b) você baixa de fonts.google.com ou gwfh.mranftl.com como na seção 18 do plano e coloca no repo.                                            | (a): já validei que o pacote entrega `woff2` latin (JetBrains Mono: 40 KB) com o texto da OFL; confiro o orçamento (≲ 150 KB) e o `OFL.txt` com a página oficial de cada fonte antes de commitar. |
| D-F1-3 | O que fazer com `_variables.scss` (paleta Ionic `$color-*`, `$responsive-unit`, `$dynamic-*`), que é API publicada em `@shyland-dev/ui/styles`: (a) manter como shim `@deprecated` no `_index.scss` até a `1.0.0` (política de depreciação da seção 6.5), sem uso interno depois da F2; (b) remover já no `0.1.0`, permitido em `0.x` (D6), com nota de migração.                                                                                     | (a): custo zero para consumidores atuais e alinhado à política do plano; a remoção fica registrada para a `1.0.0`.                                                                                |

### Premissas desta fase

- O helper TS fica em `src/libs/ui/src/lib/utils/ru.ts`, exportado pelo entrypoint principal (`@shyland-dev/ui`).
- `check-calibration` assume `rem` = 16 px (ADR-F0-6) e roda nos 7 viewports de referência; os valores iniciais da escala vêm da seção 7.2 do plano.
- `check-contrast` lê os hex dos CSS e os pares de `scripts/contrast-pairs.json`, incluindo os pares novos da ADR-F0-9.
- Node do ambiente de nuvem é 22.22.0; os scripts não dependem de recursos exclusivos do Node 24.

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
- 2026-10-20: `/build` no estado `aguardando-gate`: gate da F0 aprovado (commits só de documentação, já enviados). F1 passou para `planejar` → plano escrito acima, estado `aguardando-plano`, com 3 decisões de alto impacto em aberto (D-F1-1 a D-F1-3).
