# Plano: Design System `@shyland-dev/ui` (SHYLAND DEV LTDA)

Data de referência: 2026-10-20 · Revisão 5 · Repo: `shyland-dev/npm` (monorepo `ui` + `utils`, Angular 21, `@shyland-dev/ui` v0.0.17)
Contexto: **SHYLAND DEV LTDA** (CNPJ). Não misturar com Midas (CLT) nem projetos pessoais.

**Mudanças da revisão 2:** (1) os SVGs de logo são **somente referência de cor**, não fazem parte da lib (removido `shy-logo`, `assets/brand`, favicon, página de logo); (2) **regra absoluta:** toda unidade de comprimento do CSS usa `--shy-responsive-unit` (seção 6.4). Isso substitui a premissa anterior de usar `rem`.

**Mudanças da revisão 3:** `--responsive-unit` (sem prefixo) deixa de ser "legado" e passa a ser **depreciado**: continua funcionando como alias até a `1.0.0`, com instruções de substituição por `--shy-responsive-unit` (seção 6.5). Instruções do projeto que mantém a lib em arquivo à parte (`PROJECT-INSTRUCTIONS.md`).

**Mudanças da revisão 5 (2026-10-20, decisão do dono):** nenhum alias sem prefixo sobrevive. `--responsive-unit`, `$responsive-unit`, `--dynamic-*`, `$dynamic-*` e `$color-*` saem no `0.1.0`; tudo passa a ter o prefixo `shy` (`--shy-*`). Isso **revoga a D9** e o alias da P1; a seção 6.5 vira guia de migração para os projetos consumidores. A política de depreciação da seção 6.5 vale a partir do `0.1.0`.

**Mudanças da revisão 4:** plano versionado em `docs/DESIGN-SYSTEM-PLAN.md` na branch `feat/design-system`; `CLAUDE.md` criado a partir da seção 17, com o comando `/build` (avança um passo por vez: plano → execução → gate → commit); estado das fases em `docs/design-system/progress.md`. O `PROJECT-INSTRUCTIONS.md` da revisão 3 foi descartado (as instruções viraram um prompt do projeto).

---

## 0. Como usar este arquivo

1. Copie este arquivo para `docs/DESIGN-SYSTEM-PLAN.md` na raiz do repo `shyland-dev/npm`.
2. Copie a **seção 17** para `CLAUDE.md` na raiz (regras permanentes que o Claude CLI lê em toda sessão).
3. Faça os pré-requisitos da **seção 18** (fontes dentro do repo).
4. Abra o Claude CLI na raiz do repo e use os prompts da **seção 19**, **uma fase por vez**.
5. Alternativa ao passo 4: mandar só `/build` (ver `CLAUDE.md`); o estado de cada fase fica em `docs/design-system/progress.md`.
6. Cada fase termina em um **gate**: o CLI para, mostra o resumo e espera sua aprovação antes de commitar/seguir. Nada de `git push`, publish no npm ou bump de versão sem você pedir.

---

## 1. Objetivo e escopo

Reescrever `@shyland-dev/ui` como um Design System completo, reutilizável em todos os projetos Angular da SHYLAND DEV:

- Tokens (cores, tipografia, espaçamento, forma, elevação, motion) como **CSS custom properties**.
- **Todas as medidas em `--shy-responsive-unit`** (seção 6.4).
- Tema **escuro por padrão**, **claro** e **sistema**, escolhido pelo usuário final em runtime.
- Paleta derivada da marca (gradiente violeta).
- Componentes novos e refatorados (`icon`, `select`, `snackbar` incluídos), **sem nenhuma dependência de runtime** além de `@angular/core`, `@angular/common` e `@angular/forms` (já peers do Angular).
- Contrato único de estados (hover, focus, active, disabled, loading, invalid...), transitions e animations tokenizadas, `prefers-reduced-motion` respeitado.
- Acessibilidade WCAG 2.2 AA como requisito, não como extra.
- Showcase documentando tudo, com testes e scripts de qualidade.

**Fora de escopo:** logos/assets de marca dentro da lib, Storybook, `@angular/cdk`, Angular Material, Tailwind, bibliotecas de ícones/fonts via npm, date-picker completo (opcional na onda 4).

---

## 2. Decisões fechadas e premissas

### 2.1 Decisões do Eduardo (fechadas)

| #   | Decisão                                                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **Zero dependências.** Tudo do zero: overlay, foco, teclado, posicionamento. Sem CDK.                                                                                                                              |
| D2  | CSS custom properties em **kebab-case** (`--shy-select-height`). Migrar tudo.                                                                                                                                      |
| D3  | Marca: gradiente violeta `#4C00FF → #5F00D9`. Tema padrão **escuro**; usuário pode escolher **claro** e **sistema**.                                                                                               |
| D4  | Fontes **self-hosted** dentro da lib.                                                                                                                                                                              |
| D5  | Showcase estendido ao máximo (sem Storybook).                                                                                                                                                                      |
| D6  | Pode **quebrar API** e reinventar a lib inteira (versão `0.x`).                                                                                                                                                    |
| D7  | **Os SVGs de logo são só referência de cores.** Não entram na lib.                                                                                                                                                 |
| D8  | **Regra absoluta:** toda unidade de CSS (padding, margin, font-size, border-width, box-shadow, height, width, gap, radius, outline, translate, letter-spacing...) usa `--shy-responsive-unit`.                     |
| D9  | **Revogada em 2026-10-20.** Antes: `--responsive-unit` depreciado com alias até a `1.0.0`. Agora: **sem alias**; `--responsive-unit` e demais nomes sem prefixo saem no `0.1.0`, com guia de migração (seção 6.5). |

### 2.2 Premissas assumidas (mude se discordar; o CLI registra em `docs/design-system/decisions.md`)

| #   | Premissa                                                                                                                                                                                                                   | Motivo                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| P1  | A fórmula do ru fica **exatamente** como hoje: `calc(0.1rem + 0.1vmin)`. O nome canônico passa a ser `--shy-responsive-unit` (prefixo `shy-`); `--responsive-unit` **deixa de existir** no `0.1.0` (sem alias; seção 6.5). | Prefixo evita colisão em apps consumidores; o dono prefere quebrar uma vez e migrar.     |
| P2  | Fonte padrão da UI = **mono** (identidade). Texto corrido: stack sans do sistema, por token (sem Inter: decisão de 2026-10-20, risco zero de licença).                                                                                                                          | Você gosta de mono; mono em parágrafos longos cansa.                                     |
| P3  | Primeira release do refactor = **`0.1.0`** (breaking). Cada onda concluída = bump minor. `1.0.0` só quando o checklist da Fase 5 estiver verde.                                                                            | Semver para `0.x`.                                                                       |
| P4  | Permitidas **apenas devDependencies de teste**. Nada em `dependencies`/`peerDependencies`. Sem axe, Playwright, Storybook.                                                                                                 | "Zero dependências" = runtime. O CLI confirma qual test runner o Angular 21 usa no repo. |
| P5  | Componentes no padrão Angular 21: standalone, `OnPush`, signals (`input()`, `output()`, `model()`), `inject()`, compatível com zoneless.                                                                                   | O código atual usa `@Input`/`EventEmitter`/construtor.                                   |
| P6  | Propriedades **lógicas** de CSS (`margin-inline`, `padding-block`, `inset-inline`) por padrão.                                                                                                                             | Custo zero agora; RTL/i18n depois.                                                       |

---

## 3. Diagnóstico do código atual (lido em 2026-10-15)

| Achado                                                                                                                                                                    | Onde                         | Ação                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| Tokens só em SCSS (`$color-primary: #3880ff` etc., paleta Ionic)                                                                                                          | `styles/_variables.scss`     | Substituir por tokens CSS (seção 7); remover paleta Ionic           |
| Já usa `calc(var(--responsive-unit) * N)` nos componentes (**bom, é a regra**), mas com N soltos e sem escala nomeada; mistura `monospace`, `1000`, `250ms`, `50%`, `0.1` | `*.component.scss`           | Padronizar numa escala de tokens em ru (seção 7.3)                  |
| `--responsive-unit` sem prefixo                                                                                                                                           | `_variables.scss`            | `--shy-responsive-unit`; o antigo é removido no `0.1.0` (seção 6.5) |
| Customização por componente em camelCase (`--shySelectBackground`)                                                                                                        | select, snackbar, icon       | Migrar para `--shy-select-bg` etc. (seção 11.4)                     |
| Fonte `monospace` hardcoded                                                                                                                                               | select, snackbar, app styles | `--shy-font-family-*`                                               |
| `250ms ease-in-out` hardcoded                                                                                                                                             | select, snackbar             | `--shy-duration-*` / `--shy-ease-*`                                 |
| Cores e `px`/`rem` hardcoded no showcase                                                                                                                                  | `src/apps/styles.scss`       | Tokens + ru                                                         |
| Sem tema claro (existe mixin `dark-mode`, não usado)                                                                                                                      | `_mixins.scss`               | Sistema de temas (seção 6.3)                                        |
| Sem estados de foco/disabled/active; sem `:focus-visible`                                                                                                                 | todos                        | Contrato de estados (seção 8)                                       |
| `select`: `<li (click)>` sem `role`, sem teclado, sem `aria-expanded`, sem CVA; fecha só por clique fora                                                                  | `select.component.*`         | Reescrever (listbox APG, CVA)                                       |
| `snackbar`: depende de `#ref` no template + `SnackbarService.show({element})`; botão dismiss sem `aria-label`; sem `role="status"/"alert"`                                | `snackbar.component.*`       | Reescrever (outlet global, fila, variantes)                         |
| `@Input`/`@Output`/`EventEmitter`/`ChangeDetectorRef` no construtor                                                                                                       | select, snackbar             | Signals + `inject()`                                                |
| `z-index: 1000/9999` soltos                                                                                                                                               | select, snackbar             | Escala `--shy-z-*` + top layer nativo                               |
| Ícones: Bootstrap Icons gerados por `scripts/generate-icons.mjs` → `icons.ts`                                                                                             | `icon/`, `assets/svg/`       | Manter pipeline; refatorar componente                               |
| Estilos SCSS publicados via `assets` do ng-packagr (`src/lib/styles` → `./styles`)                                                                                        | `ng-package.json`            | Manter o mecanismo; adicionar `.css` de tokens e `fonts/`           |
| `.github/copilot-instructions.md`: commits em **pt-BR**, Conventional Commits, README atualizado junto                                                                    | `.github/`                   | Seguir à risca (seção 17)                                           |
| `engines.node 24.14.1`, `.nvmrc`, `npm@11.11.0`, workspaces `ui`/`utils`                                                                                                  | raiz                         | Respeitar                                                           |

