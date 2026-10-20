import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.html',
  styleUrl: './motion.scss',
})
export class Motion {
  readonly durations = ['instant', 'fast', 'base', 'slow', 'slower'];
  readonly eases = ['standard', 'enter', 'exit', 'linear'];
  readonly animations = ['fade-in', 'scale-in', 'slide-up', 'slide-down', 'slide-inline-start', 'slide-inline-end', 'pulse', 'shake'];

  readonly moved = signal(false);
  readonly replay = signal(0);

  play(): void {
    this.moved.update((v) => !v);
    this.replay.update((v) => v + 1);
  }
}
