import { TestBed } from '@angular/core/testing';
import { provideShyPlatform, createShyMemorySink } from '@shyland-dev/utils/testing';
import { SHY_LOGGER_CONFIG, createShyLogger, injectShyLogger, provideShyLogger, shyMatchNamespace } from './shy-logger';

describe('shyMatchNamespace', () => {
  it('sem filtro libera tudo', () => expect(shyMatchNamespace('Cart', '')).toBe(true));
  it('aceita wildcard e vírgula', () => {
    expect(shyMatchNamespace('Cart.items', 'Cart*,Auth')).toBe(true);
    expect(shyMatchNamespace('Home', 'Cart*,Auth')).toBe(false);
  });
  it('exclusão vence e só exclusões liberam o resto', () => {
    expect(shyMatchNamespace('Cart.verbose', 'Cart*,-Cart.verbose')).toBe(false);
    expect(shyMatchNamespace('Home', '-Cart*')).toBe(true);
    expect(shyMatchNamespace('Cart', '-Cart*')).toBe(false);
  });
});

describe('createShyLogger', () => {
  it('envia entradas ao sink com namespace e nível', () => {
    const sink = createShyMemorySink();
    const log = createShyLogger('Cart', { sink });
    log.info('a', 1);
    log.error('b');
    expect(sink.entries).toEqual([
      { level: 'info', namespace: 'Cart', args: ['a', 1] },
      { level: 'error', namespace: 'Cart', args: ['b'] },
    ]);
  });

  it('respeita nível mínimo e filtro de namespace', () => {
    const sink = createShyMemorySink();
    createShyLogger('Cart', { sink, level: 'warn' }).info('x');
    createShyLogger('Cart', { sink, level: 'warn' }).warn('y');
    createShyLogger('Home', { sink, namespaces: 'Cart' }).error('z');
    expect(sink.entries.map((e) => e.args[0])).toEqual(['y']);
  });

  it('lê o filtro de localStorage.shyLog quando a config não define', () => {
    const sink = createShyMemorySink();
    localStorage.setItem('shyLog', 'Only');
    try {
      createShyLogger('Other', { sink }).info('x');
      createShyLogger('Only', { sink }).info('y');
    } finally {
      localStorage.removeItem('shyLog');
    }
    expect(sink.entries.map((e) => e.args[0])).toEqual(['y']);
  });

  it('escreve no console com prefixo quando não há sink', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    createShyLogger('Cart').info('oi');
    expect(spy.mock.calls[0][0]).toBe('%c[shy:Cart]');
    expect(spy.mock.calls[0][2]).toBe('oi');
    spy.mockRestore();
  });

  it('group, time, table, assert e trace usam o console', () => {
    const names = ['group', 'groupEnd', 'time', 'timeEnd', 'table', 'assert', 'trace'] as const;
    const spies = names.map((n) => vi.spyOn(console, n).mockImplementation(() => undefined));
    const log = createShyLogger('P');
    log.group('g');
    log.groupEnd();
    log.time('t');
    log.timeEnd('t');
    log.table([1]);
    log.assert(false, 'm');
    log.trace('t');
    spies.forEach((s) => {
      expect(s).toHaveBeenCalledTimes(1);
      s.mockRestore();
    });
  });
});

describe('DI do logger', () => {
  it('injectShyLogger usa a config provida', () => {
    const sink = createShyMemorySink();
    TestBed.configureTestingModule({ providers: [provideShyLogger({ sink })] });
    TestBed.runInInjectionContext(() => injectShyLogger('Di').warn('w'));
    expect(sink.entries).toHaveLength(1);
  });

  it('config padrão é vazia', () => {
    expect(TestBed.inject(SHY_LOGGER_CONFIG)).toEqual({});
  });
});

describe('provideShyPlatform', () => {
  it('é um provider de PLATFORM_ID', () => {
    expect(provideShyPlatform('server')).toMatchObject({ useValue: 'server' });
  });
});
