/** Camadas da escala de z-index (mesma ordem de `tokens/layers.css` e `$layers`). */
export const SHY_LAYERS = ['base', 'raised', 'dropdown', 'sticky', 'fixed', 'drawer', 'modal', 'popover', 'tooltip', 'toast'] as const;
export type ShyLayer = (typeof SHY_LAYERS)[number];

/** Camadas que um overlay do `OverlayService` pode ocupar. */
export type ShyOverlayLayer = Extract<ShyLayer, 'dropdown' | 'drawer' | 'modal' | 'popover' | 'tooltip' | 'toast'>;

/**
 * Lado + alinhamento, em termos lógicos: `start`/`end` seguem a direção do texto (RTL inverte).
 * Em `top`/`bottom` o alinhamento é no eixo inline; em `start`/`end`, no eixo de bloco (`-start` = topo).
 */
export type ShySide = 'top' | 'bottom' | 'start' | 'end';
export type ShyPlacement = ShySide | `${ShySide}-start` | `${ShySide}-end`;

/** Foco ao abrir: primeiro focável (ou `[autofocus]`), o próprio painel, nenhum ou um elemento. */
export type ShyInitialFocus = 'first' | 'pane' | 'none' | HTMLElement;
