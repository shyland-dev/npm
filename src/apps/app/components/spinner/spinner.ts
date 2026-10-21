import { Component } from '@angular/core';
import { ButtonComponent, ShySpinnerSize, ShySpinnerVariant, SpinnerComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-spinner-page',
  imports: [SpinnerComponent, ButtonComponent],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class SpinnerPage {
  protected readonly variants: ShySpinnerVariant[] = ['ring', 'ring-track', 'dash', 'dots', 'bars', 'pulse', 'orbit', 'breathe'];
  protected readonly sizes: ShySpinnerSize[] = ['xs', 'sm', 'md', 'lg'];
}
