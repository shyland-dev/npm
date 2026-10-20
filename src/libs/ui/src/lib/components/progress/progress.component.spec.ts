import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProgressCircularComponent } from '../progress-circular/progress-circular.component';
import { ProgressComponent } from './progress.component';

@Component({
  imports: [ProgressComponent, ProgressCircularComponent],
  template: `
    <shy-progress [value]="value()" [max]="max()" label="Upload" />
    <shy-progress-circular [value]="value()" [max]="max()" label="Upload" size="sm" />
  `,
})
class Host {
  readonly value = signal<unknown>(40);
  readonly max = signal<unknown>(100);
}

describe('ProgressComponent e ProgressCircularComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return {
      host: fixture.componentInstance,
      bars: [el.querySelector('shy-progress'), el.querySelector('shy-progress-circular')] as HTMLElement[],
      set(change: () => void) {
        change();
        fixture.detectChanges();
      },
    };
  }

  it('role="progressbar" com aria-valuenow/min/max, nome acessível e fração em --_value', () => {
    const { bars } = render();

    for (const bar of bars) {
      expect(bar.getAttribute('role')).toBe('progressbar');
      expect(bar.getAttribute('aria-valuemin')).toBe('0');
      expect(bar.getAttribute('aria-valuemax')).toBe('100');
      expect(bar.getAttribute('aria-valuenow')).toBe('40');
      expect(bar.getAttribute('aria-label')).toBe('Upload');
      expect(bar.hasAttribute('data-indeterminate')).toBe(false);
      expect(bar.style.getPropertyValue('--_value')).toBe('0.4');
    }
  });

  it('sem valor fica indeterminado: sem aria-valuenow', () => {
    const { host, bars, set } = render();
    set(() => host.value.set(null));

    for (const bar of bars) {
      expect(bar.hasAttribute('aria-valuenow')).toBe(false);
      expect(bar.hasAttribute('data-indeterminate')).toBe(true);
      expect(bar.querySelector('.is-indeterminate')).not.toBeNull();
    }
  });

  it('limita o valor a [0, max] e respeita max', () => {
    const { host, bars, set } = render();

    set(() => {
      host.value.set(30);
      host.max.set(60);
    });
    expect(bars[0].getAttribute('aria-valuemax')).toBe('60');
    expect(bars[0].style.getPropertyValue('--_value')).toBe('0.5');

    set(() => host.value.set(90));
    expect(bars[0].getAttribute('aria-valuenow')).toBe('60');

    set(() => host.value.set(-5));
    expect(bars[0].getAttribute('aria-valuenow')).toBe('0');
  });

  it('max inválido volta para 100; valor em string é convertido', () => {
    const { host, bars, set } = render();
    set(() => {
      host.max.set(0);
      host.value.set('25');
    });

    expect(bars[1].getAttribute('aria-valuemax')).toBe('100');
    expect(bars[1].getAttribute('aria-valuenow')).toBe('25');
  });
});