---

## 4. Cores da marca (referência; sem logos na lib)

Os 4 SVGs recebidos (ícone, ícone em quadrado arredondado, horizontal, empilhado) serviram **apenas para extrair a cor**. **Não copiar para o repo.** Todos usam o mesmo gradiente diagonal: `#4C00FF` (início) → `#5F00D9` (fim).

- Token: `--shy-gradient-brand: linear-gradient(135deg, #4C00FF 0%, #5F00D9 100%)`.
- `#4C00FF` = `--shy-primary-600`; `#5F00D9` = `--shy-primary-700` (seção 7.1).
- Gradiente só em elementos decorativos/CTA com texto branco (branco sobre as duas pontas: 7,6:1 e 8,4:1). Nunca texto com gradiente sobre fundo escuro.
- O showcase **não exibe logo**. Cabeçalho com o texto "SHYLAND DEV" na fonte da marca.
- Favicon do showcase: um SVG simples e próprio (ex.: quadrado arredondado com o gradiente), sem reutilizar os arquivos de logo.

### Fato de contraste que muda o design (calculado em 2026-10-15)

`#4C00FF` sobre o fundo escuro do tema (`#070811`) tem **2,6:1**: falha em UI (mínimo 3:1) e em texto (4,5:1). Sobre branco tem 7,6:1.

- **Preenchimento** (botão, switch ligado): `#4C00FF` nos dois temas, com texto branco.
- **Texto, link, borda, anel de foco** sobre fundo escuro: escala **400** (`#818BFD`, 6,7:1), não a cor da marca.

---

## 5. Fontes

### 5.1 Recomendação

| Papel                        | Fonte                                         | Licença     | Observação                                       |
| ---------------------------- | --------------------------------------------- | ----------- | ------------------------------------------------ |
| UI, títulos, código (padrão) | **JetBrains Mono** (variável, `wght` 100–800) | SIL OFL 1.1 | Mono desenhada para leitura; ligaduras de código |
| Texto corrido (opcional)     | Stack sans do sistema (`system-ui`...)        | n/a         | Sem arquivo de fonte; Inter foi descartada por ser Reserved Font Name (2026-10-20) |
| Alternativas mono            | Geist Mono, IBM Plex Mono, Space Mono         | OFL         | Outra personalidade                              |

> O CLI confirma a licença na página oficial de cada fonte antes de incluir no pacote.

### 5.2 Onde baixar (gratuito, uso comercial liberado)

| Site                                          | Para quê                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **fonts.google.com**                          | Catálogo; filtre por licença. Quase tudo é OFL                                                            |
| **gwfh.mranftl.com** (google-webfonts-helper) | Baixa `woff2` por subset (`latin`) prontos para self-host                                                 |
| **fontsource.org**                            | Mesmos `woff2` por fonte/peso/subset (baixe direto, sem instalar pacote)                                  |
| **fontshare.com**                             | Licença própria (ITF Free): uso comercial ok, mas **não é OFL**; leia antes de redistribuir em pacote npm |

Correção de premissa: fonte "sem copyright" não existe; o que você quer é **licença livre que permita uso comercial e redistribuição**. A OFL permite embutir e redistribuir (inclusive no seu pacote npm), com duas obrigações: **incluir o texto da licença** junto dos arquivos e **não vender a fonte isoladamente**. Evite "free for personal use" (comum no dafont).

### 5.3 Estrutura de arquivos

```
src/libs/ui/src/assets/fonts/
  jetbrains-mono/
    JetBrainsMono-Variable.woff2      # subset latin (cobre á ã ç õ etc.)
    OFL.txt
```

- Só `woff2`. Subset `latin` basta para PT-BR (acentos em U+00C0–00FF). `latin-ext` só se algum app precisar.
- `font-display: swap`; `unicode-range` do subset; documentar `<link rel="preload" as="font" type="font/woff2" crossorigin>` para a fonte principal.
- `styles/fonts.css` com os `@font-face`. O CLI valida no showcase que `ng build showcase` emite as fontes e que a URL resolve.
- Orçamento: JetBrains Mono variável (latin) ≲ 150 KB. Se estourar, medir e decidir.

### 5.4 Stacks e regras

```css
--shy-font-family-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
--shy-font-family-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--shy-font-family-base: var(--shy-font-family-mono); /* troque para sans em um app */
--shy-font-family-code: var(--shy-font-family-mono);
```

- Ligaduras desligadas na UI (`font-feature-settings: 'calt' 0`) para `->`, `!=`, `==` não virarem glifos em texto comum; ligadas só em `code`/`pre`.
- `font-variant-numeric: tabular-nums` em tabelas e métricas.

---

## 6. Arquitetura de estilos, temas e unidades

### 6.1 Camadas de tokens

| Camada        | Exemplo                                                       | Quem usa                                           |
| ------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| 1. Primitivo  | `--shy-primary-600`                                           | Só a camada 2                                      |
| 2. Semântico  | `--shy-color-primary`, `--shy-color-surface`, `--shy-space-4` | Componentes e apps                                 |
| 3. Componente | `--shy-button-bg`, `--shy-button-height`                      | Override pontual; sempre com fallback ao semântico |

O app consumidor redefine **só os semânticos** para trocar de marca; o tema escuro/claro troca só a camada 2.

### 6.2 Estrutura de arquivos em `src/libs/ui/src/lib/styles/`

```
styles/
  index.css                 # @import de tudo abaixo (consumo simples)
  fonts.css                 # @font-face
  tokens/
    units.css               # ÚNICO lugar com unidade literal: --shy-responsive-unit, --shy-dynamic-height/width
    primitives.css          # escalas de cor + tipografia + espaço + raio + sombras + z + motion
    semantic-dark.css       # :root { ... }          (padrão)
    semantic-light.css      # :root[data-theme='light'] { ... }
    motion.css              # durações, easings, transitions, reduced-motion
    layers.css              # --shy-z-* (escala nomeada, ver 7.5)
  base.css                  # reset moderno, html/body, foco, seleção, scrollbar, forced-colors
  animations.css            # @keyframes shy-*
  _index.scss               # @forward 'functions', 'breakpoints', 'mixins'
  _functions.scss           # ru($n) => calc(var(--shy-responsive-unit) * $n)
  _breakpoints.scss         # ÚNICO lugar com px literal (condições de @media/@container)
  _layers.scss              # $layers, z($layer, $offset), shy-layer()
  _mixins.scss              # focus-ring, state, motion, visually-hidden...
```

- Tokens em **CSS puro** (sem Sass nem build step). SCSS só para função/mixins.
- Consumo no app Angular: `angular.json > styles` apontando para `node_modules/@shyland-dev/ui/styles/index.css`, ou `@import` no `styles.scss`. O CLI valida **os dois** no showcase e documenta o que funcionou.
- Remover `_variables.scss` (`$color-*`, `$responsive-unit`, `$dynamic-*`) no `0.1.0`, sem shim publicado (decisão 2026-10-20; ver 6.5). Sem nenhum alias (decisão 2026-10-20): `--responsive-unit` também sai. Os utilitários dvh/dvw viram `--shy-dynamic-height`, `--shy-dynamic-width` (mantêm `@supports` de `dvh/dvw`) e as `*-unit` derivadas.

### 6.3 Mecanismo de tema

- **CSS:** `:root` = escuro (padrão, também sem JS). `:root[data-theme='light']` = claro. `color-scheme: dark` / `light` em cada bloco (scrollbars, controles nativos e `<dialog>` seguem o tema).
- **`ThemeService`** (em `ui`): modos `'dark' | 'light' | 'system'`, padrão `'dark'`.
    - Persiste em `localStorage` (chave configurável).
    - Resolve `system` com `matchMedia('(prefers-color-scheme: light)')` e escuta mudanças.
    - Sempre grava `data-theme="dark|light"` (já resolvido) em `<html>` e `data-theme-mode` com o modo escolhido; atualiza `<meta name="theme-color">`.
    - Guarda SSR (`isPlatformBrowser`). Sinais `mode()`, `resolved()`; métodos `setMode()`, `toggle()`.
    - `provideShyTheme({ defaultMode, storageKey })`.
- **Sem flash:** documentar um script inline mínimo para o `<head>` do `index.html` que aplica o tema salvo antes do Angular carregar. Avisar sobre CSP (nonce/hash).
- **`shy-theme-toggle`** (segmentado: claro / sistema / escuro) usando o ThemeService.

### 6.4 REGRA ABSOLUTA: unidades

**Toda unidade de comprimento em CSS é `calc(var(--shy-responsive-unit) * N)`.** Vale para `padding`, `margin`, `gap`, `font-size`, `letter-spacing`, `border-width`, `outline-width`/`outline-offset`, `box-shadow` (offsets, blur, spread), `text-shadow`, `border-radius`, `width`/`height`/`min-*`/`max-*`, `inset`/`top`/`left`..., `translate()`, `scroll-padding`, `text-underline-offset`, `backdrop-filter: blur()`, medidas em `clamp()/min()/max()`, tudo.

Definição única (em `tokens/units.css`):

