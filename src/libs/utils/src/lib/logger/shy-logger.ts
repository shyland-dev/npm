import { EnvironmentProviders, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';

// Definido pelo build de produção do Angular (false). O guard literal permite ao bundler remover o código.
declare const ngDevMode: boolean | undefined;

export type ShyLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ShyLogEntry {
  level: ShyLogLevel;
  namespace: string;
  args: unknown[];
}

/** Destino das mensagens. O padrão escreve no `console`; troque (ex.: nos testes) via `ShyLoggerConfig.sink`. */
export interface ShyLogSink {
  write(entry: ShyLogEntry): void;
}

export interface ShyLoggerConfig {
  /** Nível mínimo. Padrão: `debug`. */
  level?: ShyLogLevel;
  /**
   * Filtro de namespaces separado por vírgula, com `*` e prefixo `-` para excluir (ex.: `Cart*,-Cart.verbose`).
   * Sem valor, usa `localStorage.shyLog` e, se ausente, tudo.
   */
  namespaces?: string;
  sink?: ShyLogSink;
}

export interface ShyLogger {
  readonly namespace: string;
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  group(label: string): void;
  groupEnd(): void;
  time(label: string): void;
  timeEnd(label: string): void;
  table(data: unknown): void;
  assert(condition: unknown, ...args: unknown[]): void;
  trace(...args: unknown[]): void;
}

export const SHY_LOGGER_CONFIG = new InjectionToken<ShyLoggerConfig>('SHY_LOGGER_CONFIG', {
  providedIn: 'root',
  factory: () => ({}),
});

export function provideShyLogger(config: ShyLoggerConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: SHY_LOGGER_CONFIG, useValue: config }]);
}

/** Cria um logger com o `SHY_LOGGER_CONFIG` do injector atual. Chame em contexto de injeção. */
export function injectShyLogger(namespace: string): ShyLogger {
  return createShyLogger(namespace, inject(SHY_LOGGER_CONFIG));
}

const LEVELS: Record<ShyLogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

// `debug` usa console.log: o Chrome esconde console.debug no nível "Verbose" por padrão.
const CONSOLE_METHOD: Record<ShyLogLevel, 'log' | 'info' | 'warn' | 'error'> = {
  debug: 'log',
  info: 'info',
  warn: 'warn',
  error: 'error',
};

const consoleSink: ShyLogSink = {
  write({ level, namespace, args }) {
    console[CONSOLE_METHOD[level]](`%c[shy:${namespace}]`, `color: hsl(${hue(namespace)} 70% 55%); font-weight: bold`, ...args);
  },
};

function hue(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 360;
  return hash;
}

function storedFilter(): string {
  try {
    return globalThis.localStorage?.getItem('shyLog') ?? '';
  } catch {
    return '';
  }
}

function toRegExp(pattern: string): RegExp {
  return new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
}

/** Avalia o filtro de namespaces: vazio = tudo; só exclusões = tudo menos elas. */
export function shyMatchNamespace(namespace: string, filter: string): boolean {
  const patterns = filter
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!patterns.length) return true;
  let allowed = !patterns.some((p) => !p.startsWith('-'));
  for (const pattern of patterns) {
    const excluded = pattern.startsWith('-');
    if (!toRegExp(excluded ? pattern.slice(1) : pattern).test(namespace)) continue;
    if (excluded) return false;
    allowed = true;
  }
  return allowed;
}

/**
 * Logger com namespace, níveis e filtro. Só escreve em modo de desenvolvimento (`ng serve`).
 * Em produção devolve um logger vazio e o código do logger sai do bundle (guard literal de `ngDevMode`).
 */
export function createShyLogger(namespace: string, config: ShyLoggerConfig = {}): ShyLogger {
  // A condição precisa ser constante em produção para o bundler descartar `buildLogger` e seus helpers.
  return typeof ngDevMode === 'undefined' || ngDevMode ? buildLogger(namespace, config) : noopLogger(namespace);
}

function buildLogger(namespace: string, config: ShyLoggerConfig): ShyLogger {
  const sink = config.sink ?? consoleSink;
  const minLevel = LEVELS[config.level ?? 'debug'];

  const enabled = (level: ShyLogLevel): boolean => LEVELS[level] >= minLevel && shyMatchNamespace(namespace, config.namespaces ?? storedFilter());
  const emit = (level: ShyLogLevel, args: unknown[]): void => {
    if (enabled(level)) sink.write({ level, namespace, args });
  };
  const tag = `[shy:${namespace}]`;

  return {
    namespace,
    debug: (...args) => emit('debug', args),
    info: (...args) => emit('info', args),
    warn: (...args) => emit('warn', args),
    error: (...args) => emit('error', args),
    group: (label) => enabled('debug') && console.group(`${tag} ${label}`),
    groupEnd: () => enabled('debug') && console.groupEnd(),
    time: (label) => enabled('debug') && console.time(`${tag} ${label}`),
    timeEnd: (label) => enabled('debug') && console.timeEnd(`${tag} ${label}`),
    table: (data) => enabled('debug') && console.table(data),
    assert: (condition, ...args) => enabled('error') && console.assert(!!condition, tag, ...args),
    trace: (...args) => enabled('debug') && console.trace(tag, ...args),
  };
}

function noopLogger(namespace: string): ShyLogger {
  const noop = (): void => undefined;
  return { namespace, debug: noop, info: noop, warn: noop, error: noop, group: noop, groupEnd: noop, time: noop, timeEnd: noop, table: noop, assert: noop, trace: noop };
}
