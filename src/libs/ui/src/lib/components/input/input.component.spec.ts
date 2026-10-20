import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  imports: [InputComponent, FormsModule],
  template: `
    <input shyInput="sm" placeholder="a" [invalid]="invalid()" />
    <textarea shyInput [(ngModel)]="text" maxlength="5" required></textarea>
    <input shyInput />
  `,
})
class Host {
  readonly invalid = signal<boolean | undefined>(undefined);
  text = '';
}

describe('InputComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const [first, area, bare] = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('input, textarea')) as HTMLElement[];
    return { fixture, host: fixture.componentInstance, first, area, bare };
  }

  it('gera ids únicos e usa o tamanho de shyInput (padrão md)', async () => {
    const { first, bare } = await render();
    expect(first.id).toMatch(/^shy-input-\d+$/);
    expect(first.id).not.toBe(bare.id);
    expect(first.getAttribute('data-size')).toBe('sm');
    expect(bare.getAttribute('data-size')).toBe('md');
  });

  it('standalone: invalid vira aria-invalid e data-invalid; sem ele, nenhum dos dois', async () => {
    const { fixture, host, first } = await render();
    expect(first.hasAttribute('aria-invalid')).toBe(false);
    host.invalid.set(true);
    fixture.detectChanges();
    expect(first.getAttribute('aria-invalid')).toBe('true');
    expect(first.hasAttribute('data-invalid')).toBe(true);
    host.invalid.set(false);
    fixture.detectChanges();
    expect(first.hasAttribute('aria-invalid')).toBe(false);
  });

  it('textarea funciona com ngModel e recebe required e maxlength nativos', async () => {
    const { fixture, area } = await render();
    expect(area.tagName).toBe('TEXTAREA');
    expect(area.hasAttribute('required')).toBe(true);
    expect(area.getAttribute('maxlength')).toBe('5');
    (area as HTMLTextAreaElement).value = 'abc';
    area.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.text).toBe('abc');
  });
});
