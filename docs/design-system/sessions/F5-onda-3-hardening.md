# F5 Onda 3 e hardening

Fonte: plano mestre seção 12 (Onda 3 sob demanda, Onda 4 opcional) e seção 17 (qualidade). Onda 3 só entra no que algum projeto Shyland realmente precisa: **pergunte ao dono o que priorizar antes de implementar** (decisão do dono, não do `/build`).

---

## F5-S1: seleção da Onda 3 + primeiro lote

**Escopo**: o Claude lista os componentes candidatos (Tabs, Accordion, Breadcrumb, Pagination, Stepper, Avatar, Table, List, EmptyState, AppShell, Combobox, Slider, FileDropzone), pergunta quais os projetos usam e propõe a ordem. Implementa o primeiro lote (sugestão: Tabs, Accordion, Breadcrumb, Pagination) com o contrato comum.

**Gate**: ARIA/teclado APG por componente (tabs: setas/Home/End; accordion: botões com `aria-expanded`).

**Commit proposto**: `feat(ui): tabs, accordion, breadcrumb e pagination`

## F5-S2: segundo lote da Onda 3

**Escopo**: Avatar, EmptyState, List, Table (sem virtualização; ordenação e seleção opcionais), mais o que o dono priorizou. Mesmos gates.

**Commit proposto**: `feat(ui): avatar, empty-state, list e table`

## F5-S3: terceiro lote da Onda 3 (sob demanda)

**Escopo**: Combobox, Slider, FileDropzone, Stepper, AppShell conforme prioridade. Pode ser pulada ou dividida se o dono não precisar.

**Commit proposto**: `feat(ui): <componentes entregues>`

## F5-S4: hardening e fechamento

**Escopo**

- Auditoria de acessibilidade (WCAG 2.2 AA) em todos os componentes: teclado, foco, contraste, reduced-motion, forced-colors; relatório em `docs/design-system/accessibility.md`.
- Orçamento de tamanho (bundle da lib e CSS) e `check-fonts`; `check:ds` completo; `npm audit` sem novidade vinda da lib.
- Docs finais: `docs/design-system/` coerente com o plano; `CHANGELOG`; guia de migração completo `0.0 → 0.1`; README.
- Decisão do dono (alto impacto): fechar o `0.1.0` e/ou rumo ao `1.0.0`. **Bump, tag e publish somente por pedido explícito.** Ler `.github/workflows/publish.yml` e `.github/scripts/publish-pkg.sh` antes de mexer em versão.
- Remoção de APIs depreciadas só se for uma major (registrar no changelog).

**Commit proposto**: `docs: auditoria de acessibilidade, changelog e fechamento do design system`
