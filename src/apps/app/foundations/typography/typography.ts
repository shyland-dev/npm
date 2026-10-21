import { Component } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.html',
})
export class Typography {
  readonly sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  readonly weights = ['regular', 'medium', 'semibold', 'bold'];
  readonly textStyles = ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body-lg', 'body', 'small', 'caption', 'overline'];
  readonly leadings = ['tight', 'snug', 'normal', 'relaxed'];
}
