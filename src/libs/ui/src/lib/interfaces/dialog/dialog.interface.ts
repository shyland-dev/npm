import { ShyOverlayConfig } from '../overlay/overlay.interface';
import { ShyDialogPresentation, ShyDrawerSide } from '../../types/dialog/dialog.type';
import { ShyIntent } from '../../types/intent/intent.type';

/** Config do `DialogService.open`: a do overlay, sem o que o Dialog já decide (camada modal, sem âncora). */
export type ShyDialogBaseConfig<D = unknown> = Omit<ShyOverlayConfig<D>, 'layer' | 'modal' | 'anchor' | 'position'>;

export type ShyDialogConfig<D = unknown> = ShyDialogBaseConfig<D> & {
  /** Padrão: `center`. `sheet` cola o diálogo na base em largura total; `auto` faz isso só em `portrait`. */
  presentation?: ShyDialogPresentation;
};

export interface ShyDrawerConfig<D = unknown> extends ShyDialogBaseConfig<D> {
  /** Lado de onde o painel entra. Padrão: `end`. */
  side?: ShyDrawerSide;
  /**
   * Arrastar o cabeçalho (ou o handle) na direção da borda fecha o painel, em toque e caneta. O botão de fechar, o `Esc` e o
   * clique fora continuam sendo a alternativa sem arrasto. Padrão: `false`.
   */
  dragToClose?: boolean;
  /** Mostra um handle (botão com o nome de `closeLabel`) na borda do painel `bottom`; ele também inicia o arrasto. Padrão: `false`. */
  showHandle?: boolean;
  /** Vibração curta (Vibration API) quando o arrasto fecha o painel. Sem efeito sem suporte (iOS) ou com reduced motion. Padrão: `false`. */
  haptics?: boolean;
}

export interface ShyAlertDialogOptions {
  title: string;
  message: string;
  /** Padrão: "OK". */
  okLabel?: string;
}

export interface ShyConfirmDialogOptions {
  title: string;
  message: string;
  /** Padrão: "Confirm". */
  confirmLabel?: string;
  /** Padrão: "Cancel". */
  cancelLabel?: string;
  /** Cor do botão de confirmar. `danger` para ações destrutivas. Padrão: `primary`. */
  intent?: ShyIntent;
}
