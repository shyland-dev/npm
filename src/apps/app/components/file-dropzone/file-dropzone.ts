import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FileDropzoneComponent, FormFieldComponent, ShyFileRejection } from '@shyland-dev/ui';

@Component({
  selector: 'app-file-dropzone-page',
  imports: [FileDropzoneComponent, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './file-dropzone.html',
})
export class FileDropzonePage {
  protected readonly docs = new FormControl<File[]>([], { nonNullable: true });
  protected readonly single = signal<File[]>([]);
  protected readonly rejections = signal<ShyFileRejection[]>([]);
}
