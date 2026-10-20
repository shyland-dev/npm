import { Component } from '@angular/core';

@Component({
  selector: 'app-spacing',
  templateUrl: './spacing.html',
})
export class Spacing {
  readonly spaces = ['0-5', '1', '2', '3', '4', '5', '6', '7', '8', '10', '12', '14', '16', '20', '24', '32'];
  readonly radii = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];
  readonly controls = ['sm', 'md', 'lg'];
  readonly shadows = [1, 2, 3, 4, 5];
}
