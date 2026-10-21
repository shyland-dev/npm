export type SnackbarPosition = 'top' | 'bottom';

/** `neutral` não tem cor de intenção; os demais seguem o Alert (ícone + cor, nunca só cor). */
export type ShySnackbarIntent = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Alinhamento na linha: `start`/`end` seguem a direção do texto (RTL). */
export type ShySnackbarAlign = 'start' | 'center' | 'end';

/** Por que o toast fechou: `timeout`, `dismiss` (botão X ou `ref.dismiss()`) ou `action`. */
export type ShySnackbarCloseReason = 'timeout' | 'dismiss' | 'action';
