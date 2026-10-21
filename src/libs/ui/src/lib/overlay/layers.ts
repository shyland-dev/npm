import { SHY_LAYERS, ShyLayer } from '../types/overlay/overlay.type';

/** Posição da camada na escala (0 = `base`). Serve de rank para a promoção do `OverlayService`. */
export const layerRank = (layer: ShyLayer): number => SHY_LAYERS.indexOf(layer);

/**
 * z-index de uma camada lido de `--shy-z-*` (equivalente TS do `z()` do SCSS, para elementos criados em runtime).
 * Sem documento ou sem o token (SSR, CSS não carregado), usa o padrão da lib (passo de 100).
 */
export function shyLayer(layer: ShyLayer, doc: Document | null = typeof document === 'undefined' ? null : document): number {
  const fallback = layerRank(layer) * 100;
  const view = doc?.defaultView;
  if (!doc || !view) return fallback;
  const value = parseInt(view.getComputedStyle(doc.documentElement).getPropertyValue(`--shy-z-${layer}`), 10);
  return Number.isNaN(value) ? fallback : value;
}
