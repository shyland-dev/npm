import { PLATFORM_ID, Provider } from '@angular/core';
import { ShyLogEntry, ShyLogSink } from '@shyland-dev/utils';

export interface ShyMemorySink extends ShyLogSink {
  readonly entries: ShyLogEntry[];
  clear(): void;
}

/** Sink em memória para asserts nos testes: `provideShyLogger({ sink: createShyMemorySink() })`. */
export function createShyMemorySink(): ShyMemorySink {
  const entries: ShyLogEntry[] = [];
  return {
    entries,
    write: (entry) => entries.push(entry),
    clear: () => (entries.length = 0),
  };
}

/** Força o `PLATFORM_ID` para testar o caminho de SSR (`server`) ou browser. */
export function provideShyPlatform(platform: 'browser' | 'server'): Provider {
  return { provide: PLATFORM_ID, useValue: platform };
}
