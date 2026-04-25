import { Injectable } from '@angular/core';
import { SnackbarShowOptions } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  show(opts: SnackbarShowOptions): void {
    const { element, position, delay, text } = opts;
    element.show({ position, delay, text });
  }
}
