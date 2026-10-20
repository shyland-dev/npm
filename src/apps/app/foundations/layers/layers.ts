import { Component } from '@angular/core';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.html',
  styleUrl: './layers.scss',
})
export class Layers {
  readonly layers = ['base', 'raised', 'dropdown', 'sticky', 'fixed', 'drawer', 'modal', 'popover', 'tooltip', 'toast'];
  readonly stack = this.layers.map((name, index) => ({ name, value: index * 100, order: index }));
}
