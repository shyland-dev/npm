import { animateOut } from './animate-out';

describe('animateOut', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
    document.documentElement.removeAttribute('data-motion');
    vi.useRealTimers();
  });

  function endEvent(type: 'animationend' | 'transitionend', init: { animationName?: string; elapsedTime?: number } = {}) {
    return Object.assign(new Event(type, { bubbles: true }), init);
  }

  it('sem duração termina na hora e chama onDone', async () => {
    const onDone = vi.fn();
    await animateOut(el, { onDone });

    expect(onDone).toHaveBeenCalledOnce();
    expect(el.hasAttribute('data-state')).toBe(false);
  });

  it('marca data-state="closing" e espera o animationend do próprio elemento', async () => {
    el.style.animationDuration = '200ms';
    const onDone = vi.fn();
    const promise = animateOut(el, { onDone });

    expect(el.getAttribute('data-state')).toBe('closing');

    const child = el.appendChild(document.createElement('span'));
    child.dispatchEvent(endEvent('animationend', { animationName: 'shy-fade-out' }));
    expect(onDone).not.toHaveBeenCalled();

    el.dispatchEvent(endEvent('animationend', { animationName: 'shy-fade-out' }));
    await promise;
    expect(onDone).toHaveBeenCalledOnce();
    expect(el.hasAttribute('data-state')).toBe(false);
  });

  it('com name ignora outras animações', async () => {
    el.style.animationDuration = '200ms';
    const onDone = vi.fn();
    const promise = animateOut(el, { name: 'shy-scale-out', onDone });

    el.dispatchEvent(endEvent('animationend', { animationName: 'shy-fade-out' }));
    expect(onDone).not.toHaveBeenCalled();

    el.dispatchEvent(endEvent('animationend', { animationName: 'shy-scale-out' }));
    await promise;
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('transição só termina no transitionend da mais longa', async () => {
    el.style.transitionProperty = 'opacity, transform';
    el.style.transitionDuration = '120ms, 320ms';
    const onDone = vi.fn();
    const promise = animateOut(el, { onDone });

    el.dispatchEvent(endEvent('transitionend', { elapsedTime: 0.12 }));
    expect(onDone).not.toHaveBeenCalled();

    el.dispatchEvent(endEvent('transitionend', { elapsedTime: 0.32 }));
    await promise;
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('timer de segurança termina se o evento não chegar', async () => {
    vi.useFakeTimers();
    el.style.animationDuration = '0.2s';
    el.style.animationDelay = '0.1s';
    const onDone = vi.fn();
    const promise = animateOut(el, { onDone });

    vi.advanceTimersByTime(300);
    expect(onDone).not.toHaveBeenCalled();

    vi.advanceTimersByTime(60);
    await promise;
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('data-motion="reduced" termina na hora', async () => {
    document.documentElement.setAttribute('data-motion', 'reduced');
    el.style.animationDuration = '200ms';
    const onDone = vi.fn();
    await animateOut(el, { onDone });

    expect(onDone).toHaveBeenCalledOnce();
  });
});