```css
:root {
    --shy-responsive-unit: calc(0.1rem + 0.1vmin);
    --shy-dynamic-height: 100vh;
    @supports (height: 100dvh) {
        --shy-dynamic-height: 100dvh;
    }
    --shy-dynamic-width: 100vw;
    @supports (width: 100dvw) {
        --shy-dynamic-width: 100dvw;
    }
    --shy-dynamic-height-unit: calc(var(--shy-dynamic-height) / 100);
    --shy-dynamic-width-unit: calc(var(--shy-dynamic-width) / 100);
}
```

#### Proibido em qualquer outro arquivo (CSS, SCSS, templates, `host.styles`, strings de estilo em TS)

`px`, `rem`, `em`, `vw`, `vh`, `vmin`, `vmax`, `svw/svh`, `lvw/lvh`, `dvw/dvh`, `ch`, `ex`, `cap`, `lh`, `rlh`, `pt`, `pc`, `cm`, `mm`, `in`, `cqw/cqh/cqi/cqb/cqmin/cqmax`.

#### Exceções mínimas (confirme)

| #   | Exceção                                                                                                                                                                                      | Por quê                                                                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| E1  | `tokens/units.css`                                                                                                                                                                           | É a definição do próprio ru e das unidades dinâmicas de viewport                                           |
| E2  | Condições de `@media`/`@container` (em `_breakpoints.scss`)                                                                                                                                  | O CSS **não permite `var()`/`calc` com custom property** em query; é tecnicamente impossível usar o ru ali |
| E3  | Valores que **não são comprimento**: `0`, `%`, `fr`, números puros (`line-height`, `opacity`, `z-index`, `flex`, `scale()`, `aspect-ratio`), tempo (`ms`/`s`), ângulo (`deg`), `auto`/`none` | Não são unidades de tamanho fixo. Se quiser vetar `%`/`fr`, diga                                           |
| E4  | Atributos de SVG/HTML fora do CSS (`viewBox`)                                                                                                                                                | Não são CSS; largura/altura do SVG ficam em CSS com ru                                                     |

#### Como escrever

- SCSS: `padding: ru(4) ru(6);` com `@function ru($n) { @return calc(var(--shy-responsive-unit) * #{$n}); }`. Negativo: `ru(-1)`.
- CSS puro (tokens): `--shy-space-4: calc(var(--shy-responsive-unit) * 4);`
- TypeScript (tamanho dinâmico): helper `ru(n)` exportado pela lib → `` `calc(var(--shy-responsive-unit) * ${n})` ``. Nunca `style.width = '120px'` nem `[style.width.px]`.
- Visually-hidden: `width: ru(0.5); height: ru(0.5); clip-path: inset(50%)` (sem `1px`).
- Borda fina: `--shy-border-width: calc(ru * 0.5)` (o navegador arredonda para pixel de dispositivo; ≈1px no celular, 1,3px em FHD).

#### Custo real da regra (medido; o CLI mostra a tabela no showcase)

`ru = 0.1rem + 0.1vmin` ≈ `1,6 px + (menor lado da janela)/1000` com `rem` padrão de 16 px.

| Viewport          | ru (px) | 1 ru | 6 ru | 7 ru | 8 ru | 14 ru | 18 ru | 22 ru |
| ----------------- | ------- | ---- | ---- | ---- | ---- | ----- | ----- | ----- |
| Celular 360×800   | 1,96    | 2,0  | 11,8 | 13,7 | 15,7 | 27,4  | 35,3  | 43,1  |
| Celular 390×844   | 1,99    | 2,0  | 11,9 | 13,9 | 15,9 | 27,9  | 35,8  | 43,8  |
| Tablet 768×1024   | 2,37    | 2,4  | 14,2 | 16,6 | 18,9 | 33,2  | 42,6  | 52,1  |
| Notebook 1366×768 | 2,37    | 2,4  | 14,2 | 16,6 | 18,9 | 33,2  | 42,6  | 52,1  |
| FHD 1920×1080     | 2,68    | 2,7  | 16,1 | 18,8 | 21,4 | 37,5  | 48,2  | 59,0  |
| QHD 2560×1440     | 3,04    | 3,0  | 18,2 | 21,3 | 24,3 | 42,6  | 54,7  | 66,9  |
| 4K 3840×2160      | 3,76    | 3,8  | 22,6 | 26,3 | 30,1 | 52,6  | 67,7  | 82,7  |

Consequências que a regra traz (aceitas; mitigadas no plano, sem quebrar a regra):

1. **Tamanho mínimo.** Qualquer valor em ru encolhe ~27% do FHD para o celular. Por isso a escala da seção 7 é calibrada para o **pior caso (360×800)** e um script (`check-calibration`) falha se o texto ficar < 12 px, o corpo < 14 px ou um controle < 24 px (WCAG 2.5.8) nesse viewport.
2. **UI grande em desktop.** Com corpo em 7,5 ru, o texto sai ≈ 20 px em FHD e ≈ 28 px em 4K. É consequência direta do ru; a página `/foundations/units` do showcase mostra os tamanhos reais para você ajustar a escala.
3. **Zoom do navegador (WCAG 1.4.4).** Ao dar zoom de 200%, a janela em px CSS diminui e o `vmin` encolhe junto: o texto cresce só ≈ **1,6× (FHD) a 1,8× (celular)**, não 2×. A parte `rem` do ru respeita a fonte configurada pelo usuário, mas uma auditoria estrita de 1.4.4 pode apontar isso. A regra foi mantida; o risco fica **documentado** em `accessibility.md`. Se um projeto exigir conformidade estrita, decidimos depois (ex.: modo de escala fixa por atributo) **com sua aprovação**; não implementar antes.

### 6.5 Remoção do `--responsive-unit` e dos nomes sem prefixo (guia de migração)

Status: **removidos no `0.1.0`, sem alias** (decisão do dono em 2026-10-20: tudo com o prefixo `shy`). A fórmula é a mesma (`calc(0.1rem + 0.1vmin)`); só o nome muda. Projetos que usam o nome antigo **quebram ao subir para o `0.1.0`** e devem migrar com os passos abaixo (o dono corrige os projetos consumidores).

| Item                         | Antes                                                                          | Agora                                                                                          | Prazo                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Variável CSS                 | `--responsive-unit`, `--dynamic-height`, `--dynamic-width`, `--dynamic-*-unit` | `--shy-responsive-unit`, `--shy-dynamic-height`, `--shy-dynamic-width`, `--shy-dynamic-*-unit` | **Removidas no `0.1.0`**, sem alias                                                                                                                                      |
| Variável SCSS                | `$responsive-unit`, `$dynamic-*` e `$color-*` (paleta Ionic)                   | função `ru(N)` e tokens `--shy-*`                                                              | **Removidas no `0.1.0`**, sem alias. `_variables.scss` fica como arquivo interno só durante a F1 e a F2 (select, snackbar e showcase ainda o importam) e é apagado na F2 |
| Uso interno (lib + showcase) | misto                                                                          | só o novo                                                                                      | `check-units` falha em qualquer nome sem prefixo, a partir da F1                                                                                                         |
| Remoção                      | n/a                                                                            | n/a                                                                                            | `0.1.0` (registrada no changelog e em `migration-0.0-to-0.1.md`)                                                                                                         |

O CLI copia esta seção para `docs/design-system/migration-0.0-to-0.1.md`.

#### Como substituir num app consumidor (qualquer projeto Angular da SHYLAND DEV)

**Passo 0.** Deixe o working tree limpo (`git status`). As substituições abaixo alteram arquivos em lote; com tudo commitado você revisa em `git diff` e desfaz com `git restore .`.

**Passo 1. Achar os usos.**

```bash
# bash / WSL Ubuntu
grep -rn -e '--responsive-unit' -e '\$responsive-unit' src/
```

```powershell
# PowerShell
Get-ChildItem src -Recurse -Include *.scss,*.css,*.html,*.ts | Select-String -SimpleMatch '--responsive-unit','$responsive-unit'
```

**Passo 2. Variável CSS** (mecânico e seguro; idempotente e não altera `--shy-responsive-unit`, porque `--responsive-unit` não é substring dele):

```bash
# bash / WSL Ubuntu
grep -rl -e '--responsive-unit' src/ | xargs -r sed -i 's/--responsive-unit/--shy-responsive-unit/g'
```

```powershell
# PowerShell (prefira o 7+: grava UTF-8 sem BOM)
Get-ChildItem src -Recurse -Include *.scss,*.css,*.html,*.ts | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  if ($c -match '--responsive-unit') {
    ($c -replace '--responsive-unit','--shy-responsive-unit') | Set-Content $_.FullName -NoNewline -Encoding utf8
  }
}
```

**Passo 3. Variável SCSS:** `calc(#{$responsive-unit} * N)` vira `ru(N)`. Antes, importe a função no arquivo (a forma exata do `@use` fica documentada no README da lib após a F1; algo como `@use '@shyland-dev/ui/styles' as *;`). Substituição mecânica do padrão simples:

```bash
# bash / WSL Ubuntu
grep -rlE -e '\$responsive-unit' src/ | xargs -r sed -E -i 's/calc\(#\{\$responsive-unit\} \* ([0-9.]+)\)/ru(\1)/g'
```

```powershell
# PowerShell
Get-ChildItem src -Recurse -Include *.scss | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  ($c -replace 'calc\(#\{\$responsive-unit\} \* ([0-9.]+)\)','ru($1)') | Set-Content $_.FullName -NoNewline -Encoding utf8
}
```

Exemplo: `$header-height: calc(#{$responsive-unit} * 35);` vira `$header-height: ru(35);`. O que sobrar (expressões compostas, valores negativos, `var($responsive-unit)`) é manual: rode a busca do passo 1 até zerar.

**Passo 4. Conferir.** A busca do passo 1 deve retornar vazio; rode `npm run build` e revise `git diff`.

**Passo 5. Commit** (pt-BR, Conventional Commits): `refactor: substituir --responsive-unit por --shy-responsive-unit`.

#### Política de depreciação (vale para qualquer API da lib, não só o ru)

