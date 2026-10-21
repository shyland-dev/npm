import { ShyOverlayConfig } from '../overlay/overlay.interface';
import { ShyDrawerSide } from '../../types/dialog/dialog.type';
import { ShyIntent } from '../../types/intent/intent.type';

/** Config do `DialogService.open`: a do overlay, sem o que o Dialog já decide (camada modal, sem âncora). */
export type ShyDialogConfig<D = unknown> = Omit<ShyOverlayConfig<D>, 'layer' | 'modal' | 'anchor' | 'position'>;

export interface ShyDrawerConfig<D = unknown> extends ShyDialogConfig<D> {
  /** Lado de onde o painel entra. Padrão: `end`. */
  side?: ShyDrawerSide;
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
