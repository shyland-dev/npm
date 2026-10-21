export interface AnimateOutOptions {
  /** Só conta o `animationend` desta animação (ex.: `shy-fade-out`); sem ele, vale a mais longa do elemento. */
  name?: string;
  /** Chamado ao fim da saída, antes de remover `data-state` (ex.: `dialog.close()`, `el.hidePopover()`). */
  onDone?: () => void;
}

/** Margem do timer de segurança, para o evento chegar primeiro quando existir. */
const SAFETY_MS = 50;

/**
 * Saída animada de `<dialog>`/`[popover]` (plano 9.4): marca `data-state="closing"`, espera a animação/transição
 * do próprio elemento (o CSS dele define a saída para esse estado) e só então chama `onDone`.
 * Timer de segurança pela duração computada (vinda dos tokens `--shy-duration-*`), caso o evento não chegue.
 * Com reduced motion (`prefers-reduced-motion` ou `data-motion="reduced"`) termina na hora.
 * Para elementos de `@if`/`@for`, use `animate.leave` do Angular (ADR-F0-3).
 */
export function animateOut(el: HTMLElement, options: AnimateOutOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      el.removeEventListener('animationend', onEnd);
      el.removeEventListener('transitionend', onEnd);
      options.onDone?.();
      el.removeAttribute('data-state');
      resolve();
    };

    el.setAttribute('data-state', 'closing');
    const { total, longest } = exitTiming(el);
    if (total < 1 || reducedMotion(el)) return finish();

    // Eventos de filhos sobem até aqui; só conta o do próprio elemento e, em transições, a mais longa.
    function onEnd(event: Event) {
      if (event.target !== el) return;
      const animationName = (event as AnimationEvent).animationName;
      if (options.name && animationName !== undefined && animationName !== options.name) return;
      if (event.type === 'transitionend' && (event as TransitionEvent).elapsedTime * 1000 < longest - 1) return;
      finish();
    }

    el.addEventListener('animationend', onEnd);
    el.addEventListener('transitionend', onEnd);
    timer = setTimeout(finish, total + SAFETY_MS);
  });
}

function exitTiming(el: HTMLElement): { total: number; longest: number } {
  const view = el.ownerDocument.defaultView;
  if (!view) return { total: 0, longest: 0 };

  const style = view.getComputedStyle(el);
  const pairs = [...withDelay(style.animationDuration, style.animationDelay), ...withDelay(style.transitionDuration, style.transitionDelay)];
  return {
    total: Math.max(0, ...pairs.map(([d, delay]) => d + delay)),
    longest: Math.max(0, ...pairs.map(([d]) => d)),
  };
}

/** Listas de duração e atraso se repetem até o tamanho uma da outra (regra do CSS). */
function withDelay(durations: string | undefined, delays: string | undefined): [number, number][] {
  const d = ms(durations);
  const dl = ms(delays);
  return d.map((value, i) => [value, dl.length ? dl[i % dl.length] : 0]);
}

/** `"0.2s, 120ms"` → `[200, 120]`. */
function ms(value: string | undefined): number[] {
  if (!value) return [];
  return value.split(',').map((part) => {
    const n = parseFloat(part);
    if (Number.isNaN(n)) return 0;
    return part.trim().endsWith('ms') ? n : n * 1000;
  });
}

function reducedMotion(el: HTMLElement): boolean {
  const doc = el.ownerDocument;
  if (doc.documentElement.getAttribute('data-motion') === 'reduced') return true;
  return doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
