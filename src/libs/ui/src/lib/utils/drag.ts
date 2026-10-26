/** Medida de ponteiro como valor CSS. É deslocamento real do dedo (não um tamanho de design), por isso a unidade é a do evento. */
export const devicePx = (n: number): string => `${n}px`;

export interface DragEnd {
  /** Deslocamento final no eixo, em coordenadas de tela e já filtrado pelo sentido permitido (negativo = esquerda/cima). */
  offset: number;
  /** Tamanho do elemento no eixo (largura ou altura). */
  size: number;
  /** Velocidade final no sentido do deslocamento, em px/ms (positiva = indo para longe do ponto de partida; nunca negativa). */
  velocity: number;
  /** `pointercancel` (o navegador assumiu o gesto, p.ex. scroll): o consumidor deve voltar ao repouso. */
  cancelled: boolean;
}

export interface DragOptions {
  axis: 'x' | 'y';
  /** Sentido permitido em coordenadas de tela: `1` (direita/baixo), `-1` (esquerda/cima) ou `0` (ambos). */
  sign: 1 | -1 | 0;
  /** Tipos de ponteiro que iniciam o arrasto. Padrão: toque e caneta (mouse brigaria com a seleção de texto). */
  pointerTypes?: readonly string[];
  /** Decide, no `pointerdown`, se o gesto pode começar neste alvo. */
  canStart?: (event: PointerEvent) => boolean;
  onStart?: () => void;
  onMove: (offset: number) => void;
  onEnd: (end: DragEnd) => void;
}

/** Deslocamento mínimo (px de tela) antes de o movimento virar arrasto; abaixo disso o toque ainda pode ser um clique. */
const SLOP = 8;

/**
 * Arrasto por Pointer Events num eixo, sem dependências. Só trata o gesto: quem chama aplica o `offset` (CSS) e decide o
 * que fazer no fim. O CSS do elemento precisa de `touch-action` liberando o outro eixo (`pan-y` para arrasto em x), senão
 * o navegador rouba o gesto. Se o movimento começa no outro eixo, abandona e deixa o scroll nativo seguir.
 * Devolve a função que remove os ouvintes.
 */
export function trackDrag(el: HTMLElement, options: DragOptions): () => void {
  const types = options.pointerTypes ?? ['touch', 'pen'];
  const main = options.axis === 'x' ? 'clientX' : 'clientY';
  const cross = options.axis === 'x' ? 'clientY' : 'clientX';

  let id: number | null = null;
  let startMain = 0;
  let startCross = 0;
  let dragging = false;
  let offset = 0;
  let lastPos = 0;
  let lastTime = 0;
  let velocity = 0;

  const filter = (delta: number): number => (options.sign === 0 ? delta : Math.max(0, delta * options.sign));

  const reset = () => {
    if (id !== null && el.hasPointerCapture?.(id)) el.releasePointerCapture(id);
    id = null;
    dragging = false;
  };

  const onDown = (event: PointerEvent) => {
    if (id !== null || !event.isPrimary || !types.includes(event.pointerType)) return;
    if (options.canStart && !options.canStart(event)) return;
    id = event.pointerId;
    startMain = lastPos = event[main];
    startCross = event[cross];
    lastTime = event.timeStamp;
    offset = 0;
    velocity = 0;
    dragging = false;
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerId !== id) return;
    const delta = event[main] - startMain;
    if (!dragging) {
      if (Math.abs(event[cross] - startCross) > SLOP && Math.abs(event[cross] - startCross) > Math.abs(delta)) return reset();
      if (Math.abs(delta) <= SLOP || filter(delta) === 0) return;
      dragging = true;
      try {
        el.setPointerCapture?.(event.pointerId);
      } catch {
        // Sem captura o arrasto segue enquanto o ponteiro estiver sobre o elemento.
      }
      options.onStart?.();
    }
    const dt = event.timeStamp - lastTime;
    if (dt >= 16) {
      velocity = ((event[main] - lastPos) * (options.sign || Math.sign(delta) || 1)) / dt;
      lastPos = event[main];
      lastTime = event.timeStamp;
    }
    offset = options.sign === 0 ? delta : filter(delta) * options.sign;
    options.onMove(offset);
  };

  const finish = (event: PointerEvent, cancelled: boolean) => {
    if (event.pointerId !== id) return;
    const was = dragging;
    const size = options.axis === 'x' ? el.offsetWidth : el.offsetHeight;
    const end: DragEnd = { offset, size, velocity: Math.max(0, velocity), cancelled };
    reset();
    if (!was) return;
    // O toque que terminou um arrasto não deve virar clique no botão sob o dedo.
    const swallow = (e: Event) => e.stopPropagation();
    el.addEventListener('click', swallow, { capture: true, once: true });
    setTimeout(() => el.removeEventListener('click', swallow, true));
    options.onEnd(end);
  };

  const onUp = (event: PointerEvent) => finish(event, false);
  const onCancel = (event: PointerEvent) => finish(event, true);

  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onCancel);
  return () => {
    el.removeEventListener('pointerdown', onDown);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onCancel);
  };
}
