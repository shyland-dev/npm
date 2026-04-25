import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SnackbarPosition } from '../../types/snackbar/snackbar.type';

@Component({
  selector: 'shy-snackbar',
  imports: [IconComponent],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent implements OnDestroy {
  @Input() position: SnackbarPosition = 'bottom';
  @Input() dismissDelay = 3000;

  text?: string;
  visible = false;

  private timer?: ReturnType<typeof setTimeout>;

  constructor(private cdr: ChangeDetectorRef) {}

  show(opts?: { position?: SnackbarPosition; delay?: number; text?: string }): void {
    if (opts?.position !== undefined) this.position = opts.position;
    if (opts?.delay !== undefined) this.dismissDelay = opts.delay;
    if (opts?.text !== undefined) this.text = opts.text;

    clearTimeout(this.timer);
    this.visible = true;
    this.cdr.markForCheck();

    if (this.dismissDelay > 0) {
      this.timer = setTimeout(() => this.dismiss(), this.dismissDelay);
    }
  }

  dismiss(): void {
    this.visible = false;
    this.cdr.markForCheck();
    clearTimeout(this.timer);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
