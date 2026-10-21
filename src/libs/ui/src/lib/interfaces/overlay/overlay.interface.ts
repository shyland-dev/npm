import { Injector } from '@angular/core';
import type { ShyOverlayRef } from '../../overlay/overlay-ref';
import { ShyInitialFocus, ShyOverlayLayer, ShyPlacement } from '../../types/overlay/overlay.type';

export interface ShyRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShyPositionOptions {
  /** Padrão: `bottom-start`. */
  placement?: ShyPlacement;
  /** Distância da âncora, em ru. Padrão: 2. */
  offset?: number;
  /** Respiro mínimo até a borda da viewport, em ru. Padrão: 2. */
  padding?: number;
  /** Troca para o lado oposto se não couber. Padrão: `true`. */
  flip?: boolean;
  /** Desliza no eixo cruzado para caber na viewport. Padrão: `true`. */
  shift?: boolean;
  /** Mesma largura da âncora (só em `top`/`bottom`). Padrão: `false`. */
  matchWidth?: boolean;
}

export interface ShyPositionResult {
  /** Coordenadas físicas na viewport (mesmo sistema de `getBoundingClientRect`). */
  x: number;
  y: number;
  /** Posição final, depois do flip. */
  placement: ShyPlacement;
  /** Só com `matchWidth`. */
  width?: number;
}

export interface ShyOverlayConfig<D = unknown> {
  /** Camada (ordem de empilhamento e rank da promoção). Padrão: `modal`. */
  layer?: ShyOverlayLayer;
  /** `<dialog>` modal: backdrop, `inert` no fundo, trap de Tab e scroll lock. Padrão: `true` em `modal` e `drawer`. */
  modal?: boolean;
  /** Elemento de referência para posicionar o painel. Sem ele, o painel fica centralizado (ou posicionado por `paneClass`). */
  anchor?: HTMLElement;
  position?: ShyPositionOptions;
  /** Esc fecha (só a camada do topo). Padrão: `true`. */
  closeOnEscape?: boolean;
  /** Clique fora do painel (ou no backdrop) fecha. Padrão: `true` fora de modal, `false` em modal. */
  closeOnOutsideClick?: boolean;
  /** Devolve o foco ao elemento que o tinha antes de abrir. Padrão: `true`. */
  restoreFocus?: boolean;
  /** Padrão: `first` em modal, `none` no resto. */
  initialFocus?: ShyInitialFocus;
  /** Disponível no conteúdo por `inject(SHY_OVERLAY_DATA)` (ou `$implicit` no template). */
  data?: D;
  /** Injector pai do conteúdo. Padrão: o do serviço (root). */
  injector?: Injector;
  /** Classe(s) extra(s) no painel, separadas por espaço. */
  paneClass?: string;
  /** Papel ARIA do painel (ex.: `alertdialog`). O `<dialog>` já é `dialog`. */
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

/** Contexto de um `TemplateRef` aberto pelo `OverlayService`. */
export interface ShyOverlayContext<D = unknown> {
  $implicit: D | undefined;
  overlayRef: ShyOverlayRef<any, any>;
}
