import { shyAssertNever, shyIsDefined, shyIsRecord, shyIsString } from './guards';

describe('guards', () => {
  it('shyIsDefined', () => {
    expect([0, '', false].every(shyIsDefined)).toBe(true);
    expect(shyIsDefined(null)).toBe(false);
    expect(shyIsDefined(undefined)).toBe(false);
  });
  it('shyIsString', () => {
    expect(shyIsString('a')).toBe(true);
    expect(shyIsString(1)).toBe(false);
  });
  it('shyIsRecord', () => {
    expect(shyIsRecord({})).toBe(true);
    expect(shyIsRecord([])).toBe(false);
    expect(shyIsRecord(null)).toBe(false);
  });
  it('shyAssertNever lança', () => {
    expect(() => shyAssertNever('x' as never)).toThrow('[shy] valor inesperado: x');
  });
});
