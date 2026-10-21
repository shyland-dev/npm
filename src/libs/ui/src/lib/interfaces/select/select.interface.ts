/** Opção do `shy-select`. `value` pode ser de qualquer tipo (compare por objeto com `compareWith`). */
export interface ShySelectOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
  /** Imagem pequena antes do rótulo (decorativa, `alt=""`). */
  img?: string;
}
