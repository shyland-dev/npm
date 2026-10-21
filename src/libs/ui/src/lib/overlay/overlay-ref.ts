import { InjectionToken, Signal, signal } from '@angular/core';

/** Dados passados em `OverlayService.open(..., { data })`. */
export const SHY_OVERLAY_DATA = new InjectionToken<unknown>('SHY_OVERLAY_DATA');

/**
 * Referência a um overlay aberto. Dentro do conteúdo: `inject(ShyOverlayRef)`.
 * Criada só pelo `OverlayService`.
 */
export class ShyOverlayRef<R = unknown, C = unknown> {
  private readonly openState = signal(true);
  private resolveClosed!: (result: R | undefined) => void;
  private started = false;
  private readonly done: Promise<void>;
  private resolveDone!: () => void;

  /** `false` a partir do fim da saída. */
  readonly isOpen: Signal<boolean> = this.openState.asReadonly();
  /** Resolve com o resultado de `close(result)` (ou `undefined` se fechou por Esc, clique fora ou `closeAll`). */
  readonly closed: Promise<R | undefined> = new Promise((resolve) => (this.resolveClosed = resolve));
  /** Instância do componente aberto (`null` para `TemplateRef`). */
  componentInstance: C | null = null;

  /** @internal */
  constructor(
    /** Elemento do painel (`<dialog>` ou `[popover]`) que hospeda o conteúdo. */
    readonly pane: HTMLElement,
    private readonly hooks: { close: (animate: boolean) => Promise<void>; position: () => void },
  ) {
    this.done = new Promise((resolve) => (this.resolveDone = resolve));
  }

  /** Anima a saída, remove o painel e resolve `closed` com `result`. Chamadas repetidas reaproveitam a mesma saída (vale o primeiro `result`). */
  close(result?: R): Promise<void> {
    return this.finish(result, true);
  }

  /** Recalcula a posição junto à âncora (ex.: depois de o conteúdo mudar de tamanho). */
  updatePosition(): void {
    if (this.openState()) this.hooks.position();
  }

  /** @internal */
  finish(result: R | undefined, animate: boolean): Promise<void> {
    // A marca vem antes do hook: ele pode disparar eventos (ex.: `close` do <dialog>) que chamam `finish` de novo, de forma síncrona.
    if (this.started) return this.done;
    this.started = true;
    void this.hooks.close(animate).then(() => {
      this.openState.set(false);
      this.resolveClosed(result);
      this.resolveDone();
    });
    return this.done;
  }
}
