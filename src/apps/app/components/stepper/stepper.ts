import { Component, signal } from '@angular/core';
import { ButtonComponent, StepComponent, StepperComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-stepper-page',
  imports: [StepperComponent, StepComponent, ButtonComponent],
  templateUrl: './stepper.html',
})
export class StepperPage {
  protected readonly step = signal(1);
  protected readonly linearStep = signal(0);
}