(Vale a partir do `0.1.0`; a reformulação do `0.1.0` removeu os nomes antigos sem depreciação, por decisão do dono em 2026-10-20.) 1. Manter o alias/API antiga funcionando. 2. Marcar `@deprecated` apontando o substituto. 3. Documentar a troca com comando de busca/substituição. 4. Fazer o `check-ds` falhar em usos internos. 5. Remover na próxima major (ou minor `0.x`, se você aprovar) e registrar no changelog.

---

## 7. Tokens

### 7.1 Cores

#### Primitivos (valores iniciais gerados em OKLCH; contraste calculado; **ajustar visualmente no showcase** mantendo os mínimos)

```css
:root {
    /* primary: 600 e 700 são os extremos exatos do gradiente da marca */
    --shy-primary-50: #f2f4ff;
    --shy-primary-100: #e2e6fe;
    --shy-primary-200: #c5cefe;
    --shy-primary-300: #a2adfc;
    --shy-primary-400: #818bfd;
    --shy-primary-500: #615ffb;
    --shy-primary-600: #4c00ff;
    --shy-primary-700: #5f00d9;
    --shy-primary-800: #3002ac;
    --shy-primary-900: #21057e;
    --shy-primary-950: #120052;

    /* neutral: levemente tingido de violeta para harmonizar com a marca */
    --shy-neutral-50: #f9faff;
    --shy-neutral-100: #eef1fe;
    --shy-neutral-200: #dee0ee;
    --shy-neutral-300: #c7cad7;
    --shy-neutral-400: #a1a4b0;
    --shy-neutral-500: #7d7f8b;
    --shy-neutral-600: #60626e;
    --shy-neutral-700: #4a4c57;
    --shy-neutral-800: #2b2d37;
    --shy-neutral-850: #20222c; /* interpolado: validar */
    --shy-neutral-900: #161821;
    --shy-neutral-950: #070811;

    --shy-success-50: #deffe8;
    --shy-success-100: #b6fbcd;
    --shy-success-200: #97e6b2;
    --shy-success-300: #6ccc91;
    --shy-success-400: #3bb270;
    --shy-success-500: #119254;
    --shy-success-600: #067240;
    --shy-success-700: #036035;
    --shy-success-800: #034a28;
    --shy-success-900: #00351b;
    --shy-success-950: #001f0d;

    --shy-warning-50: #fff7eb;
    --shy-warning-100: #ffeccd;
    --shy-warning-200: #ffd897;
    --shy-warning-300: #f1c77e;
    --shy-warning-400: #e4b665;
    --shy-warning-500: #d6a54b;
    --shy-warning-600: #bc8710;
    --shy-warning-700: #93690b;
    --shy-warning-800: #704e00;
    --shy-warning-900: #553a00;
    --shy-warning-950: #352300;

    --shy-danger-50: #fff1f1;
    --shy-danger-100: #ffdfdd;
    --shy-danger-200: #febebb;
    --shy-danger-300: #fd918e;
    --shy-danger-400: #f26265;
    --shy-danger-500: #d8303f;
    --shy-danger-600: #b30427;
    --shy-danger-700: #98011f;
    --shy-danger-800: #770217;
    --shy-danger-900: #58000d;
    --shy-danger-950: #360005;

    --shy-info-50: #ebf7ff;
    --shy-info-100: #cfedff;
    --shy-info-200: #9cdaff;
    --shy-info-300: #6ebfed;
    --shy-info-400: #40a3d6;
    --shy-info-500: #1084b6;
    --shy-info-600: #066790;
    --shy-info-700: #03577a;
    --shy-info-800: #03435e;
    --shy-info-900: #003045;
    --shy-info-950: #001b2a;

    --shy-gradient-brand: linear-gradient(135deg, #4c00ff 0%, #5f00d9 100%);
}
```

Nota: as escalas `primary` 400/500 foram geradas com clamp de gamut e ficam um pouco mais azuladas que a marca. Se destoar ao lado de `#4C00FF`, ajustar o matiz mantendo os contrastes.

#### Semânticos (o que os componentes realmente usam)

| Token                                                                                                    | Escuro (padrão)                          | Claro                           |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------- |
| `--shy-color-bg`                                                                                         | neutral-950                              | neutral-50                      |
| `--shy-color-surface`                                                                                    | neutral-900                              | `#FFFFFF`                       |
| `--shy-color-surface-raised` (dialog, popover, menu)                                                     | neutral-850                              | `#FFFFFF` (+ sombra)            |
| `--shy-color-surface-sunken` (fundo de input)                                                            | neutral-950                              | neutral-100                     |
| `--shy-color-text`                                                                                       | neutral-50                               | neutral-950                     |
| `--shy-color-text-muted`                                                                                 | neutral-300                              | neutral-700                     |
| `--shy-color-text-subtle`                                                                                | neutral-400                              | neutral-600                     |
| `--shy-color-text-disabled`                                                                              | neutral-600                              | neutral-400                     |
| `--shy-color-border` (decorativa)                                                                        | neutral-800                              | neutral-200                     |
| `--shy-color-border-strong` (controles; ≥3:1)                                                            | neutral-500                              | neutral-500                     |
| `--shy-color-scrim`                                                                                      | `rgb(0 0 0 / 60%)`                       | `rgb(7 8 17 / 40%)`             |
| `--shy-color-line` (conectores: stepper, divisores de lista)                                             | neutral-700                              | neutral-400                     |
| `--shy-color-neutral-soft` / `--shy-color-on-neutral-soft` (chip "+N", badge neutro, avatar de contagem) | neutral-700 / neutral-50                 | neutral-300 / neutral-900       |
| `--shy-color-scrim-panel` / `--shy-color-on-scrim` (mensagem sobre scrim: overlay de loading)            | neutral-800 + borda neutral-500 + sombra | `rgb(7 8 17 / 82%)` + sem borda |
| `--shy-color-focus` (anel de foco)                                                                       | primary-400                              | primary-600                     |

Por intenção `X` ∈ `primary | success | warning | danger | info`, 5 tokens cada:

| Papel                                                  | primary                | success                | warning                | danger                 | info                   |
| ------------------------------------------------------ | ---------------------- | ---------------------- | ---------------------- | ---------------------- | ---------------------- |
| `--shy-color-X` (fundo sólido)                         | 600 (ambos)            | 600 (ambos)            | 500 (ambos)            | escuro 500 / claro 600 | 600 (ambos)            |
| `--shy-color-on-X` (texto sobre sólido)                | `#FFFFFF`              | `#FFFFFF`              | neutral-950            | `#FFFFFF`              | `#FFFFFF`              |
| `--shy-color-X-text` (texto/ícone/borda sobre surface) | escuro 400 / claro 600 | escuro 400 / claro 700 | escuro 400 / claro 800 | escuro 400 / claro 700 | escuro 400 / claro 700 |
| `--shy-color-X-soft` (fundo suave)                     | escuro 950 / claro 50  | idem                   | idem                   | idem                   | idem                   |
| `--shy-color-on-X-soft`                                | escuro 200 / claro 800 | escuro 200 / claro 800 | escuro 200 / claro 900 | escuro 200 / claro 800 | escuro 200 / claro 800 |

**Hover/pressed não têm token de cor própria.** Usam _state layer_ (seção 8.2), então funcionam igual em todos os temas e intenções.

Mínimos de contraste (validados por script, seção 15): texto normal ≥ 4,5:1; texto grande, ícones, bordas de controle e anel de foco ≥ 3:1, em **ambos os temas**, para todos os pares `on-X/X`, `X-text/surface`, `on-X-soft/X-soft`, `text*/bg|surface`, `focus/bg|surface`.

### 7.2 Tipografia (tamanhos em ru)

| Token                   | Valor            | px no celular 360 / FHD |
| ----------------------- | ---------------- | ----------------------- |
| `--shy-text-xs`         | `calc(ru * 6.5)` | 12,7 / 17,4             |
| `--shy-text-sm`         | `calc(ru * 7)`   | 13,7 / 18,8             |
| `--shy-text-md` (corpo) | `calc(ru * 7.5)` | 14,7 / 20,1             |
| `--shy-text-lg`         | `calc(ru * 8.5)` | 16,7 / 22,8             |
| `--shy-text-xl`         | `calc(ru * 10)`  | 19,6 / 26,8             |
| `--shy-text-2xl`        | `calc(ru * 12)`  | 23,5 / 32,2             |
| `--shy-text-3xl`        | `calc(ru * 15)`  | 29,4 / 40,2             |
| `--shy-text-4xl`        | `calc(ru * 18)`  | 35,3 / 48,2             |
| `--shy-text-5xl`        | `calc(ru * 24)`  | 47,0 / 64,3             |

(`ru` = `var(--shy-responsive-unit)`; escrito por extenso nos arquivos.) Valores **iniciais**; calibrar visualmente na página `/foundations/units`. Sem `clamp()` de fluidez: o ru já é fluido.

| Token                                             | Valor                                                      |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `--shy-weight-regular / medium / semibold / bold` | 400 / 500 / 600 / 700                                      |
| `--shy-leading-tight / snug / normal / relaxed`   | 1.2 / 1.35 / 1.5 / 1.65 (sem unidade)                      |
| `--shy-tracking-tight / normal / wide`            | `calc(ru * -0.15)` / 0 / `calc(ru * 0.3)`                  |
| `--shy-measure` (largura de leitura)              | `calc(ru * 280)` (≈ 66 caracteres em mono 7,5 ru; ajustar) |

Estilos semânticos (classes `.shy-display`, `.shy-h1`…`.shy-h4`, `.shy-body-lg`, `.shy-body`, `.shy-small`, `.shy-caption`, `.shy-overline`, `.shy-code`). `overline` em caixa alta com `tracking-wide`.

### 7.3 Espaço, forma, tamanho (todos em ru)

