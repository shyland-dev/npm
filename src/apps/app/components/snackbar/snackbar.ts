import { Component, viewChild } from '@angular/core';
import { SnackbarComponent, SnackbarPosition, SnackbarService } from '@shyland-dev/ui';

@Component({
  selector: 'app-snackbar-page',
  imports: [SnackbarComponent],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.scss',
})
export class SnackbarPage {
  private readonly snackbar = viewChild.required(SnackbarComponent);

  constructor(private snackbarService: SnackbarService) {}

  show(position: SnackbarPosition, delay = 3000): void {
    this.snackbarService.show({ element: this.snackbar(), position, delay, text: `Hello, I am a snackbar (${position})` });
  }
}
