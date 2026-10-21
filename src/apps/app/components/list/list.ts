import { Component, signal } from '@angular/core';
import { AvatarComponent, BadgeComponent, ListComponent, ListItemComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-list-page',
  imports: [ListComponent, ListItemComponent, AvatarComponent, BadgeComponent],
  templateUrl: './list.html',
})
export class ListPage {
  protected readonly selected = signal('ana');
  protected readonly people = [
    { id: 'ana', name: 'Ana Souza', mail: 'ana@example.dev' },
    { id: 'bruno', name: 'Bruno Lima', mail: 'bruno@example.dev' },
    { id: 'carla', name: 'Carla Dias', mail: 'carla@example.dev' },
  ];
}
