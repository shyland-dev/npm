/** Opção do `shy-select`. `value` pode ser de qualquer tipo (compare por objeto com `compareWith`). */
export interface ShySelectOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
  /** Imagem pequena antes do rótulo (decorativa, `alt=""`). */
  img?: string;
}

/** @deprecated Use `ShySelectOption` (sem `id`; `value` de qualquer tipo). Removido na 1.0. */
export interface SelectOption {
  id: number;
  value: string;
  label: string;
  img?: string;
}

/** @deprecated Use `(valueChange)` ou `ngModel`/`formControl`. Removido na 1.0. */
export interface SelectionChangeEvent {
  selectedOption: SelectOption;
}
