import { TestBed } from '@angular/core/testing';
import { provideShyPlatform } from '@shyland-dev/utils/testing';
import { shyIsRecord } from '../guards/guards';
import { shyStorage } from './shy-storage';

describe('shyStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  const create = <T>(key: string, fallback: T, options?: Parameters<typeof shyStorage<T>>[2]) => TestBed.runInInjectionContext(() => shyStorage(key, fallback, options));

  it('usa o fallback e persiste set/update como JSON', () => {
    const s = create('k', { a: 1 });
    expect(s()).toEqual({ a: 1 });
    s.set({ a: 2 });
    s.update((v) => ({ a: v.a + 1 }));
    expect(localStorage.getItem('k')).toBe('{"a":3}');
    expect(create('k', { a: 0 })()).toEqual({ a: 3 });
  });

  it('usa sessionStorage quando pedido', () => {
    create('s', 1, { storage: 'session' }).set(2);
    expect(sessionStorage.getItem('s')).toBe('2');
    expect(localStorage.getItem('s')).toBeNull();
  });

  it('JSON inválido ou rejeitado pelo validate vira fallback', () => {
    localStorage.setItem('bad', '{oops');
    expect(create('bad', 5)()).toBe(5);
    localStorage.setItem('v', '"texto"');
    expect(create<Record<string, unknown>>('v', { ok: true }, { validate: shyIsRecord })()).toEqual({ ok: true });
  });

  it('sincroniza com o evento storage de outra aba', () => {
    const s = create('sync', 'a');
    localStorage.setItem('sync', '"b"');
    window.dispatchEvent(new StorageEvent('storage', { key: 'sync', storageArea: localStorage }));
    expect(s()).toBe('b');
  });

  it('no servidor é um signal em memória', () => {
    TestBed.configureTestingModule({ providers: [provideShyPlatform('server')] });
    const s = create('srv', 1);
    s.set(2);
    expect(s()).toBe(2);
    expect(localStorage.getItem('srv')).toBeNull();
  });

  it('não quebra se o storage lançar', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('cheio');
    });
    const s = create('q', 1);
    expect(() => s.set(2)).not.toThrow();
    expect(s()).toBe(2);
    spy.mockRestore();
  });
});
