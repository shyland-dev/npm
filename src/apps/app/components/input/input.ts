import { Component } from '@angular/core';
import { FormFieldComponent, IconButtonComponent, IconComponent, InputComponent, ShyInputSize } from '@shyland-dev/ui';

@Component({
  selector: 'app-input-page',
  imports: [InputComponent, FormFieldComponent, IconComponent, IconButtonComponent],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputPage {
  protected readonly sizes: ShyInputSize[] = ['sm', 'md', 'lg'];
  protected readonly states = ['rest', 'hover', 'focus', 'invalid', 'disabled', 'readonly'] as const;
}