| Grupo                   | Tokens (nome = multiplicador de ru)                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Espaço                  | `--shy-space-0` (0), `-0-5`, `-1`, `-2`, `-3`, `-4`, `-5`, `-6`, `-7`, `-8`, `-10`, `-12`, `-14`, `-16`, `-20`, `-24`, `-32` → `calc(ru * N)` (ex.: `--shy-space-4 = calc(ru * 4)`) |
| Raio                    | `--shy-radius-none: 0`, `-xs: ru*0.5`, `-sm: ru*1`, `-md: ru*2`, `-lg: ru*3`, `-xl: ru*4`, `-2xl: ru*6`, `-full: ru*999` (pílula; sem `9999px`)                                     |
| Controles (altura)      | `--shy-size-control-sm: ru*14`, `-md: ru*18`, `-lg: ru*22`. Em `@media (pointer: coarse)`: `sm: ru*18`, `md: ru*23`, `lg: ru*26` (≥ 44 px no celular)                               |
| Ícones                  | `--shy-size-icon-sm: ru*6`, `-md: ru*8`, `-lg: ru*10`                                                                                                                               |
| Borda                   | `--shy-border-width: ru*0.5`, `--shy-border-width-strong: ru*1`                                                                                                                     |
| Foco                    | `--shy-focus-ring-width: ru*1`, `--shy-focus-ring-offset: ru*1`                                                                                                                     |
| Opacidade (número puro) | `--shy-opacity-disabled: 0.45`                                                                                                                                                      |

Alvo de toque: controles ≥ 24 px em qualquer viewport (WCAG 2.5.8 AA; o script confere em 360×800); ponteiro grosso ≥ 44 px.

### 7.4 Elevação e camadas

- `--shy-shadow-1…5`, **todas as medidas em ru**: ex. `--shy-shadow-2: 0 calc(ru * 0.5) calc(ru * 2) 0 color-mix(in srgb, #000 18%, transparent)` (a cor sai de token/semântico, não literal; o CLI define o tratamento final).
- No **escuro** sombra quase não aparece: elevação = degrau de surface (`surface` → `surface-raised`) + `border` + sombra sutil. Os tokens de sombra são redefinidos no bloco do tema escuro.
- Camadas (z-index): ver 7.5. Nenhum número solto (`1000`, `9999`) em componente.

### 7.5 Camadas (z-index) e ordem dos overlays

**Fato (MDN, top layer):** elementos no top layer (`<dialog>.showModal()`, `[popover]`) ignoram `z-index` entre si; vale a **ordem de abertura** (o último aberto fica por cima). `z-index` só ordena o que está fora do top layer (header sticky, sidebar fixa, dropdown inline, conteúdo local). Por isso são dois mecanismos:

1. **Escala nomeada para o que NÃO está no top layer.** Ordem única, da mais baixa para a mais alta:
   `base` → `raised` → `dropdown` → `sticky` → `fixed` → `drawer` → `modal` → `popover` → `tooltip` → `toast`.
    - Fonte da verdade: `tokens/layers.css`, passo de 100 por camada (`--shy-z-base: 0; --shy-z-raised: 100; …`), números puros (exceção E3). Espaço entre camadas permite `z(modal, 1)`.
    - SCSS (`_layers.scss`): `$layers: (base, raised, dropdown, sticky, fixed, drawer, modal, popover, tooltip, toast)` e `@function z($layer, $offset: 0)` → `calc(var(--shy-z-#{$layer}) + #{$offset})`. `$offset` limitado a -50…50 (`@error` fora disso) e `@error` em camada inexistente. Mixin `@include shy-layer(tooltip)`.
    - TS: `shyLayer('tooltip')` lê a variável (para overlays criados em runtime).
    - O app consumidor pode inserir uma camada própria (ex.: `--shy-z-chat: 850`) entre duas existentes sem tocar a lib.
2. **Ordem de abertura para o top layer, com promoção.** O `OverlayService` mantém a pilha dos overlays abertos com o **rank** da camada. Ao abrir um overlay de rank `r`, qualquer popover/toast/tooltip aberto de rank maior é promovido (`hidePopover()` + `showPopover()` sem animação, `data-promoting`) para continuar acima. Resultado: tooltip e toast nunca ficam atrás de um dialog; dialog sobre dialog empilha pela ordem natural. `<dialog>` é usado só para `modal`/`drawer` (não dá para promover sem fechar); o resto usa `[popover="manual"]`.
    - Custo conhecido: a promoção reinicia o estado do popover (foco e transição); por isso o tooltip fecha ao abrir um modal e o toast é reapresentado sem animação.
3. **Container de overlay sob demanda (decisão do dono, 2026-10-20, ADR-F4-1; inspirado no CDK).** O `OverlayService` cria `.shy-overlay-container` no `body` (fixo, tela cheia, `pointer-events: none`) quando o primeiro overlay abre e o remove quando o último fecha. Ele hospeda painéis e o backdrop dos modais (`pointer-events: auto` só neles). Com top layer disponível, os painéis são promovidos a ele (mecanismo 2); sem, o container fica em `z(modal)` e os painéis empilham pela ordem no DOM e por `z()`.

Regras:

- `z-index` literal só `0`, `1`, `-1` **dentro de componente com `isolation: isolate`** (empilhamento local, não vaza). Qualquer outro valor vem de `z()`; `check-hardcoded` falha em número solto ≥ 2.
- `isolation: isolate` no host de todo componente que usa z-index interno e no `app-root`, para a escala global não competir com contextos de empilhamento acidentais (`transform`, `opacity < 1`, `filter` criam contexto novo).
- `check-tokens` confere que `$layers` (SCSS) e `tokens/layers.css` têm os mesmos nomes e a mesma ordem.
- Matriz de empilhamento (tooltip × dialog × toast × drawer, com abertura em ordens diferentes) vira página `/foundations/layers` no showcase e teste de componente na F4.

---

## 8. Estados e interação (contrato obrigatório)

### 8.1 Matriz

Todo componente interativo implementa os estados que se aplicam e a **matriz visual no showcase** os mostra lado a lado.

| Estado           | Seletor/atributo                              | Regra visual                                                                    | Regra de acessibilidade                             |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| default          | n/a                                           | tokens base                                                                     | n/a                                                 |
| hover            | `@media (hover: hover) { :hover }`            | state layer 8%                                                                  | Só com ponteiro fino (evita hover "preso" no toque) |
| focus-visible    | `:focus-visible`                              | anel `--shy-color-focus` (largura/offset em ru), nunca removido sem substituto  | Visível em ambos os temas e em `forced-colors`      |
| active/pressed   | `:active`                                     | state layer 12% (+ `scale(0.98)` opcional)                                      | n/a                                                 |
| disabled         | `disabled` nativo ou `aria-disabled="true"`   | `opacity: var(--shy-opacity-disabled)`, `cursor: not-allowed`, sem hover/active | Não remove do fluxo de leitura sem necessidade      |
| readonly         | `readonly`                                    | sem borda de edição, texto normal                                               | `aria-readonly`                                     |
| loading/busy     | `[aria-busy='true']` + `data-loading`         | spinner no lugar do ícone; **largura preservada** (sem layout shift)            | Cliques ignorados; `aria-live` quando fizer sentido |
| invalid          | `aria-invalid="true"`                         | borda `danger-text`, ícone + mensagem (nunca só cor)                            | `aria-describedby` → mensagem de erro               |
| selected/checked | `aria-selected` / `:checked` / `aria-checked` | `primary` sólido + marca visual                                                 | Estado exposto ao leitor de tela                    |
| indeterminate    | `:indeterminate` / `aria-checked="mixed"`     | traço no checkbox                                                               | n/a                                                 |
| expanded         | `aria-expanded`                               | seta gira, painel abre com motion                                               | n/a                                                 |

Mixin `@include shy-state(hover|focus|active)` gera `&:hover` **e** `&[data-shy-state='hover']`, para o showcase exibir o estado estático na matriz sem simular mouse.

### 8.2 State layer (substitui cores de hover por variante)

```scss
.btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: var(--shy-color-on-solid, currentColor);
    opacity: 0;
    transition: opacity var(--shy-duration-fast) var(--shy-ease-standard);
}
@media (hover: hover) {
    .btn:hover::after {
        opacity: var(--shy-state-hover);
    }
}
.btn:active::after {
    opacity: var(--shy-state-pressed);
}
```

Tokens: `--shy-state-hover: 0.08`, `--shy-state-pressed: 0.12`.

---

## 9. Motion: transitions e animations

### 9.1 Tokens (`tokens/motion.css`)

| Token                                                     | Valor                                                                     | Uso                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------- |
| `--shy-duration-instant`                                  | 80ms                                                                      | feedback de press                     |
| `--shy-duration-fast`                                     | 120ms                                                                     | hover, cor, foco                      |
| `--shy-duration-base`                                     | 200ms                                                                     | switch, tabs, tooltip                 |
| `--shy-duration-slow`                                     | 320ms                                                                     | dialog, drawer, collapse              |
| `--shy-duration-slower`                                   | 500ms                                                                     | transições de página/skeleton         |
| `--shy-ease-standard`                                     | `cubic-bezier(0.2, 0, 0, 1)`                                              | mudanças de estado                    |
| `--shy-ease-enter`                                        | `cubic-bezier(0.05, 0.7, 0.1, 1)`                                         | elementos entrando                    |
| `--shy-ease-exit`                                         | `cubic-bezier(0.3, 0, 0.8, 0.15)`                                         | elementos saindo                      |
| `--shy-ease-linear`                                       | `linear`                                                                  | spinner, progress                     |
| `--shy-motion-distance`                                   | `calc(ru * 3)`                                                            | deslocamento de slide (em ru, por D8) |
| `--shy-transition-colors`                                 | `color, background-color, border-color, box-shadow` × `fast` × `standard` | atalho                                |
| `--shy-transition-opacity` / `--shy-transition-transform` | idem                                                                      | atalho                                |

(Tempo em `ms` é permitido: não é comprimento, exceção E3.)

### 9.2 Regras

