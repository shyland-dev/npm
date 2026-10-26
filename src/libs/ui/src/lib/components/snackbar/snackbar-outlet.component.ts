import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ShySnackbarAlign, ShySnackbarIntent, SnackbarPosition } from '../../types';
import { SHY_OVERLAY_DATA } from '../../overlay/overlay-ref';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SwipeDismissDirective } from './swipe-dismiss.directive';

/** Estado de um toast, lido pelo outlet. Criado e atualizado pelo `SnackbarService`. */
export interface SnackbarToast {
  readonly id: number;
  readonly message: Signal<string>;
  readonly intent: Signal<ShySnackbarIntent>;
  readonly action: Signal<string | undefined>;
  readonly loading: Signal<boolean>;
  readonly swipe: boolean;
  readonly position: SnackbarPosition;
  readonly align: ShySnackbarAlign;
  readonly closing: Signal<boolean>;
}

/** Ponte entre o serviço e o outlet (passada em `data` ao abrir o overlay). */
export interface SnackbarOutletData {
  readonly toasts: Signal<readonly SnackbarToast[]>;
  readonly modalOpen: Signal<boolean>;
  readonly dismissLabel: Signal<string>;
  hold(toast: SnackbarToast, reason: 'pointer' | 'focus' | 'drag', on: boolean): void;
  /** `Esc` com o foco no toast: fecha e devolve o foco a quem o tinha antes do atalho. */
  escape(toast: SnackbarToast): void;
  close(toast: SnackbarToast, reason: 'dismiss' | 'action'): void;
}

const ICONS: Record<ShySnackbarIntent, string | null> = {
  neutral: null,
  info: 'info-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  danger: 'exclamation-circle',
};

/**
 * Contêiner dos toasts (interno; aberto pelo `SnackbarService` na camada `toast` e mantido): duas regiões (topo e base), cada uma
 * com uma lista educada (`role="status"`) e uma urgente (`role="alert"`, só `danger`). As regiões existem antes do primeiro
 * toast, porque leitor de tela só anuncia o que entra numa região viva já presente.
 */
@Component({
  selector: 'shy-snackbar-outlet',
  imports: [IconComponent, NgTemplateOutlet, SpinnerComponent, SwipeDismissDirective],
  templateUrl: './snackbar-outlet.component.html',
  styleUrl: './snackbar-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarOutletComponent {
  protected readonly data = inject<SnackbarOutletData>(SHY_OVERLAY_DATA);
  protected readonly positions: readonly SnackbarPosition[] = ['top', 'bottom'];
  protected readonly dismissLabel = this.data.dismissLabel;
  protected readonly actionAllowed = computed(() => !this.data.modalOpen());

  protected list(position: SnackbarPosition, urgent: boolean): SnackbarToast[] {
    return this.data.toasts().filter((t) => t.position === position && (t.intent() === 'danger') === urgent);
  }

  protected icon(toast: SnackbarToast): string | null {
    return ICONS[toast.intent()];
  }
}
