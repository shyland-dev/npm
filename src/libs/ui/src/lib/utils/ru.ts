/** Converte um multiplicador na unidade responsiva da lib: `ru(4)` → `calc(var(--shy-responsive-unit) * 4)`. */
export const ru = (n: number): string => `calc(var(--shy-responsive-unit) * ${n})`;
