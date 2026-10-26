export function shyIsDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function shyIsString(value: unknown): value is string {
  return typeof value === 'string';
}

export function shyIsRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Checagem de exaustividade em `switch`/`if`: não compila se sobrar um caso. */
export function shyAssertNever(value: never): never {
  throw new Error(`[shy] valor inesperado: ${String(value)}`);
}
