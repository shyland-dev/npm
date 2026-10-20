# Regras do repositório shyland-dev/npm

Contexto: SHYLAND DEV LTDA. Não misturar com outros contextos do dono (CLT, pessoal).
Plano mestre: docs/DESIGN-SYSTEM-PLAN.md (fonte da verdade). Execute UMA fase por vez e pare no gate.
Estado atual do trabalho: docs/design-system/progress.md.

## Comando /build

Quando o dono mandar só `/build` (no Claude CLI ou numa thread do projeto), significa "avance o Design System para o próximo passo".
Não confundir com `npm run build` (build das libs), que continua sendo só um script de verificação.

Fluxo de cada `/build`:

1. Ler este arquivo, docs/DESIGN-SYSTEM-PLAN.md e docs/design-system/progress.md. Conferir `git status` e a branch (`feat/design-system`).
2. Agir conforme o "Estado" registrado em progress.md:

| Estado             | O que o /build faz                                                                                                                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `planejar`         | Escreve o plano da fase (tarefas, arquivos, decisões em aberto), registra em progress.md, muda o estado para `aguardando-plano` e para.                                                                                                            |
| `aguardando-plano` | Trata o /build como aprovação do plano. Muda para `executando` e implementa a fase inteira.                                                                                                                                                        |
| `executando`       | Continua a fase do ponto onde parou (tarefas abertas em progress.md).                                                                                                                                                                              |
| `aguardando-gate`  | Trata o /build como aprovação do gate **e** da mensagem de commit proposta: commita, faz push em `feat/design-system`, marca a fase como concluída, avança para a próxima fase em `planejar` e já mostra o plano dela (estado `aguardando-plano`). |

3. Ao fim da execução de uma fase: rodar as verificações (seção abaixo), escrever o relatório do gate em progress.md, propor a mensagem de commit, mudar o estado para `aguardando-gate` e parar.

Regras do /build:

- Qualquer mensagem diferente de `/build` é ajuste ou feedback: aplicar, atualizar progress.md e parar no mesmo estado (o próximo /build segue dali).
- `/build status`: só mostra o estado atual e o próximo passo, sem executar nada.
- `/build F<N>`: muda o foco para a fase N (pede confirmação se pular gate pendente).
- Decisão de alto impacto (segurança, custo, arquitetura, API pública, compatibilidade) que o plano não cobre: parar, comparar alternativas, recomendar uma e esperar a resposta. O /build seguinte sem resposta NÃO aprova a decisão; pergunte de novo.
- Atualizar progress.md a cada tarefa concluída, para que uma sessão nova consiga retomar sem contexto.
- Uma sessão nova sempre retoma por progress.md; nunca reconstruir estado de memória.

## REGRA ABSOLUTA DE UNIDADES

- TODA unidade de comprimento em CSS usa calc(var(--shy-responsive-unit) \* N): padding, margin, gap, font-size,
  letter-spacing, border-width, outline, box-shadow, border-radius, width/height/min/max, inset, translate, etc.
- Proibido fora de exceção: px, rem, em, vw, vh, vmin, vmax, dvw, dvh, svw, svh, lvw, lvh, ch, ex, cap, lh, rlh, pt, pc, cm, mm, in, cq\*.
- Exceções permitidas: (E1) tokens/units.css; (E2) condições de @media/@container em \_breakpoints.scss;
  (E3) valores que não são comprimento: 0, %, fr, números puros, ms/s, deg, auto/none; (E4) atributos SVG/HTML fora de CSS.
- SCSS: use ru(N). TypeScript: use o helper ru(n); nunca style.width = '12px'.
- npm run check:ds (check-units + check-calibration) deve passar.
- --responsive-unit e $responsive-unit estão DEPRECIADOS (alias até a 1.0.0). Nunca usar em código novo; ao tocar num arquivo que os use, trocar por --shy-responsive-unit / ru(N). Passo a passo na seção 6.5 do plano.

## Logos

- Os SVGs de logo são só referência de cor. NÃO adicionar logos, assets de marca ou favicon derivado deles na lib.

## Idioma e commits

- Commits em português do Brasil, Conventional Commits (feat, fix, chore, docs, refactor, test, build, ci, perf, style).
- Título curto e objetivo; corpo opcional explicando o impacto. Nunca commits em inglês.
- Pedir confirmação antes de criar commit (no fluxo /build, o /build no estado `aguardando-gate` é essa confirmação).
- Trabalhar só na branch feat/design-system; nunca commitar direto na prod.
- Push: permitido SOMENTE em `feat/design-system`, logo após o commit de um gate aprovado (decisão do dono em 2026-10-20, porque as sessões em nuvem são temporárias). Nunca push na prod nem force push.
- NUNCA publish no npm, tag ou bump de versão sem pedido explícito.
- Atualizar README.md no mesmo trabalho quando mudar uso, API, scripts ou build; se não precisar, dizer isso no resumo.
- Ao final de cada tarefa: resumo curto com arquivos principais e efeito prático.

## Dependências

- ZERO dependências de runtime (nada em dependencies/peerDependencies além de Angular).
- Sem @angular/cdk, Material, Tailwind, Storybook, libs de ícone/fonte via npm.
- devDependencies só para teste e somente o necessário; justificar no resumo.

## Código

- Angular 21: standalone, OnPush, input()/output()/model(), inject(), compatível com zoneless. Sem @angular/animations.
- Cores, medidas, fontes e motion SOMENTE via tokens CSS --shy-\*. Nenhum literal de cor, unidade ou tempo em SCSS de componente.
- CSS custom properties em kebab-case com prefixo --shy-.
- Propriedades CSS lógicas (inline/block) por padrão.
- Todo componente interativo: estados do contrato (hover só com @media (hover: hover), focus-visible, active, disabled, loading, invalid), teclado e ARIA conforme APG, testes, página no showcase.
- Respeitar prefers-reduced-motion e forced-colors; funcionar nos temas dark (padrão) e light.
- Simples e legível: sem abstração, refactor ou dependência sem benefício concreto. Identificar a causa antes de corrigir.

## Segurança

- Nunca expor tokens, chaves ou credenciais. Não ler nem commitar .env/segredos.
- Não executar operações destrutivas (rm -rf, reset --hard, force push, deletar branches, sed -i em lote) sem autorização explícita; antes, explicar o efeito e conferir git status limpo.
- Ler .github/workflows/publish.yml e .github/scripts/publish-pkg.sh antes de tocar em versão/publicação.

## Verificações antes de concluir qualquer fase

- npm run check:ds, testes, npm run build, npm run build:showcase. Se algo não pôde rodar, dizer qual e por quê.
- Node 24.14.1 (.nvmrc). Se o ambiente tiver outra versão, registrar no relatório.
- Informações que mudam (Angular, specs web, licença de fonte): confirmar na documentação oficial e citar fonte e data no resumo.
