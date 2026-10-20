import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from './switch.component';

@Component({
  imports: [SwitchComponent, ReactiveFormsModule],
  template: `<shy-switch [formControl]="control">Notificações</shy-switch>`,
})
class Host {
  readonly control = new FormControl(false, { nonNullable: true });
}

describe('SwitchComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    return { fixture, host: fixture.componentInstance, input };
  }

  it('é um checkbox nativo com role="switch", sem aria-checked redundante', async () => {
    const { input } = await render();
    expect(input.type).toBe('checkbox');
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.hasAttribute('aria-checked')).toBe(false);
  });

  it('alterna pelo clique e reflete no FormControl e em data-checked', async () => {
    const { fixture, host, input } = await render();
    input.click();
    fixture.detectChanges();
    expect(host.control.value).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('shy-switch')?.hasAttribute('data-checked')).toBe(true);
    host.control.setValue(false);
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });
});
