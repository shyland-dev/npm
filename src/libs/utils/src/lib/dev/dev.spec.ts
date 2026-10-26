import { resetShyDeprecations, shyDeprecated, shyDevOnly, shyInvariant, shyMeasure } from './dev';

describe('dev helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    resetShyDeprecations();
  });

  it('shyInvariant lança só em dev', () => {
    expect(() => shyInvariant(false, 'x')).toThrow('[shy] invariant: x');
    expect(() => shyInvariant(1, 'x')).not.toThrow();
  });

  it('shyDevOnly executa a função em dev', () => {
    expect(shyDevOnly(() => 7)).toBe(7);
  });

  it('shyDeprecated avisa uma vez por nome', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    shyDeprecated('old', 'new');
    shyDeprecated('old', 'new');
    shyDeprecated('other');
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0].join(' ')).toContain('Use "new"');
  });

  it('shyMeasure devolve o resultado e loga a duração (síncrono e Promise)', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    expect(shyMeasure('sync', () => 3)).toBe(3);
    expect(await shyMeasure('async', async () => 4)).toBe(4);
    await Promise.resolve();
    expect(log).toHaveBeenCalledTimes(2);
  });
});

describe('dev helpers fora de dev', () => {
  const g = globalThis as { ngDevMode?: unknown };
  let original: unknown;
  beforeEach(() => {
    original = g.ngDevMode;
    g.ngDevMode = false; // isDevMode() lê esta global
  });
  afterEach(() => {
    g.ngDevMode = original;
    vi.restoreAllMocks();
  });

  it('viram no-op', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(() => shyInvariant(false, 'x')).not.toThrow();
    expect(shyDevOnly(() => 7)).toBeUndefined();
    shyDeprecated('a');
    expect(shyMeasure('m', () => 1)).toBe(1);
    expect(log).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});
