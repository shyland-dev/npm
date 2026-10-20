import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from './radio.component';

@Component({
  imports: [RadioGroupComponent, RadioComponent, FormFieldComponent, ReactiveFormsModule],
  template: `
    <shy-radio-group label="Plano" [(value)]="plan" [disabled]="off()">
      <shy-radio value="free">Free</shy-radio>
      <shy-radio value="pro">Pro</shy-radio>
      <shy-radio [value]="enterprise" [disabled]="true">Enterprise</shy-radio>
    </shy-radio-group>
    <shy-form-field label="Cor" error="Escolha uma cor">
      <shy-radio-group [formControl]="color">
        <shy-radio value="red">Vermelho</shy-radio>
        <shy-radio value="blue">Azul</shy-radio>
      </shy-radio-group>
    </shy-form-field>
  `,
})
class Host {
  readonly plan = signal<unknown>('free');
  readonly off = signal(false);
  readonly enterprise = { id: 3 };
  readonly color = new FormControl<string | null>(null, Validators.required);
}

describe('RadioGroupComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const refresh = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const el = fixture.nativeElement as HTMLElement;
    const groups = Array.from(el.querySelectorAll('shy-radio-group')) as HTMLElement[];
    const radios = Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
    return { host: fixture.componentInstance, el, groups, radios, refresh };
  }

  it('role="radiogroup" com nome acessível, e radios nativos com o mesmo name', async () => {
    const { groups, radios } = await render();
    expect(groups[0].getAttribute('role')).toBe('radiogroup');
    expect(groups[0].getAttribute('aria-label')).toBe('Plano');
    expect(radios[0].type).toBe('radio');
    expect(radios[0].name).toBe(radios[1].name);
    expect(radios[0].name).not.toBe(radios[3].name);
  });

  it('marca o radio do value e troca pelo clique (two-way)', async () => {
    const { host, radios, refresh } = await render();
    expect(radios.map((r) => r.checked).slice(0, 3)).toEqual([true, false, false]);
    radios[1].click();
    await refresh();
    expect(host.plan()).toBe('pro');
    expect(radios.map((r) => r.checked).slice(0, 2)).toEqual([false, true]);
  });

  it('aceita valor que não é string (Object.is) e desabilita só a opção', async () => {
    const { host, radios, refresh } = await render();
    expect(radios[2].disabled).toBe(true);
    expect(radios[2].hasAttribute('value')).toBe(false);
    host.plan.set(host.enterprise);
    await refresh();
    expect(radios[2].checked).toBe(true);
  });

  it('grupo desabilitado desabilita todos e marca aria-disabled', async () => {
    const { host, groups, radios, refresh } = await render();
    host.off.set(true);
    await refresh();
    expect(radios.slice(0, 3).every((r) => r.disabled)).toBe(true);
    expect(groups[0].getAttribute('aria-disabled')).toBe('true');
  });

  it('formControl: escrita, mudança e setDisabledState', async () => {
    const { host, radios, refresh } = await render();
    host.color.setValue('blue');
    await refresh();
    expect(radios[4].checked).toBe(true);
    radios[3].click();
    await refresh();
    expect(host.color.value).toBe('red');
    host.color.disable();
    await refresh();
    expect(radios[3].disabled && radios[4].disabled).toBe(true);
  });

  it('no form-field: aria-labelledby do rótulo; erro só depois de tocado (foco saiu do grupo)', async () => {
    const { host, el, groups, refresh } = await render();
    const label = el.querySelector('label.label') as HTMLElement;
    expect(groups[1].getAttribute('aria-labelledby')).toBe(label.id);
    expect(groups[1].hasAttribute('aria-invalid')).toBe(false);
    groups[1].dispatchEvent(new FocusEvent('focusout', { relatedTarget: document.body }));
    await refresh();
    expect(groups[1].getAttribute('aria-invalid')).toBe('true');
    expect(groups[1].getAttribute('aria-errormessage')).toBe((el.querySelector('.error') as HTMLElement).id);
    host.color.setValue('red');
    await refresh();
    expect(groups[1].hasAttribute('aria-invalid')).toBe(false);
  });

  it('mover o foco entre radios do grupo não conta como tocar', async () => {
    const { groups, radios, refresh } = await render();
    groups[1].dispatchEvent(new FocusEvent('focusout', { relatedTarget: radios[4], bubbles: true }));
    await refresh();
    expect(groups[1].hasAttribute('aria-invalid')).toBe(false);
  });
});
