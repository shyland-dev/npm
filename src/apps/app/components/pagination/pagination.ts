import { Component, signal } from '@angular/core';
import { PaginationComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-pagination-page',
  imports: [PaginationComponent],
  templateUrl: './pagination.html',
})
export class PaginationPage {
  protected readonly page = signal(5);
}
