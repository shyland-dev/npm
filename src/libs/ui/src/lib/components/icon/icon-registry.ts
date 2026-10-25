import { Injectable, InjectionToken, PendingTasks, Provider, inject, isDevMode, signal } from '@angular/core';
import type { ShyIcon } from '@shyland-dev/ui/icons';
import { INTERNAL_ICONS } from './internal-icons';

/** Ícones registrados com `provideShyIcons` (multi: cada chamada acrescenta). */
const SHY_ICONS = new InjectionToken<readonly (readonly ShyIcon[])[]>('SHY_ICONS');

/**
 * Registra ícones do subpath `@shyland-dev/ui/icons` para uso em `<shy-icon>`. Só o que for registrado (mais os ícones
 * internos da lib) entra no bundle: `provideShyIcons(iconHouse, iconHouseFill)`. Vale no injetor raiz (`providers` do app).
 * Para `hoverFill` registre também a variante `-fill`.
 */
export function provideShyIcons(...icons: ShyIcon[]): Provider[] {
  return [{ provide: SHY_ICONS, multi: true, useValue: icons }];
}

/**
 * Consulta de ícones por nome. Os registrados respondem na hora; um nome desconhecido carrega o catálogo completo uma
 * única vez, num chunk à parte (`import()`), e o `<shy-icon>` se atualiza quando ele chega.
 */
@Injectable({ providedIn: 'root' })
export class IconRegistry {
  private readonly pending = inject(PendingTasks);
  private readonly registered = new Map<string, string>();
  private readonly catalog = signal<Record<string, string> | null>(null);
  private loading = false;
  private readonly warned = new Set<string>();

  constructor() {
    for (const icon of INTERNAL_ICONS) this.registered.set(icon.name, icon.svg);
    for (const icon of (inject(SHY_ICONS, { optional: true }) ?? []).flat()) this.registered.set(icon.name, icon.svg);
  }

  /** SVG do ícone, ou `undefined` se ainda não está disponível (registre-o ou aguarde o catálogo). */
  get(name: string): string | undefined {
    return this.registered.get(name) ?? this.catalog()?.[name];
  }

  /** O catálogo já chegou e o nome continua desconhecido: vale o fallback. */
  missing(name: string): boolean {
    return !!name && this.catalog() !== null && this.get(name) === undefined;
  }

  /** Pede o catálogo se `name` não estiver registrado. */
  ensure(name: string): void {
    if (!name || this.registered.has(name) || this.loading || this.catalog()) return;
    this.loading = true;
    if (isDevMode() && !this.warned.has(name)) {
      this.warned.add(name);
      console.warn(`[shy-icon] "${name}" não está registrado: o catálogo completo será baixado sob demanda. Use provideShyIcons(...) para evitar o download.`);
    }
    void this.pending.run(async () => {
      const { ICONS } = await import('@shyland-dev/ui/icons');
      this.catalog.set(ICONS);
    });
  }
}
