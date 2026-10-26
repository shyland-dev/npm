import { ShySnackbarAlign, ShySnackbarCloseReason, ShySnackbarIntent, ShySnackbarUndoResult, SnackbarPosition } from '../../types';

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
  /** Identifica o toast: um `show()` com o mesmo `id` de um toast ainda aberto (ou na fila) o atualiza em vez de empilhar outro. */
  id?: string;
  /** Mostra um indicador de atividade no lugar do ícone da intenção (ver `SnackbarService.promise`). Padrão: `false`. */
  loading?: boolean;
  /** Arrastar o toast para o lado o fecha (toque e caneta; o botão de fechar continua). Padrão: da configuração (`true`). */
  swipeToDismiss?: boolean;
}

/** Campos de um toast aberto que `ShySnackbarRef.update()` pode trocar. O tempo reinicia com `duration` ou o padrão da nova versão. */
export interface ShySnackbarUpdate {
  message?: string;
  intent?: ShySnackbarIntent;
  /** `null` remove a ação. */
  action?: { label: string } | null;
  loading?: boolean;
  duration?: number;
}

export interface ShySnackbarUndoOptions {
  /** Padrão: da configuração (`undoLabel`, "Undo"). */
  label?: string;
  /** Em ms; `0` espera sem fechar. Padrão: `durationWithAction`. */
  duration?: number;
  intent?: ShySnackbarIntent;
  position?: SnackbarPosition;
  align?: ShySnackbarAlign;
}

/** Textos de `SnackbarService.promise()`. As funções recebem o valor resolvido ou o erro. */
export interface ShySnackbarPromiseMessages<T> {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((error: unknown) => string);
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
  /** Arrastar o toast para o lado o fecha, em toque e caneta. Padrão: `true`. */
  swipeToDismiss?: boolean;
  /** Rótulo da ação de `undo()`. Padrão: "Undo". */
  undoLabel?: string;
  /**
   * Atalho global (ex.: `'Alt+T'`) que leva o foco ao toast mais recente, para quem usa teclado alcançar a ação antes de ele
   * fechar (o tempo pausa com o foco; `Esc` fecha o toast e devolve o foco). Padrão: sem atalho.
   */
  focusHotkey?: string;
}

/** Referência a um toast (aberto ou na fila). */
export interface ShySnackbarRef {
  /** Fecha o toast (ou o tira da fila). */
  dismiss(): void;
  /** Troca mensagem, intenção, ação ou estado de carregamento de um toast aberto ou na fila. Sem efeito depois de fechado. */
  update(patch: ShySnackbarUpdate): void;
  /** Resolve quando fecha, com o motivo. */
  readonly closed: Promise<ShySnackbarCloseReason>;
}
