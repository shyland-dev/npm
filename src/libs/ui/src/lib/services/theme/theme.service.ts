import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, InjectionToken, PLATFORM_ID, Provider, signal } from '@angular/core';

export type ShyThemeMode = 'dark' | 'light' | 'system';
export type ShyResolvedTheme = 'dark' | 'light';

export interface ShyThemeConfig {
  /** Modo usado quando não há escolha salva. Padrão: `dark`. */
  defaultMode: ShyThemeMode;
  /** Chave do `localStorage`. */
  storageKey: string;
}

export const SHY_THEME_CONFIG = new InjectionToken<ShyThemeConfig>('SHY_THEME_CONFIG', {
  providedIn: 'root',
  factory: () => ({ defaultMode: 'dark', storageKey: 'shy-theme' }),
});

export const provideShyTheme = (config: Partial<ShyThemeConfig> = {}): Provider => ({
  provide: SHY_THEME_CONFIG,
  useValue: { defaultMode: 'dark', storageKey: 'shy-theme', ...config } satisfies ShyThemeConfig,
});

const isMode = (value: unknown): value is ShyThemeMode => value === 'dark' || value === 'light' || value === 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly config = inject(SHY_THEME_CONFIG);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly query = this.isBrowser ? (this.document.defaultView?.matchMedia?.('(prefers-color-scheme: light)') ?? null) : null;
  private readonly systemLight = signal(this.query?.matches ?? false);
  private readonly modeState = signal<ShyThemeMode>(this.readStoredMode());

  /** Modo escolhido pelo usuário (`system` continua `system`). */
  readonly mode = this.modeState.asReadonly();
  /** Tema efetivamente aplicado. */
  readonly resolved = computed<ShyResolvedTheme>(() => {
    const mode = this.modeState();
    return mode === 'system' ? (this.systemLight() ? 'light' : 'dark') : mode;
  });

  constructor() {
    this.query?.addEventListener('change', (event) => {
      this.systemLight.set(event.matches);
      this.apply();
    });
    this.apply();
  }

  setMode(mode: ShyThemeMode): void {
    this.modeState.set(mode);
    this.store(mode);
    this.apply();
  }

  /** Alterna entre claro e escuro a partir do tema resolvido. */
  toggle(): void {
    this.setMode(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  private apply(): void {
    if (!this.isBrowser) return;

    const root = this.document.documentElement;
    root.setAttribute('data-theme', this.resolved());
    root.setAttribute('data-theme-mode', this.modeState());
    this.updateThemeColor();
  }

  private updateThemeColor(): void {
    const view = this.document.defaultView;
    const color = view?.getComputedStyle(this.document.documentElement).getPropertyValue('--shy-color-bg').trim();
    if (!color) return;

    let meta = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = this.document.createElement('meta');
      meta.name = 'theme-color';
      this.document.head.appendChild(meta);
    }
    meta.content = color;
  }

  private readStoredMode(): ShyThemeMode {
    if (!this.isBrowser) return this.config.defaultMode;
    try {
      const stored = this.document.defaultView?.localStorage.getItem(this.config.storageKey);
      return isMode(stored) ? stored : this.config.defaultMode;
    } catch {
      return this.config.defaultMode;
    }
  }

  private store(mode: ShyThemeMode): void {
    if (!this.isBrowser) return;
    try {
      this.document.defaultView?.localStorage.setItem(this.config.storageKey, mode);
    } catch {
      // armazenamento indisponível (modo privado, cota): o tema vale só na sessão
    }
  }
}