1. Animar apenas `opacity`, `transform`, cor/fundo/borda. Nunca `width/height/top/left` (use `grid-template-rows: 0fr → 1fr` para collapse).
2. Entrada: `ease-enter`. Saída: `ease-exit`, ~70% da duração da entrada.
3. **`prefers-reduced-motion: reduce`** (e `[data-motion='reduced']` forçado pelo app): durações → `0.01ms`, `--shy-motion-distance: 0`; componentes mantêm só fade. Tratado **uma vez** nos tokens.
4. Nenhum movimento essencial para entender a UI; nada pisca mais de 3×/s.

### 9.3 Catálogo de animações (`animations.css`)

`shy-fade-in/out`, `shy-scale-in/out`, `shy-slide-up/down/inline-start/inline-end`, `shy-collapse`, `shy-spin`, `shy-pulse`, `shy-shimmer`, `shy-progress-indeterminate`, `shy-shake` (erro de input, opcional). Mixins `@include shy-enter(...)` / `shy-exit(...)`. Todos os deslocamentos via `--shy-motion-distance` (ru).

### 9.4 Enter/leave

| Elemento                             | Estratégia                                                                                                                                                                                                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<dialog>` / `[popover]` (top layer) | CSS com `@starting-style` + `transition-behavior: allow-discrete` para entrar. **Saída robusta:** `data-state="closing"` → aguardar `transitionend`/`animationend` (timeout de segurança) → só então `close()`/`hidePopover()`. Util interno `animateOut(el)`. |
| Elementos renderizados por `@if`     | `animate.enter` / `animate.leave` do Angular **se existir e estiver estável no Angular 21** (o CLI confirma na documentação oficial); senão, o mesmo `animateOut`. Não usar `@angular/animations` (deprecado e dependência extra).                             |
| Colapso (accordion, menu)            | `grid-template-rows` + `overflow: hidden`                                                                                                                                                                                                                      |

---

## 10. Acessibilidade (baseline WCAG 2.2 AA)

- Contraste: 4,5:1 texto, 3:1 UI/ícones/foco, nos **dois temas** (script bloqueia regressão).
- Teclado completo, sem armadilha; ordem de foco lógica; `:focus-visible` sempre; foco não escondido por header sticky (2.4.11).
- Nome acessível em todo controle (ícone-only exige `label`). `aria-*` corretos por padrão APG.
- Mensagens dinâmicas: `role="status"` (informativa) / `role="alert"` (erro).
- Reflow em 320 px sem scroll horizontal; `text-spacing` não quebra layout. **Zoom 200%:** ver limitação do ru na seção 6.4 (item 3).
- Tamanho mínimo de alvo e de texto garantido por `check-calibration` (seção 15).
- `prefers-reduced-motion`, `forced-colors: active` (bordas/foco com `currentColor`/`CanvasText`/`Highlight`), `prefers-contrast: more` opcional.
- Cor nunca é a única pista (erro = cor + ícone + texto).
- Padrões APG por componente: Listbox/Select, Combobox, Dialog (modal), Tabs, Menu button, Tooltip, Switch, Radio group (roving tabindex), Checkbox, Accordion/Disclosure, Alert/Status.

---

## 11. Convenções de componente

### 11.1 Código

- Standalone, `ChangeDetectionStrategy.OnPush`, sem `NgModule`. Compatível com zoneless.
- `input()`/`output()`/`model()`/`computed()`/`effect()` (só quando necessário), `inject()`. Sem `@HostListener`/`@HostBinding`: usar `host: {}`.
- Selector `shy-*` (elementos) e `[shy*]` (diretivas). Classes CSS em BEM (`.select__trigger`), como já está no repo.
- Controles de formulário: **`ControlValueAccessor`** (funciona com `ngModel` e Reactive Forms), incluindo `setDisabledState`. Para `input`/`textarea`, **diretiva `shyInput` sobre o elemento nativo** dentro de `shy-form-field` (integração nativa de forms, sem CVA).
- IDs únicos para `aria-labelledby`/`aria-describedby` via contador interno (sem `Math.random`).
- Estilos `ViewEncapsulation.Emulated`; **cores, medidas (ru), fontes e motion só via tokens**; zero literal.
- Sem acesso direto a `window`/`document` fora de guarda SSR.
- Cada componente exporta seus tipos via `public-api.ts`; interfaces/types em `interfaces/` e `types/` como hoje.

### 11.2 Overlay do zero (sem CDK)

- Camada: `<dialog>` nativo (`showModal()` dá top layer, `inert` no resto e Esc) e Popover API (`popover="manual|auto"`) para popover/menu/tooltip/toast.
- Posicionamento: util próprio `computePosition(anchor, floating, { placement, offset, flip, shift })` em TS (getBoundingClientRect + visualViewport). Offsets recebem ru via helper. CSS Anchor Positioning só como melhoria progressiva **se** o suporte nos navegadores-alvo estiver consolidado (CLI verifica em MDN/caniuse).
- Foco: `FocusScope` próprio (guardar elemento anterior, foco inicial, devolver ao fechar). Em `<dialog>` modal o trap é nativo.
- `OverlayService` mínimo: abrir componente/template dinamicamente em container no `body`, com `ref.close(result)`.
- jsdom pode não implementar `showModal`/`showPopover`: stubs no setup de testes (o CLI verifica).

### 11.3 Checklist de "pronto" por componente

1. Inputs/outputs documentados com tipo e padrão.
2. Todos os estados aplicáveis (seção 8) implementados e na matriz do showcase.
3. Teclado + ARIA conforme APG, testados.
4. Funciona nos dois temas e com `reduced-motion`; **sem literal de cor, unidade ou tempo** (`check-ds` verde).
5. Tokens de override documentados (`--shy-<comp>-*`).
6. Testes unitários passando; página no showcase; README atualizado.
7. Lições da revisão visual (2026-10-20): botão tem `background: transparent` na base (sem fundo do navegador); conteúdo em loading mantém respiro lateral mínimo (≥ `--shy-space-6`) e a largura do botão; texto sobre scrim usa `--shy-color-scrim-panel` + `--shy-color-on-scrim`, nunca o scrim puro; no escuro o painel precisa se destacar do scrim preto (fundo neutral-800 + borda + sombra), no claro basta o painel escuro; chips neutros e conectores usam `neutral-soft` e `line`, nunca `surface-raised`/`border` (somem no tema oposto).

### 11.4 Padrão de tokens de componente

```scss
:host {
    /* var privada com fallback ao semântico: o app sobrescreve --shy-button-bg; ninguém depende de --_bg */
    --_bg: var(--shy-button-bg, var(--shy-color-primary));
    --_fg: var(--shy-button-fg, var(--shy-color-on-primary));
    --_radius: var(--shy-button-radius, var(--shy-radius-md));
    --_height: var(--shy-button-height, var(--shy-size-control-md));
    --_pad-x: var(--shy-button-pad-x, var(--shy-space-6));
}
```

---

## 12. Catálogo de componentes e ondas

### Onda 0: Fundação

| Item           | Entrega                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Unidades       | `tokens/units.css`, `ru()` em SCSS, helper `ru(n)` em TS, `_breakpoints.scss`                           |
| Tokens + temas | seções 6–7, `ThemeService`, `shy-theme-toggle`, script anti-flash                                       |
| Fontes         | `fonts.css` + arquivos + licenças                                                                       |
| Base           | `base.css` (reset, foco, seleção, scrollbar, forced-colors)                                             |
| Motion         | `motion.css`, `animations.css`, util `animateOut`                                                       |
| Ícone          | refatorar `shy-icon` (seção 13)                                                                         |
| Utilitários    | classes de tipografia, `.shy-sr-only`, layout (`shy-stack`, `shy-cluster`, `shy-grid`, `shy-container`) |
| Showcase       | shell com toggle de tema/motion/fonte + páginas `/foundations/*` (incluindo `units`)                    |
| Qualidade      | scripts da seção 15 + runner de testes configurado                                                      |

### Onda 1: Ação, formulário e feedback básico

| Componente       | Selector                                | API principal                                                                                                                   | Estados / A11y                                                   |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------- | -------------------------------------------- |
| Button           | `button[shyButton]`, `a[shyButton]`     | `variant: solid\|soft\|outline\|ghost\|link`, `intent`, `size`, `loading`, `loadingPosition: start                              | end                                                              | replace`, `loadingText`, `block` | todos; `aria-busy`; ícone à esquerda/direita |
| IconButton       | `button[shyIconButton]`                 | `label` (obrigatório), `variant`, `size`                                                                                        | alvo ≥ 24 px, 44 px em toque                                     |
| FormField        | `shy-form-field`                        | `label`, `hint`, `error`, `required`, prefix/suffix por projeção                                                                | liga label/hint/erro via ids e `aria-describedby`                |
| Input / Textarea | `input[shyInput]`, `textarea[shyInput]` | `size`, `invalid`; textarea com autosize opcional                                                                               | invalid, readonly, disabled, focus                               |
| Checkbox         | `shy-checkbox`                          | CVA, `indeterminate`                                                                                                            | `<input>` nativo oculto visualmente                              |
| Radio            | `shy-radio-group` + `shy-radio`         | CVA, `orientation`                                                                                                              | roving tabindex, setas                                           |
| Switch           | `shy-switch`                            | CVA                                                                                                                             | `role="switch"`                                                  |
| Spinner          | `shy-spinner`                           | `variant: ring\|ring-track\|dash\|dots\|bars\|pulse\|orbit\|breathe`, `size: xs\|sm\|md\|lg`, `label`; cor herda `currentColor` | `role="status"`; com reduced-motion todas viram fade (`breathe`) |
| Skeleton         | `shy-skeleton`                          | `shape: text\|circle\|rect`, `animation: shimmer\|still`                                                                        | decorativo (`aria-hidden`); a região leva `aria-busy`            |
| ProgressCircular | `shy-progress-circular`                 | `value`, indeterminado, `size`                                                                                                  | `role="progressbar"`                                             |
| Badge / Tag      | `shy-badge`                             | `intent`, `variant`                                                                                                             | n/a                                                              |
| Divider          | `shy-divider`                           | `orientation`                                                                                                                   | `role="separator"`                                               |
| Card             | `shy-card`                              | `variant`, `interactive`                                                                                                        | slots header/body/footer                                         |
| Alert            | `shy-alert`                             | `intent`, `dismissible`, título/ação                                                                                            | `role="alert"` ou `status`                                       |
| Progress         | `shy-progress`                          | `value`, indeterminado                                                                                                          | `role="progressbar"`                                             |

### Onda 2: Overlays (núcleo "do zero")

| Componente               | Notas                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --- | ------- |
| Overlay core             | `computePosition`, `FocusScope`, `animateOut`, `OverlayService`                                                                           |
| Dialog                   | `<dialog>` nativo; `DialogService.open()`; tamanhos; confirm/alert prontos                                                                |
| Drawer / Sheet           | `<dialog>` com slide; lados `start                                                                                                        | end | bottom` |
| Popover                  | `[popover]` + posicionamento                                                                                                              |
| Tooltip                  | `shyTooltip`; foco/hover; atraso; `aria-describedby`; Esc fecha                                                                           |
| Menu                     | menu button APG; setas, typeahead, Home/End                                                                                               |
| **Select (reescrito)**   | listbox APG, CVA, teclado, typeahead, `img`/ícone nas opções (mantém recurso atual), multi opcional                                       |
| **Snackbar (reescrito)** | `SnackbarService.show(msg, opts)` sem `#ref`, outlet global no top layer, fila, variantes, ação, `role=status/alert`, pausa no hover/foco |

### Onda 3: Navegação e dados

Tabs (underline e pill; o pill é a base do `shy-theme-toggle`), Accordion, Breadcrumb, Pagination, Stepper, Avatar (tamanhos, status, grupo), Table (estilizada + ordenação básica + seleção), List, EmptyState, AppShell (header/sidebar/footer responsivo), Combobox/Autocomplete, Slider, FileDropzone.

### Onda 4: Opcional / endurecimento

DatePicker (só se algum projeto precisar), Toast avançado, Command palette, Tree. Auditoria a11y completa, orçamento de tamanho, docs finais.

Regra de prioridade: **construir sob demanda dos projetos reais**. Onda 3 sem consumidor espera.

---

## 13. Migração dos componentes existentes

| Componente                         | Mudanças                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shy-icon`                         | Mantém conteúdo projetado (`<shy-icon>home</shy-icon>`) e `hoverFill`/`hoverFillDelay` como `input()`; adiciona `name` opcional e `label`. `aria-hidden="true"` por padrão; com `label`, `role="img"` + `aria-label`. **`1em`/`width: 1em` do CSS atual vira ru** (`--shy-icon-size`, padrão `--shy-size-icon-md`). `--shyIconSize` → `--shy-icon-size`. Pipeline `generate:icons` permanece. `.icon-layer` duplicado em `snackbar.component.scss` é resíduo: remover.                                                                                                                                                                                 |
| `shy-select`                       | Fase A (Onda 0/1): re-skin com tokens, API intacta, nada hardcoded. Fase B (Onda 2): reescrita completa. Mapa: `--shySelectBackground` → `--shy-select-bg`, `…Color` → `--shy-select-fg`, `…Height/Width/BorderRadius/FontSize/IconSize` → `--shy-select-height/width/radius/font-size/icon-size`, `…DropdownBackground` → `--shy-select-panel-bg`, `…SelectedColor` → `--shy-select-selected-fg`, `…OptionHover*` → `--shy-select-option-hover-bg/fg`, `…OptionImgBorderRadius` → `--shy-select-option-img-radius`. Corrigir: hover do item usa texto preto sobre cinza (contraste a medir). Os `calc(ru * N)` atuais migram para a escala de tokens. |
| `shy-snackbar` + `SnackbarService` | Fase A: re-skin. Fase B: reescrita (outlet global; `show('texto', { intent, duration, action, position })` retorna `SnackbarRef`; `dismiss()`; fila). `--shySnackbar*` → `--shy-snackbar-*`. Breaking documentado no README.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `@shyland-dev/utils`               | Não mexer (ThemeService fica em `ui`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Showcase (`src/apps`)              | Trocar `$color-*` e os `px`/`rem` soltos pelos tokens; substituir `--responsive-unit`/`$responsive-unit` por `--shy-responsive-unit`/`ru(N)` (seção 6.5); reorganizar rotas (seção 14).                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

---

## 14. Showcase e documentação

### 14.1 Rotas do showcase

```
/                        visão geral + changelog resumido
/foundations/colors      escalas, semânticos, pares de contraste com razão calculada, escuro/claro lado a lado, gradiente da marca
/foundations/typography  famílias, escala, estilos semânticos, mono vs sans
/foundations/units       o ru: fórmula, tabela de px por viewport (360 a 4K), tokens de espaço/raio/tamanho/texto,
                         simulação de viewport e aviso dos mínimos (calibração)
/foundations/spacing     espaço, raio, tamanhos, bordas
/foundations/elevation   sombras, camadas, z-index
/foundations/motion      durações, easings, playground de animações, toggle reduced-motion
/foundations/icons       busca + grade (já existe)
/components/<nome>       uma página por componente
/playground              combinar componentes e tokens ao vivo (editar variáveis CSS)
```

### 14.2 Template de página de componente

1. Demo principal + variantes + tamanhos + intenções.
2. **Matriz de estados** (seção 8) nos dois temas.
3. Tabela de API (inputs/outputs/tokens CSS/slots).
4. Notas de acessibilidade (padrão APG, teclado).
5. Trecho de código copiável.
6. Do/Don't curto.

Header fixo do showcase: título textual "SHYLAND DEV", seletor de tema (claro/sistema/escuro), toggle `reduced-motion` (`data-motion`), seletor de fonte base (mono/sans).

### 14.3 Docs em `docs/design-system/`

`principles.md`, `tokens.md`, `units.md` (regra D8, exceções, como escrever, migração do `--responsive-unit` para `--shy-responsive-unit`), `theming.md` (script anti-flash e como um app sobrescreve a marca), `motion.md`, `accessibility.md` (inclui o limite do zoom), `components-checklist.md`, `contributing.md`, `decisions.md` (premissas P1–P6 e ADRs curtos), `migration-0.0-to-0.1.md`, `progress.md` (estado das fases, lido pelo `/build`). README raiz e `src/libs/ui/README.md` atualizados **no mesmo commit** de cada mudança de uso (exigência do repo).

---

## 15. Qualidade: scripts, testes, CI

### 15.1 Scripts em `scripts/` (Node puro, **sem dependências**)

| Script                  | Falha quando                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check-units.mjs`       | Qualquer unidade proibida (seção 6.4) aparece em `src/libs/ui/**` ou `src/apps/**` (`.css`, `.scss`, `.html`, `.ts`: `host.styles`, `style.*`, strings `'12px'`, `[style.width.px]`), fora de `tokens/units.css` e `_breakpoints.scss`. Ignora comentários, `url()`, `viewBox` e números puros. Também falha em qualquer uso dos nomes sem prefixo removidos: `--responsive-unit`, `$responsive-unit`, `--dynamic-*` e `$dynamic-*` |
| `check-calibration.mjs` | Calcula o px de cada token em ru nos viewports de referência (360×800 a 3840×2160, `rem`=16) e falha se, em 360×800: texto < 12 px, corpo (`text-md`) < 14 px, controle < 24 px; ou se um token de tamanho tiver crescimento > limite configurado em 4K                                                                                                                                                                             |
| `check-tokens.mjs`      | Token semântico ausente em algum tema; `var(--shy-*)` usado e não definido; token definido e nunca usado (aviso)                                                                                                                                                                                                                                                                                                                    |
| `check-contrast.mjs`    | Par de `scripts/contrast-pairs.json` abaixo do mínimo (4,5 / 3) em **qualquer** tema. Lê hex dos CSS, calcula razão WCAG 2                                                                                                                                                                                                                                                                                                          |
| `check-hardcoded.mjs`   | Literais de **cor** (`#hex`, `rgb(`, `hsl(`) e de **tempo/easing** (`ms`, `cubic-bezier`) em `*.scss` de componente fora de allowlist                                                                                                                                                                                                                                                                                               |
| `check-fonts.mjs`       | `woff2` ausente, `OFL.txt` ausente, tamanho acima do orçamento                                                                                                                                                                                                                                                                                                                                                                      |
| `check-ds.mjs`          | Roda todos; vira `npm run check:ds`                                                                                                                                                                                                                                                                                                                                                                                                 |

### 15.2 Testes

- Runner: o do Angular 21 para este workspace (`@angular/build:unit-test`; o CLI confirma o configurado em `angular.json` e adiciona **apenas devDependencies** necessárias).
- Por componente: renderização e inputs → DOM/ARIA; teclado; eventos; integração com `ngModel` e Reactive Forms (CVA, incluindo `setDisabledState`); estados; `ThemeService` (modos, persistência, `system`); helper `ru()`.
- Overlays: stubs de `showModal`/`close`/`showPopover`/`hidePopover` se o DOM de teste não os tiver.
- Checklist manual por onda (`components-checklist.md`): só teclado; zoom 200% (conferir o limite conhecido); largura 320 px; `forced-colors`; `reduced-motion`; claro e escuro; viewports 360×800, 1366×768, 1920×1080.

### 15.3 CI (opcional, pedir aprovação)

Novo `.github/workflows/ci.yml`: `npm ci` → `npm run check:ds` → testes → `npm run build` → `npm run build:showcase`. **Não alterar** `publish.yml` nem `publish-pkg.sh` sem aprovação; o CLI **lê os dois** antes de mexer em versão/`package.json`.

---

## 16. Fases de execução (com gates)

Cada fase: criar tarefas (TaskCreate), implementar, rodar verificações, **parar no gate**.

| Fase                                    | Escopo                                                                                                                                                                                                                                                                                                                                                                                                                                            | Gate (todos obrigatórios)                                                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F0 Preparação**                       | Ler repo inteiro (`ui`, `utils`, `angular.json`, tsconfigs, workflows, `scripts/`); branch `feat/design-system`; registrar premissas em `decisions.md`; validar no showcase: consumo de CSS (angular.json e `@import`), `@font-face`, `animate.enter/leave` no Angular 21, test runner, jsdom vs `<dialog>`/popover, e que `calc(var(--shy-responsive-unit) * N)` funciona em `border-width`, `outline`, `box-shadow`, `font-size`, `translate()` | Relatório de verificações; nenhum código de feature                                                                                                                          |
| **F1 Unidades, tokens, temas, fontes**  | `styles/` (seção 6.2), `units.css` + `ru()` + helper TS, `ThemeService` + toggle, `fonts.css` + arquivos, base/motion/animations, scripts da seção 15, showcase `/foundations/*`                                                                                                                                                                                                                                                                  | `check:ds` verde (incluindo `check-units` e `check-calibration`); `build` e `build:showcase` verdes; temas sem flash; contraste ok nos dois temas; **zero unidade proibida** |
| **F2 Refactor dos existentes (fase A)** | `icon` refatorado; `select` e `snackbar` re-skin com tokens; showcase migrado (sem `px`/`rem`); README                                                                                                                                                                                                                                                                                                                                            | Nenhum literal de cor/unidade/tempo; testes dos três passam                                                                                                                  |
| **F3 Onda 1**                           | Seção 12, Onda 1 completa + páginas                                                                                                                                                                                                                                                                                                                                                                                                               | Checklist 11.3 verde por componente; matriz de estados nos dois temas                                                                                                        |
| **F4 Onda 2**                           | Overlay core, dialog, drawer, popover, tooltip, menu, **select (reescrito)**, **snackbar (reescrito)**                                                                                                                                                                                                                                                                                                                                            | Teste só-teclado de cada overlay; foco devolvido; reduced-motion; Esc/clique fora                                                                                            |
| **F5 Onda 3 + hardening**               | Onda 3 (sob demanda); auditoria a11y; orçamento de tamanho; docs finais; changelog/migração                                                                                                                                                                                                                                                                                                                                                       | Tudo anterior + `docs/` completos; decisão de `1.0.0` com você                                                                                                               |

Versão: bump apenas a pedido, `0.1.0` ao fechar F2; minor por onda.

---

## 17. Regras permanentes (copiar para `CLAUDE.md` na raiz)

```markdown
# Regras do repositório shyland-dev/npm

Contexto: SHYLAND DEV LTDA. Não misturar com outros contextos do dono (CLT, pessoal).
Plano mestre: docs/DESIGN-SYSTEM-PLAN.md. Execute UMA fase por vez e pare no gate.

## REGRA ABSOLUTA DE UNIDADES

- TODA unidade de comprimento em CSS usa calc(var(--shy-responsive-unit) \* N): padding, margin, gap, font-size,
  letter-spacing, border-width, outline, box-shadow, border-radius, width/height/min/max, inset, translate, etc.
- Proibido fora de exceção: px, rem, em, vw, vh, vmin, vmax, dvw, dvh, svw, svh, lvw, lvh, ch, ex, cap, lh, rlh, pt, pc, cm, mm, in, cq\*.
- Exceções permitidas: (E1) tokens/units.css; (E2) condições de @media/@container em \_breakpoints.scss;
  (E3) valores que não são comprimento: 0, %, fr, números puros, ms/s, deg, auto/none; (E4) atributos SVG/HTML fora de CSS.
- SCSS: use ru(N). TypeScript: use o helper ru(n); nunca style.width = '12px'.
- npm run check:ds (check-units + check-calibration) deve passar.
- --responsive-unit, $responsive-unit, --dynamic-_ e $dynamic-_ NÃO EXISTEM mais (sem alias; decisão de 2026-10-20: tudo com o prefixo shy). Use --shy-responsive-unit / ru(N) e --shy-dynamic-\*. Guia de migração na seção 6.5 do plano.

## Logos

- Os SVGs de logo são só referência de cor. NÃO adicionar logos, assets de marca ou favicon derivado deles na lib.

## Idioma e commits

- Commits em português do Brasil, Conventional Commits (feat, fix, chore, docs, refactor, test, build, ci, perf, style).
- Título curto e objetivo; corpo opcional explicando o impacto. Nunca commits em inglês.
- Pedir confirmação antes de criar commit. NUNCA `git push`, publish no npm ou bump de versão sem pedido explícito.
- Atualizar README.md no mesmo trabalho quando mudar uso, API, scripts ou build; se não precisar, dizer isso no resumo.
- Ao final de cada tarefa: resumo curto com arquivos principais e efeito prático.

## Dependências

- ZERO dependências de runtime (nada em dependencies/peerDependencies além de Angular).
- Sem @angular/cdk, Material, Tailwind, Storybook, libs de ícone/fonte via npm.
- devDependencies só para teste e somente o necessário; justificar no resumo.

## Código

- Angular 21: standalone, OnPush, input()/output()/model(), inject(), compatível com zoneless.
- Cores, medidas, fontes e motion SOMENTE via tokens CSS --shy-\*. Nenhum literal de cor, unidade ou tempo em SCSS de componente.
- CSS custom properties em kebab-case com prefixo --shy-.
- Propriedades CSS lógicas (inline/block) por padrão.
- Todo componente interativo: estados do contrato (hover só com @media (hover: hover), focus-visible, active, disabled, loading, invalid), teclado e ARIA conforme APG, testes, página no showcase.
- Respeitar prefers-reduced-motion e forced-colors; funcionar nos temas dark (padrão) e light.
- Simples e legível: sem abstração, refactor ou dependência sem benefício concreto. Identificar a causa antes de corrigir.

## Segurança

- Nunca expor tokens, chaves ou credenciais. Não ler nem commitar .env/segredos.
- Não executar operações destrutivas (rm -rf, reset --hard, force push, deletar branches) sem autorização explícita.
- Ler .github/workflows/publish.yml e .github/scripts/publish-pkg.sh antes de tocar em versão/publicação.

## Verificações antes de concluir qualquer fase

- npm run check:ds, testes, npm run build, npm run build:showcase.
- Informações que mudam (Angular, specs web): confirmar na documentação oficial e citar a fonte no resumo.
```

---

## 18. Pré-requisitos do Eduardo (antes de abrir o CLI)

1. **Fontes:** baixar de **fonts.google.com** ou **gwfh.mranftl.com** (subset `latin`, `woff2`, versão variável) e colocar conforme seção 5.3, **junto com o `OFL.txt` de cada uma**.
2. **Logos:** **não** copiar para o repo (D7). As cores já estão no plano.
3. **Premissas P1–P6 e exceções E1–E4:** confirmar ou corrigir (principalmente E3 `%`/`fr`; o P1 já está decidido: `--responsive-unit` sai no `0.1.0`, sem alias).
4. Criar a branch `feat/design-system` e conferir `node -v` = `24.14.1` (`.nvmrc`).
5. Copiar este plano para `docs/DESIGN-SYSTEM-PLAN.md` e a seção 17 para `CLAUDE.md`.

---

## 19. Prompts para o Claude CLI

**Sessão 1 (começar sempre em modo plano):**

```text
Leia CLAUDE.md e docs/DESIGN-SYSTEM-PLAN.md por completo. Execute SOMENTE a Fase F0.
Use o modo plano primeiro e mostre o plano de verificações antes de executar.
Registre as premissas P1–P6 e as exceções E1–E4 em docs/design-system/decisions.md.
Respeite a REGRA ABSOLUTA DE UNIDADES (CLAUDE.md) em qualquer código que escrever.
Ao terminar, pare no gate, mostre o relatório e espere minha aprovação.
```

**Cada fase seguinte:**

```text
Execute a Fase F<N> do docs/DESIGN-SYSTEM-PLAN.md.
Crie as tarefas (TaskCreate), implemente, rode npm run check:ds, os testes e os dois builds,
e atualize o README quando necessário. Mostre o resumo (arquivos principais, efeito prático,
decisões tomadas) e pare no gate. Não commite sem eu confirmar a mensagem (pt-BR, Conventional Commits).
```

**Quando travar ou houver conflito com o plano:**

```text
Pare. Explique o conflito, as alternativas com trade-offs e recomende uma. Não prossiga sem minha decisão.
```

---

## 20. Pontos a verificar (não assumir)

| Ponto                                                                                                                                          | Por que verificar                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `calc(var(--shy-responsive-unit) * N)` em `border-width`, `outline-*`, `box-shadow`, `translate()`, `text-underline-offset`, `backdrop-filter` | Garante que a regra D8 vale em todas as propriedades usadas    |
| Arredondamento de borda fracionária (`ru*0.5`) em telas de densidades diferentes                                                               | Evita borda sumindo ou grossa demais                           |
| Valores da escala (texto, controles) nos viewports de referência                                                                               | Calibração final feita por você na página `/foundations/units` |
| Existência/estabilidade de `animate.enter`/`animate.leave` no Angular 21                                                                       | Define se `@if` anima sem lib; senão `animateOut`              |
| Test runner configurado para o workspace (`@angular/build:unit-test`)                                                                          | Evita adicionar o runner errado                                |
| Suporte de jsdom/happy-dom a `<dialog>.showModal` e Popover API                                                                                | Decide stubs nos testes                                        |
| Baseline atual de `@starting-style`, `transition-behavior: allow-discrete`, Popover API, CSS Anchor Positioning                                | Define o que é progressivo e o que é obrigatório               |
| Consumo de `index.css` com `@font-face` relativo (angular.json vs `@import`)                                                                   | Garante que as fontes cheguem ao build do app consumidor       |
| `publish.yml` / `publish-pkg.sh`                                                                                                               | Não quebrar a publicação ao mexer em versão/arquivos           |
| Licença de cada fonte na página oficial                                                                                                        | Obrigação de incluir o texto da OFL                            |
