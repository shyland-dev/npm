import { Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delayedFlag } from './delayed-flag';

describe('delayedFlag', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const setup = (opts = {}) => {
    const source = signal(false);
    const flag = delayedFlag(source, { injector: TestBed.inject(Injector), ...opts });
    const set = async (v: boolean) => {
      source.set(v);
      TestBed.tick();
      await vi.advanceTimersByTimeAsync(0);
    };
    return { flag, set };
  };

  it('carga rápida (menos que delay) nunca liga', async () => {
    const { flag, set } = setup();
    await set(true);
    await vi.advanceTimersByTimeAsync(150);
    await set(false);
    await vi.advanceTimersByTimeAsync(1000);
    expect(flag()).toBe(false);
  });

  it('liga após o delay e fica ligada pelo menos minDuration', async () => {
    const { flag, set } = setup();
    await set(true);
    await vi.advanceTimersByTimeAsync(200);
    expect(flag()).toBe(true);

    await vi.advanceTimersByTimeAsync(100);
    await set(false);
    expect(flag()).toBe(true); // só 100 ms desde que ligou; faltam 300
    await vi.advanceTimersByTimeAsync(299);
    expect(flag()).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    expect(flag()).toBe(false);
  });

  it('carga longa desliga na hora quando termina depois de minDuration', async () => {
    const { flag, set } = setup({ delay: 100, minDuration: 300 });
    await set(true);
    await vi.advanceTimersByTimeAsync(1000);
    expect(flag()).toBe(true);
    await set(false);
    expect(flag()).toBe(false);
  });
});
