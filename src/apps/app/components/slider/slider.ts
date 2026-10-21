import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent, SliderComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-slider-page',
  imports: [SliderComponent, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './slider.html',
})
export class SliderPage {
  protected readonly volume = signal(40);
  protected readonly price = new FormControl(250, { nonNullable: true });
  protected readonly money = (value: number) => `$${value}`;
}
