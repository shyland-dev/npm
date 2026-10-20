import { ru } from './ru';

describe('ru()', () => {
  it('gera o calc com a unidade responsiva', () => {
    expect(ru(4)).toBe('calc(var(--shy-responsive-unit) * 4)');
  });

  it('aceita decimais e negativos', () => {
    expect(ru(0.5)).toBe('calc(var(--shy-responsive-unit) * 0.5)');
    expect(ru(-1)).toBe('calc(var(--shy-responsive-unit) * -1)');
  });
});
