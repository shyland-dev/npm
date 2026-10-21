import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { ShySnackbarAlign, ShySnackbarCloseReason, ShySnackbarIntent, SnackbarPosition } from '../../types';

/**
 * @deprecated Use `SnackbarService.show(message, options)` (sem `element`). Removido na 1.0.
 */
export interface SnackbarShowOptions {
  element: SnackbarComponent;
  position?: SnackbarPosition;
  delay?: number;
  text?: string;
}

export interface ShySnackbarOptions {
  /** Padrão: `neutral`. `danger` usa `role="alert"` (interrompe o leitor de tela); os demais, `role="status"`. */
  intent?: ShySnackbarIntent;
  /** Botão de ação (`closed` resolve com `action`). Some enquanto há um modal aberto (o toast fica `inert` atrás dele). */
  action?: { label: string };
  /** Em ms; `0` não fecha sozinho (só pelo X ou `dismiss()`). Padrão: da configuração (mais longo com `action`). */
  duration?: number;
  /** Padrão: `bottom`. */
  position?: SnackbarPosition;
  /** Padrão: `center`. */
  align?: ShySnackbarAlign;
}

export interface ShySnackbarConfig {
  /** Toasts na tela ao mesmo tempo; os demais esperam na fila. Padrão: 3. */
  maxVisible: number;
  /** Duração padrão em ms. Padrão: 5000. */
  duration: number;
  /** Duração padrão com ação, em ms. Padrão: 8000. */
  durationWithAction: number;
  /** Nome acessível do botão de fechar. Padrão: "Dismiss". */
  dismissLabel: string;
}

/** Referência a um toast (aberto ou na fila). */
export interface ShySnackbarRef {
  /** Fecha o toast (ou o tira da fila). */
  dismiss(): void;
  /** Resolve quando fecha, com o motivo. */
  readonly closed: Promise<ShySnackbarCloseReason>;
}
