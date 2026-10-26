import { DOCUMENT } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SnackbarOutletComponent, SnackbarOutletData, SnackbarToast } from '../../components/snackbar/snackbar-outlet.component';
import { ShySnackbarOptions, ShySnackbarPromiseMessages, ShySnackbarRef, ShySnackbarUndoOptions, ShySnackbarUpdate } from '../../interfaces/snackbar/snackbar.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';
import { ShySnackbarCloseReason, ShySnackbarIntent, ShySnackbarUndoResult } from '../../types';
import { SHY_SNACKBAR_CONFIG } from './snackbar.config';

let nextId = 0;

/** Toast com timer pausável (hover, foco, arrasto ou aba oculta) e uma `Promise` de fechamento. */
class Toast implements SnackbarToast {
  readonly id = nextId++;
  readonly closing = signal(false);
  readonly closed: Promise<ShySnackbarCloseReason>;
  resolve!: (reason: ShySnackbarCloseReason) => void;
  readonly holds = new Set<string>();
  timer: ReturnType<typeof setTimeout> | undefined;
  startedAt = 0;
  remaining: number;
  readonly message: WritableSignal<string>;
  readonly intent: WritableSignal<ShySnackbarIntent>;
  readonly action: WritableSignal<string | undefined>;
  readonly loading: WritableSignal<boolean>;

  constructor(
    message: string,
    intent: ShySnackbarIntent,
    action: string | undefined,
    loading: boolean,
    readonly position: SnackbarToast['position'],
    readonly align: SnackbarToast['align'],
    duration: number,
    readonly swipe: boolean,
    readonly key: string | undefined,
  ) {
    this.message = signal(message);
    this.intent = signal(intent);
    this.action = signal(action);
    this.loading = signal(loading);
    this.remaining = duration;
    this.closed = new Promise((resolve) => (this.resolve = resolve));
  }
}

