# Princípios do Design System

Fonte da verdade: [`../DESIGN-SYSTEM-PLAN.md`](../DESIGN-SYSTEM-PLAN.md). Este arquivo resume o que um componente precisa respeitar.

1. **Uma unidade só.** Toda medida é `calc(var(--shy-responsive-unit) * N)` (ver [units.md](units.md)). `npm run check:ds` falha com qualquer outra.
2. **Tokens em três camadas.** Primitivo (`--shy-primary-600`), semântico (`--shy-color-text`, muda com o tema) e de componente (`--shy-button-bg`, definido no próprio componente a partir dos semânticos). SCSS de componente não tem literal de cor, unidade, tempo, easing nem z-index.
3. **Escuro é o padrão.** Claro e sistema são escolha do usuário ([theming.md](theming.md)). Todo componente funciona nos dois.
4. **Zero dependências de runtime.** Só os peers do Angular. Nada de CDK, Material, Tailwind, Storybook ou fonte/ícone via npm.
5. **Angular 21 moderno.** Standalone, `OnPush`, `input()`/`output()`/`model()`, `inject()`, compatível com zoneless. Sem `@angular/animations` ([motion.md](motion.md)).
6. **Acessível por contrato.** WCAG 2.2 AA: contraste, teclado, ARIA conforme APG, `prefers-reduced-motion`, `forced-colors` ([accessibility.md](accessibility.md)).
7. **Estados padronizados.** hover só com `@media (hover: hover)`, `:focus-visible`, active, disabled, loading, invalid. Use `@include shy-state(...)` para a matriz do showcase.
8. **Propriedades lógicas** (`inline`/`block`) por padrão.
9. **API pública nunca some de uma vez.** Marcar `@deprecated` com o substituto, documentar a troca, fazer o `check:ds` falhar em uso interno e remover só na próxima major. (Exceção do `0.1.0`: sem alias, decisão de 2026-10-20.)
10. **Simples.** Sem abstração, refactor ou dependência sem benefício concreto.
