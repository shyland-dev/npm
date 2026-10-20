# Progresso do Design System

Arquivo de estado lido pelo comando `/build` (ver CLAUDE.md). Atualizado a cada tarefa concluída.

## Estado atual

- Fase: **F0 Preparação**
- Estado: `aguardando-gate` (F0 commitada em 3e647b9 e enviada; falta o próximo `/build` para fechar o gate)
- Branch: `feat/design-system`
- Próximo `/build`: aprova o gate F0 e a mensagem de commit abaixo, commita, faz push em `feat/design-system` e mostra o plano da F1.
- Decisões pendentes que o `/build` **não** aprova: ADR-F0-1 (exports `./styles/*` e `_global.scss`) e ADR-F0-2 (devDependencies `vitest` + `happy-dom`). Ver `decisions.md`.

## Fases

| Fase                               | Status          | Commit |
| ---------------------------------- | --------------- | ------ |
| F0 Preparação                      | aguardando gate |        |
| F1 Unidades, tokens, temas, fontes | pendente        |        |
| F2 Refactor dos existentes         | pendente        |        |
| F3 Onda 1                          | pendente        |        |
| F4 Onda 2                          | pendente        |        |
| F5 Onda 3 + hardening              | pendente        |        |

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
