import { Component } from '@angular/core';
import { FormFieldComponent, InputComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-textarea-page',
  imports: [InputComponent, FormFieldComponent],
  templateUrl: './textarea.html',
})
export class TextareaPage {}
