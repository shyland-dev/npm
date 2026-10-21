/** Direção de ordenação de uma coluna; `null` = sem ordenação. */
export type ShySortDirection = 'asc' | 'desc' | null;

/** Ordenação atual do `shy-table`: coluna (`key`) e direção. */
export interface ShyTableSort {
  key: string;
  direction: 'asc' | 'desc';
}

/** Contexto do `<ng-template shyCell let-row let-value="value">`. */
export interface ShyTableCellContext<T = unknown> {
  $implicit: T;
  value: unknown;
  index: number;
}
