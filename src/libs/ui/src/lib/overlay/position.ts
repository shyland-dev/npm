import { ShyPositionResult, ShyRect } from '../interfaces/overlay/overlay.interface';
import { ShyPlacement, ShySide } from '../types/overlay/overlay.type';

export interface ShyComputePositionOptions {
  placement?: ShyPlacement;
  /** Em px (o `OverlayService` converte de ru). */
  offset?: number;
  /** Em px. */
  padding?: number;
  flip?: boolean;
  shift?: boolean;
  matchWidth?: boolean;
  rtl?: boolean;
}

type Physical = 'top' | 'bottom' | 'left' | 'right';
type Align = 'center' | 'start' | 'end';

const OPPOSITE: Record<ShySide, ShySide> = { top: 'bottom', bottom: 'top', start: 'end', end: 'start' };

/**
 * Posição de um painel flutuante junto à âncora (plano 11.2). TS puro sobre retângulos: não toca o DOM, então roda em SSR
 * e nos testes. Quem chama mede (`getBoundingClientRect`, `visualViewport`) e aplica o resultado.
 */
export function computePosition(anchor: ShyRect, floating: { width: number; height: number }, viewport: ShyRect, options: ShyComputePositionOptions = {}): ShyPositionResult {
  const { offset = 0, padding = 0, flip = true, shift = true, matchWidth = false, rtl = false } = options;
  const [side, align] = parse(options.placement ?? 'bottom-start');
  const width = matchWidth && (side === 'top' || side === 'bottom') ? anchor.width : floating.width;
  const size = { width, height: floating.height };

  let finalSide = side;
  let point = place(anchor, size, physical(side, rtl), align, offset, rtl);
  if (flip) {
    const over = overflow(point, size, viewport, padding, physical(side, rtl));
    if (over > 0) {
      const other = OPPOSITE[side];
      const alt = place(anchor, size, physical(other, rtl), align, offset, rtl);
      // Só troca se o lado oposto ficar melhor; se nenhum couber, fica onde transborda menos.
      if (overflow(alt, size, viewport, padding, physical(other, rtl)) < over) {
        finalSide = other;
        point = alt;
      }
    }
  }

  if (shift) {
    if (finalSide === 'top' || finalSide === 'bottom') point.x = clamp(point.x, viewport.x + padding, viewport.x + viewport.width - padding - size.width);
    else point.y = clamp(point.y, viewport.y + padding, viewport.y + viewport.height - padding - size.height);
  }

  const placement = (align === 'center' ? finalSide : `${finalSide}-${align}`) as ShyPlacement;
  return matchWidth ? { ...point, placement, width } : { ...point, placement };
}

function parse(placement: ShyPlacement): [ShySide, Align] {
  const [side, align] = placement.split('-') as [ShySide, Align | undefined];
  return [side, align ?? 'center'];
}

function physical(side: ShySide, rtl: boolean): Physical {
  if (side === 'start') return rtl ? 'right' : 'left';
  if (side === 'end') return rtl ? 'left' : 'right';
  return side;
}

function place(a: ShyRect, f: { width: number; height: number }, side: Physical, align: Align, offset: number, rtl: boolean): { x: number; y: number } {
  if (side === 'top' || side === 'bottom') {
    const y = side === 'bottom' ? a.y + a.height + offset : a.y - offset - f.height;
    // No eixo inline, `start` é a esquerda em LTR e a direita em RTL.
    const startX = rtl ? a.x + a.width - f.width : a.x;
    const endX = rtl ? a.x : a.x + a.width - f.width;
    const x = align === 'center' ? a.x + (a.width - f.width) / 2 : align === 'start' ? startX : endX;
    return { x, y };
  }
  const x = side === 'right' ? a.x + a.width + offset : a.x - offset - f.width;
  const y = align === 'center' ? a.y + (a.height - f.height) / 2 : align === 'start' ? a.y : a.y + a.height - f.height;
  return { x, y };
}

/** Quanto o painel passa da viewport no lado em que foi colocado (≤ 0 = cabe). */
function overflow(p: { x: number; y: number }, f: { width: number; height: number }, v: ShyRect, padding: number, side: Physical): number {
  switch (side) {
    case 'bottom':
      return p.y + f.height - (v.y + v.height - padding);
    case 'top':
      return v.y + padding - p.y;
    case 'right':
      return p.x + f.width - (v.x + v.width - padding);
    case 'left':
      return v.x + padding - p.x;
  }
}

/** Se o painel for maior que o espaço, encosta no início (o começo do conteúdo fica visível). */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
