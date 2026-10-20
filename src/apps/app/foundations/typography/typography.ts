import { Component } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.html',
})
export class Typography {
  readonly sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  readonly weights = ['regular', 'medium', 'semibold', 'bold'];
  readonly leadings = ['tight', 'snug', 'normal', 'relaxed'];
}
