import { DOCUMENT } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SnackbarOutletComponent, SnackbarOutletData, SnackbarToast } from '../../components/snackbar/snackbar-outlet.component';
import { ShySnackbarOptions, ShySnackbarRef, SnackbarShowOptions } from '../../interfaces/snackbar/snackbar.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';
import { ShySnackbarCloseReason } from '../../types';
import { SHY_SNACKBAR_CONFIG } from './snackbar.config';

let nextId = 0;

/** Toast com timer pausável (hover, foco ou aba oculta) e uma `Promise` de fechamento. */
class Toast implements SnackbarToast {
  readonly id = nextId++;
  readonly closing = signal(false);
  readonly closed: Promise<ShySnackbarCloseReason>;
  resolve!: (reason: ShySnackbarCloseReason) => void;
  readonly holds = new Set<string>();
  timer: ReturnType<typeof setTimeout> | undefined;
  startedAt = 0;
  remaining: number;

  constructor(
    readonly message: string,
    readonly intent: SnackbarToast['intent'],
    readonly action: string | undefined,
    readonly position: SnackbarToast['position'],
    readonly align: SnackbarToast['align'],
    readonly duration: number,
  ) {
    this.remaining = duration;
    this.closed = new Promise((resolve) => (this.resolve = resolve));
  }
}

/**
 * Avisos rápidos (toasts). `show(message, options)` devolve um `ShySnackbarRef`; não precisa de elemento no template:
 * o contêiner nasce na primeira chamada, na camada `toast` do `OverlayService`.
 *
 * - Fila: até `maxVisible` (3) na tela; os demais esperam. Padrões em `provideShySnackbar()`.
 * - O tempo pausa com o ponteiro ou o foco no toast e com a aba oculta (WCAG 2.2.1); `duration: 0` não fecha sozinho.
 * - `role="status"` (educado) e `role="alert"` só em `intent: 'danger'`. Com um modal aberto o toast fica `inert` atrás dele:
 *   a ação some enquanto o modal durar (o texto continua anunciado).
 */
@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly overlay = inject(OverlayService);
  private readonly config = inject(SHY_SNACKBAR_CONFIG);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly visible = signal<readonly Toast[]>([]);
  private readonly queue: Toast[] = [];
  private readonly dismissLabel = signal(this.config.dismissLabel);
  private outlet: ShyOverlayRef | null = null;
  private listening = false;

  private readonly bridge: SnackbarOutletData = {
    toasts: this.visible,
    modalOpen: this.overlay.modalOpen,
    dismissLabel: this.dismissLabel,
    hold: (toast, reason, on) => this.hold(toast as Toast, reason, on),
    close: (toast, reason) => this.close(toast as Toast, reason),
  };

  /** Mostra um toast. */
  show(message: string, options?: ShySnackbarOptions): ShySnackbarRef;
  /** @deprecated Use `show(message, options)`; o `<shy-snackbar>` e o `element` saem na 1.0. */
  show(options: SnackbarShowOptions): void;
  show(arg: string | SnackbarShowOptions, options: ShySnackbarOptions = {}): ShySnackbarRef | void {
    if (typeof arg !== 'string') {
      const { element, position, delay, text } = arg;
      element.show({ position, delay, text });
      return;
    }
    // Sem DOM (SSR) não há toast: nenhum timer fica pendente no servidor.
    if (!this.isBrowser) return { dismiss: () => undefined, closed: Promise.resolve('dismiss') };
    const action = options.action?.label;
    const duration = options.duration ?? (action ? this.config.durationWithAction : this.config.duration);
    const toast = new Toast(arg, options.intent ?? 'neutral', action, options.position ?? 'bottom', options.align ?? 'center', duration);

    if (this.visible().length < this.config.maxVisible) this.reveal(toast);
    else this.queue.push(toast);
    return { dismiss: () => this.close(toast, 'dismiss'), closed: toast.closed };
  }

  /** Fecha todos os toasts, inclusive os da fila. */
  dismissAll(): void {
    for (const toast of [...this.queue, ...this.visible()]) this.close(toast, 'dismiss');
  }

  private reveal(toast: Toast): void {
    this.ensureOutlet();
    this.visible.update((list) => [...list, toast]);
    this.start(toast);
  }

  private ensureOutlet(): void {
    if (!this.listening) {
      this.listening = true;
      this.doc.addEventListener('visibilitychange', this.onVisibility);
    }
    if (this.outlet?.isOpen()) return;
    this.outlet = this.overlay.open(SnackbarOutletComponent, {
      layer: 'toast',
      modal: false,
      paneClass: 'shy-snackbar-pane',
      passive: true,
      closeOnEscape: false,
      closeOnOutsideClick: false,
      restoreFocus: false,
      initialFocus: 'none',
      data: this.bridge,
    });
  }

  private close(toast: Toast, reason: ShySnackbarCloseReason): void {
    if (toast.closing()) return;
    const queued = this.queue.indexOf(toast);
    if (queued >= 0) {
      this.queue.splice(queued, 1);
      toast.closing.set(true);
      toast.resolve(reason);
      return;
    }
    if (!this.visible().includes(toast)) return;
    clearTimeout(toast.timer);
    toast.closing.set(true);
    toast.resolve(reason);
    setTimeout(() => {
      this.visible.update((list) => list.filter((t) => t !== toast));
      const next = this.queue.shift();
      if (next) this.reveal(next);
    }, this.exitMs());
  }

  private hold(toast: Toast, reason: string, on: boolean): void {
    if (toast.closing()) return;
    if (on) {
      this.pause(toast);
      toast.holds.add(reason);
    } else {
      toast.holds.delete(reason);
      this.start(toast);
    }
  }

  private start(toast: Toast): void {
    if (toast.holds.size || toast.remaining <= 0 || toast.closing()) return;
    clearTimeout(toast.timer);
    toast.startedAt = Date.now();
    toast.timer = setTimeout(() => this.close(toast, 'timeout'), toast.remaining);
  }

  private pause(toast: Toast): void {
    if (toast.timer === undefined || toast.holds.size) return;
    clearTimeout(toast.timer);
    toast.timer = undefined;
    toast.remaining = Math.max(0, toast.remaining - (Date.now() - toast.startedAt));
  }

  private readonly onVisibility = (): void => {
    const hidden = this.doc.visibilityState === 'hidden';
    for (const toast of this.visible()) {
      if (hidden) {
        this.pause(toast);
        toast.holds.add('hidden');
      } else {
        toast.holds.delete('hidden');
        this.start(toast);
      }
    }
  };

  /** Duração da saída (token `--shy-duration-base`; 0 com reduced motion). */
  private exitMs(): number {
    const value = parseFloat(getComputedStyle(this.doc.documentElement).getPropertyValue('--shy-duration-base'));
    return Number.isFinite(value) && value >= 1 ? value : 0;
  }
}
