import { Component } from '@angular/core';
import { AvatarComponent, ShyAvatarSize } from '@shyland-dev/ui';

@Component({
  selector: 'app-avatar-page',
  imports: [AvatarComponent],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class AvatarPage {
  protected readonly sizes: ShyAvatarSize[] = ['sm', 'md', 'lg', 'xl'];
}