/**
 * Avisos rápidos (toasts). `show(message, options)` devolve um `ShySnackbarRef`; não precisa de elemento no template:
 * o contêiner nasce na primeira chamada, na camada `toast` do `OverlayService`.
 *
 * - Fila: até `maxVisible` (3) na tela; os demais esperam. Padrões em `provideShySnackbar()`.
 * - O tempo pausa com o ponteiro ou o foco no toast, durante o arrasto e com a aba oculta (WCAG 2.2.1); `duration: 0` não fecha sozinho.
 * - Em toque e caneta, arrastar o toast para o lado o fecha (`swipeToDismiss`); o botão X é a alternativa sem gesto.
 * - `update()` troca o conteúdo de um toast aberto, `promise()` acompanha uma operação assíncrona e `undo()` oferece desfazer.
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
  private readonly keyed = new Map<string, Toast>();
  private outlet: ShyOverlayRef | null = null;
  private listening = false;
  private returnFocus: HTMLElement | null = null;

  private readonly bridge: SnackbarOutletData = {
    toasts: this.visible,
    modalOpen: this.overlay.modalOpen,
    dismissLabel: this.dismissLabel,
    hold: (toast, reason, on) => this.hold(toast as Toast, reason, on),
    close: (toast, reason) => this.close(toast as Toast, reason),
    escape: (toast) => this.escape(toast as Toast),
  };

  /** Mostra um toast. Com `options.id` de um toast ainda aberto (ou na fila), atualiza esse em vez de criar outro. */
  show(message: string, options: ShySnackbarOptions = {}): ShySnackbarRef {
    // Sem DOM (SSR) não há toast: nenhum timer fica pendente no servidor.
    if (!this.isBrowser) return { dismiss: () => undefined, update: () => undefined, closed: Promise.resolve('dismiss') };

    const existing = options.id === undefined ? undefined : this.keyed.get(options.id);
    if (existing) {
      this.update(existing, { message, intent: options.intent ?? 'neutral', action: options.action ?? null, loading: options.loading ?? false, duration: options.duration });
      return this.refOf(existing);
    }

    const action = options.action?.label;
    const duration = options.duration ?? this.defaultDuration(action !== undefined);
    const toast = new Toast(message, options.intent ?? 'neutral', action, options.loading ?? false, options.position ?? 'bottom', options.align ?? 'center', duration, options.swipeToDismiss ?? this.config.swipeToDismiss ?? true, options.id);
    if (options.id !== undefined) this.keyed.set(options.id, toast);

    if (this.visible().length < this.config.maxVisible) this.reveal(toast);
    else this.queue.push(toast);
    return this.refOf(toast);
  }

  /**
   * Oferece desfazer uma ação já feita. Resolve `'undo'` se a pessoa tocou na ação; `'commit'` se o toast fechou por tempo,
   * pelo X ou por `dismissAll()`. Para ação reversível, prefira isto a um `confirm()`: a ação acontece na hora e o toast só
   * dá a chance de reverter. A ação some enquanto há um modal aberto (o toast fica `inert`), então só use em ações seguras de reverter.
   */
  async undo(message: string, options: ShySnackbarUndoOptions = {}): Promise<ShySnackbarUndoResult> {
    const ref = this.show(message, {
      intent: options.intent,
      position: options.position,
      align: options.align,
      duration: options.duration,
      action: { label: options.label ?? this.config.undoLabel ?? 'Undo' },
    });
    return (await ref.closed) === 'action' ? 'undo' : 'commit';
  }

  /**
   * Acompanha uma operação assíncrona num único toast: `loading` (sem fechar sozinho) vira `success` ou `error` quando a
   * `Promise` termina. Devolve a própria `Promise` (o erro continua sendo lançado para quem chamou).
   */
  async promise<T>(promise: Promise<T>, messages: ShySnackbarPromiseMessages<T>, options: Omit<ShySnackbarOptions, 'loading' | 'duration' | 'intent' | 'action'> = {}): Promise<T> {
    const ref = this.show(messages.loading, { ...options, intent: 'info', loading: true, duration: 0 });
    try {
      const value = await promise;
      const text = typeof messages.success === 'function' ? messages.success(value) : messages.success;
      ref.update({ message: text, intent: 'success', loading: false, action: null, duration: this.config.duration });
      return value;
    } catch (error) {
      const text = typeof messages.error === 'function' ? messages.error(error) : messages.error;
      ref.update({ message: text, intent: 'danger', loading: false, action: null, duration: this.config.duration });
      throw error;
    }
  }

  /** Fecha todos os toasts, inclusive os da fila. */
  dismissAll(): void {
    for (const toast of [...this.queue, ...this.visible()]) this.close(toast, 'dismiss');
  }

  private refOf(toast: Toast): ShySnackbarRef {
    return { dismiss: () => this.close(toast, 'dismiss'), update: (patch) => this.update(toast, patch), closed: toast.closed };
  }

  private defaultDuration(withAction: boolean): number {
    return withAction ? this.config.durationWithAction : this.config.duration;
  }

  private update(toast: Toast, patch: ShySnackbarUpdate): void {
    if (toast.closing()) return;
    if (patch.message !== undefined) toast.message.set(patch.message);
    if (patch.intent !== undefined) toast.intent.set(patch.intent);
    if (patch.action !== undefined) toast.action.set(patch.action?.label);
    if (patch.loading !== undefined) toast.loading.set(patch.loading);
    // O tempo recomeça: a nova versão do toast ganha a duração inteira.
    toast.remaining = patch.duration ?? this.defaultDuration(toast.action() !== undefined);
    if (toast.timer !== undefined) {
      clearTimeout(toast.timer);
      toast.timer = undefined;
    }
    // Na fila o tempo só começa quando o toast aparecer (`reveal`).
    if (this.visible().includes(toast)) this.start(toast);
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
      if (this.config.focusHotkey) this.doc.addEventListener('keydown', this.onKeydown);
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
    if (toast.key !== undefined && this.keyed.get(toast.key) === toast) this.keyed.delete(toast.key);
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

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (!matchesHotkey(event, this.config.focusHotkey)) return;
    const toast = [...this.visible()].reverse().find((t) => !t.closing());
    const target = toast && this.doc.querySelector(`.shy-snackbar-pane [data-toast-id="${toast.id}"]`)?.querySelector<HTMLElement>('.toast__action, .toast__dismiss');
    if (!target) return;
    event.preventDefault();
    this.returnFocus = this.doc.activeElement instanceof HTMLElement ? this.doc.activeElement : null;
    target.focus();
  };

  private escape(toast: Toast): void {
    const back = this.returnFocus;
    this.returnFocus = null;
    this.close(toast, 'dismiss');
    if (back?.isConnected) back.focus();
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

/** `'Alt+T'`, `'Ctrl+Shift+K'`... Letras e dígitos comparam por `code` (o `key` muda com Alt no macOS). */
function matchesHotkey(event: KeyboardEvent, hotkey: string | undefined): boolean {
  if (!hotkey) return false;
  const parts = hotkey
    .toLowerCase()
    .split('+')
    .map((p) => p.trim());
  const key = parts.pop() ?? '';
  const mods = new Set(parts);
  if (event.altKey !== mods.has('alt') || event.ctrlKey !== mods.has('ctrl') || event.shiftKey !== mods.has('shift') || event.metaKey !== mods.has('meta')) return false;
  if (/^[a-z]$/.test(key)) return event.code === `Key${key.toUpperCase()}`;
  if (/^\d$/.test(key)) return event.code === `Digit${key}`;
  return event.key.toLowerCase() === key;
}
