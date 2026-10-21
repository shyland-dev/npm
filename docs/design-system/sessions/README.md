# Sessões do Design System (F3 a F5)

Cada fase restante foi dividida em **sessões curtas**, cada uma cabendo numa sessão do Claude sem estourar o contexto. Uma sessão = um ciclo `/build` completo (plano → execução → gate → commit + push).

## Como rodar uma sessão

1. Abra uma sessão nova do Claude no projeto (repo `shyland-dev/npm`, branch `feat/design-system`).
2. Envie `/build status`: mostra a sessão atual e o próximo passo (lido de `docs/design-system/progress.md`).
3. Envie `/build`:
    - estado `aguardando-plano`: aprova o plano da sessão (já escrito no arquivo da fase) e executa;
    - ao fim, o Claude roda as verificações, escreve o relatório do gate em `progress.md`, propõe a mensagem de commit e para em `aguardando-gate`;
    - `/build` seguinte: aprova o gate **e** a mensagem, commita, faz push em `feat/design-system` e avança para a próxima sessão em `aguardando-plano`.
4. Pode encerrar a sessão do Claude depois do push. A próxima sessão retoma só por `progress.md`.

Decisões de alto impacto (API pública, arquitetura, segurança, compatibilidade) continuam exigindo resposta explícita; o `/build` não as aprova.

## Leitura obrigatória de toda sessão (nesta ordem)

1. `CLAUDE.md` (regras, unidades, `/build`).
2. `docs/design-system/progress.md` (estado, sessão atual, relatórios anteriores).
3. O arquivo da fase (`F3-onda-1.md`, `F4-onda-2.md` ou `F5-onda-3-hardening.md`), só a sessão atual.
4. `docs/DESIGN-SYSTEM-PLAN.md`: seção 11 (convenções e checklist 11.3), seção 12 (catálogo da onda) e as seções citadas na sessão.
5. `docs/design-system/decisions.md` (ADRs vigentes) e `tokens.md`.

## Contrato comum (vale para toda sessão de componente)

- Angular 21 standalone, OnPush, `input()`/`output()`/`model()`, `host: {}`, compatível com zoneless, guardas de SSR.
- Tokens de componente `--shy-<comp>-*` com fallback no semântico (`--_x: var(--shy-<comp>-x, var(--shy-color-…))`). Nenhum literal de cor, unidade ou tempo no SCSS. Unidades só `ru(N)`; lógicas inline/block.
- Contrato de estados: hover só em `@media (hover: hover)`, `:focus-visible`, active, disabled, loading, invalid. `prefers-reduced-motion` e `forced-colors`.
- Formulários: `ControlValueAccessor` (Forms clássicos e signals), ids únicos por contador, ARIA conforme APG.
- Cada componente entrega: `.ts/.html/.scss`, `.spec.ts`, página no showcase (`components/<nome>`, matriz de estados nos dois temas), tabela de tokens no `src/libs/ui/README.md`, export em `public-api.ts`.
- Checklist visual (lições do plano 11.3): botão com `background: transparent` quando sem fundo; padding lateral mínimo `--shy-space-6` no estado loading; texto sobre scrim usa `scrim-panel`; chips/conectores usam `neutral-soft`/`line`.
- Dependências: zero de runtime; nenhuma devDependency nova sem justificar no gate.

## Verificação de cada gate

```bash
# bash / WSL Ubuntu, na raiz do repo
npm run check:ds && npm test && npm run build && npm run build:showcase
```

Container em nuvem: Node 22 e npm 10 (o repo pede Node 24.14.1); se `npm i` quebrar use `npx npm@11.11.0 i -D <pacote>`. Registrar a versão de Node no relatório. Se algo não puder rodar, dizer qual e por quê.

## Regras de git de cada gate

- Commit em pt-BR, Conventional Commits, mensagem proposta no relatório e confirmada pelo `/build`.
- Push só em `feat/design-system` (sem force). Sem bump, tag ou publish sem pedido explícito.
- README atualizado no mesmo trabalho (ou o relatório diz que não precisou).
- Nunca rodar `prettier --write` em `src/libs/ui/src/assets`, `icons.ts`, `src/apps/index.html`, `tsconfig.app.json`, `angular.json` (revert com `git checkout --`).

## Índice

| Fase | Arquivo                                          | Sessões |
| ---- | ------------------------------------------------ | ------- |
| F3   | [F3-onda-1.md](F3-onda-1.md)                     | S1 a S6 |
| F4   | [F4-onda-2.md](F4-onda-2.md)                     | S1 a S6 |
| F5   | [F5-onda-3-hardening.md](F5-onda-3-hardening.md) | S1 a S4 |
