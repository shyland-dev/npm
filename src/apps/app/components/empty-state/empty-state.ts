import { Component } from '@angular/core';
import { ButtonComponent, EmptyStateComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-empty-state-page',
  imports: [EmptyStateComponent, ButtonComponent],
  templateUrl: './empty-state.html',
})
export class EmptyStatePage {}
