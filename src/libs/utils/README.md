# @shyland-dev/utils

Utilitários Angular da Shyland Dev: log só para desenvolvimento (`ng serve`), asserts de dev, helpers de injeção e signals.

## Requisitos

- Angular **21.2+** (peers: `@angular/core`, `@angular/common`)
- Zero dependências de runtime além de `tslib`; compatível com zoneless e SSR; `sideEffects: false`

```bash
npm install @shyland-dev/utils
```

## Logger (só em desenvolvimento)

Só escreve em modo de desenvolvimento (durante o `ng serve`). Em produção o logger é vazio.

```typescript
import { createShyLogger, injectShyLogger, provideShyLogger } from '@shyland-dev/utils';

const log = createShyLogger('Cart'); // funciona em qualquer lugar (guards, interceptors funcionais...)
log.debug('carregado', items); // [shy:Cart] carregado ...
log.info('a');
log.warn('b');
log.error('c');
log.group('checkout');
log.groupEnd();
log.time('load');
log.timeEnd('load');
log.table(items);
log.assert(items.length > 0, 'vazio');
log.trace('origem');

// Em contexto de injeção, usando a config do app:
const logger = injectShyLogger('Cart');
```

| Método                                      | Console           |
| ------------------------------------------- | ----------------- |
| `debug`                                     | `console.log`     |
| `info` / `warn` / `error`                   | o método homônimo |
| `group`, `time`, `table`, `assert`, `trace` | o método homônimo |

`debug` usa `console.log` porque o Chrome esconde `console.debug` no nível "Verbose" por padrão.

**Configuração por app** (opcional):

```typescript
bootstrapApplication(App, { providers: [provideShyLogger({ level: 'info', namespaces: 'Cart*,-Cart.verbose' })] });
```

**Filtro de namespaces** (padrão do pacote `debug`): lista separada por vírgula, `*` como coringa e `-` para excluir. Sem `namespaces` na config, vale `localStorage.shyLog`, ex.: `localStorage.shyLog = 'Cart*'` e recarregue.

**Sink** (destino): troque o `console` por `ShyLogSink` (`{ write(entry) }`), útil em testes (ver `/testing`).

> **Produção:** os métodos de log, `shyInvariant`, `shyDeprecated` etc. usam um guard literal de `ngDevMode` (definido como `false` pelo build de produção do Angular). Em produção `createShyLogger` devolve um logger vazio e o código do logger sai do bundle (medido em 2026-10-26). Não há recurso para logar em produção. Para o guard funcionar, use o builder do Angular (`@angular/build:application`); em outros bundlers, defina `ngDevMode=false` no build de produção.

### `DebugService` (depreciado)

`@deprecated`: use `createShyLogger`. Continua funcionando igual (`[debug] @Componente#metodo`) e será removido numa próxima minor. Migração: `this.debug.log(this, x)` vira `const log = createShyLogger('MeuComponente'); log.debug(x)`.

## Asserts e avisos de dev

| Export                             | O que faz                                                              |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `shyInvariant(cond, msg)`          | Lança `Error` só em dev (`asserts cond`); no-op em produção            |
| `shyDevOnly(fn)`                   | Executa `fn` só em dev e devolve o resultado (`undefined` fora dele)   |
| `shyDeprecated(nome, substituto?)` | `console.warn` uma vez por nome, só em dev                             |
| `shyMeasure(nome, fn)`             | Mede `fn` (síncrona ou Promise) com `performance.measure`, loga em dev |
| `resetShyDeprecations()`           | Zera o "uma vez" do `shyDeprecated` (testes)                           |

## Injeção, plataforma e storage

| Export                               | O que faz                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `assertShyInjectionContext(fn)`      | `assertInInjectionContext` com o nome da função pública no erro                                  |
| `onShyDestroy(cb)`                   | `DestroyRef.onDestroy` com assert de contexto; devolve a função que cancela                      |
| `injectShyPlatform()`                | `{ isBrowser, isServer }`                                                                        |
| `shyStorage(chave, fallback, opts?)` | `WritableSignal` persistido em `localStorage`/`sessionStorage` (JSON), sync entre abas, SSR-safe |

```typescript
const theme = shyStorage<'dark' | 'light' | 'system'>('theme', 'dark', {
    validate: (v): v is 'dark' | 'light' | 'system' => v === 'dark' || v === 'light' || v === 'system',
});
theme.set('light'); // persiste; no servidor vira um signal comum
```

## Signals e guards

| Export                                                         | O que faz                                                                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `injectShyMediaQuery(query, initial?)`                         | `Signal<boolean>` de `matchMedia` (`(prefers-reduced-motion: reduce)`, `(hover: hover)`...); `initial` no servidor |
| `shyDebounced(signal, ms)`                                     | Signal derivado que assume o valor depois de `ms` sem mudanças                                                     |
| `shyIsDefined`, `shyIsString`, `shyIsRecord`, `shyAssertNever` | Type guards e checagem de exaustividade                                                                            |

## Testes: `@shyland-dev/utils/testing`

```typescript
import { createShyMemorySink, provideShyPlatform } from '@shyland-dev/utils/testing';

const sink = createShyMemorySink();
TestBed.configureTestingModule({ providers: [provideShyLogger({ sink }), provideShyPlatform('server')] });
// sink.entries: [{ level, namespace, args }]
```

## Repository

[github.com/shyland-dev/npm](https://github.com/shyland-dev/npm)
