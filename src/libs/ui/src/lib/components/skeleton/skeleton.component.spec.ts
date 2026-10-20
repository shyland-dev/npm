import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShySkeletonShape } from '../../types/skeleton/skeleton.type';
import { SkeletonComponent } from './skeleton.component';

@Component({
  imports: [SkeletonComponent],
  template: `<shy-skeleton [shape]="shape()" [lines]="lines()" animation="still" />`,
})
class Host {
  readonly shape = signal<ShySkeletonShape>('text');
  readonly lines = signal<unknown>(3);
}

describe('SkeletonComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const skeleton = (fixture.nativeElement as HTMLElement).querySelector('shy-skeleton') as HTMLElement;
    return {
      host: fixture.componentInstance,
      skeleton,
      set(change: () => void) {
        change();
        fixture.detectChanges();
      },
    };
  }

  it('é decorativo e reflete shape e animation', () => {
    const { skeleton } = render();

    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.dataset['shape']).toBe('text');
    expect(skeleton.dataset['animation']).toBe('still');
  });

  it('text desenha uma linha por "lines"; valor inválido vira 1', () => {
    const { host, skeleton, set } = render();
    expect(skeleton.querySelectorAll('.line').length).toBe(3);

    set(() => host.lines.set('abc'));
    expect(skeleton.querySelectorAll('.line').length).toBe(1);

    set(() => host.lines.set(0));
    expect(skeleton.querySelectorAll('.line').length).toBe(1);
  });

  it('circle e rect desenham um bloco só', () => {
    const { host, skeleton, set } = render();
    set(() => host.shape.set('circle'));

    expect(skeleton.querySelectorAll('.bone').length).toBe(1);
    expect(skeleton.querySelector('.line')).toBeNull();
  });
});
