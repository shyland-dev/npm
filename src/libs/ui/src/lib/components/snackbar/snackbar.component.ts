import { ChangeDetectionStrategy, Component, OnDestroy, model, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SnackbarPosition } from '../../types/snackbar/snackbar.type';

@Component({
  selector: 'shy-snackbar',
  imports: [IconComponent],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent implements OnDestroy {
  /** `show()` sobrescreve estes valores até a próxima chamada que os informe (igual à API anterior). */
  readonly position = model<SnackbarPosition>('bottom');
  readonly dismissDelay = model(3000);

  protected readonly text = signal<string | undefined>(undefined);
  protected readonly visible = signal(false);

  private timer?: ReturnType<typeof setTimeout>;

  show(opts?: { position?: SnackbarPosition; delay?: number; text?: string }): void {
    if (opts?.position !== undefined) this.position.set(opts.position);
    if (opts?.delay !== undefined) this.dismissDelay.set(opts.delay);
    if (opts?.text !== undefined) this.text.set(opts.text);

    clearTimeout(this.timer);
    this.visible.set(true);

    if (this.dismissDelay() > 0) {
      this.timer = setTimeout(() => this.dismiss(), this.dismissDelay());
    }
  }

  dismiss(): void {
    this.visible.set(false);
    clearTimeout(this.timer);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
