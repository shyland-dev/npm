import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideShyPlatform } from '@shyland-dev/utils/testing';
import { assertShyInjectionContext, injectShyPlatform, onShyDestroy } from './di';

describe('di helpers', () => {
  it('assertShyInjectionContext falha fora de contexto, com o nome da função', () => {
    expect(() => assertShyInjectionContext(injectShyPlatform)).toThrow(/injectShyPlatform/);
    TestBed.runInInjectionContext(() => expect(() => assertShyInjectionContext(injectShyPlatform)).not.toThrow());
  });

  it('onShyDestroy roda na destruição e pode ser cancelado', () => {
    const fn = vi.fn();
    const cancelled = vi.fn();
    @Component({ selector: 'shy-t', template: '' })
    class T {
      constructor() {
        onShyDestroy(fn);
        onShyDestroy(cancelled)();
      }
    }
    TestBed.createComponent(T).destroy();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(cancelled).not.toHaveBeenCalled();
  });

  it('injectShyPlatform reflete o PLATFORM_ID', () => {
    TestBed.configureTestingModule({ providers: [provideShyPlatform('server')] });
    expect(TestBed.runInInjectionContext(injectShyPlatform)).toEqual({ isBrowser: false, isServer: true });
    expect(inject).toBeDefined();
  });
});
