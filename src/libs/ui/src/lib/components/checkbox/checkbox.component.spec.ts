import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { CheckboxComponent } from './checkbox.component';

@Component({
  imports: [CheckboxComponent, FormFieldComponent, ReactiveFormsModule],
  template: `
    <shy-checkbox [(checked)]="checked" [(indeterminate)]="partial" [disabled]="disabled()" name="terms" value="yes">Aceito</shy-checkbox>
    <shy-checkbox [formControl]="control" label="Rótulo" />
    <shy-form-field hint="Obrigatório" error="Aceite os termos">
      <shy-checkbox [formControl]="required">Termos</shy-checkbox>
    </shy-form-field>
  `,
})
class Host {
  readonly checked = signal(false);
  readonly partial = signal(false);
  readonly disabled = signal(false);
  readonly control = new FormControl(true, { nonNullable: true });
  readonly required = new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] });
}

describe('CheckboxComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const refresh = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const el = fixture.nativeElement as HTMLElement;
    const inputs = Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
    return { fixture, host: fixture.componentInstance, el, inputs, refresh };
  }

  it('usa input nativo checkbox, com texto projetado e atributos nativos', async () => {
    const { inputs, el } = await render();
    expect(inputs[0].type).toBe('checkbox');
    expect(inputs[0].name).toBe('terms');
    expect(inputs[0].value).toBe('yes');
    expect(el.querySelector('.label')?.textContent).toContain('Aceito');
    expect(inputs[1].getAttribute('aria-label')).toBe('Rótulo');
  });

  it('o clique atualiza checked (two-way) e data-checked', async () => {
    const { host, inputs, el, refresh } = await render();
    inputs[0].click();
    await refresh();
    expect(host.checked()).toBe(true);
    expect(el.querySelector('shy-checkbox')?.hasAttribute('data-checked')).toBe(true);
    inputs[0].click();
    await refresh();
    expect(host.checked()).toBe(false);
  });

  it('indeterminate: propriedade nativa, data-indeterminate e some no clique', async () => {
    const { host, inputs, el, refresh } = await render();
    host.partial.set(true);
    await refresh();
    expect(inputs[0].indeterminate).toBe(true);
    expect(el.querySelector('shy-checkbox')?.hasAttribute('data-indeterminate')).toBe(true);
    inputs[0].click();
    await refresh();
    expect(host.partial()).toBe(false);
    expect(inputs[0].indeterminate).toBe(false);
  });

  it('formControl: valor inicial, mudança e setDisabledState', async () => {
    const { host, inputs, refresh } = await render();
    expect(inputs[1].checked).toBe(true);
    inputs[1].click();
    await refresh();
    expect(host.control.value).toBe(false);
    host.control.disable();
    await refresh();
    expect(inputs[1].disabled).toBe(true);
    host.control.enable();
    host.control.setValue(true);
    await refresh();
    expect(inputs[1].checked).toBe(true);
  });

  it('disabled bloqueia e marca data-disabled', async () => {
    const { host, inputs, el, refresh } = await render();
    host.disabled.set(true);
    await refresh();
    expect(inputs[0].disabled).toBe(true);
    expect(el.querySelector('shy-checkbox')?.hasAttribute('data-disabled')).toBe(true);
  });

  it('dentro do form-field: describedBy sempre; erro só depois do blur (touched)', async () => {
    const { inputs, el, refresh } = await render();
    const hint = el.querySelector('.hint') as HTMLElement;
    const error = el.querySelector('.error') as HTMLElement;
    expect(inputs[2].getAttribute('aria-describedby')).toBe(hint.id);
    expect(inputs[2].hasAttribute('aria-invalid')).toBe(false);
    inputs[2].dispatchEvent(new Event('blur'));
    await refresh();
    expect(inputs[2].getAttribute('aria-invalid')).toBe('true');
    expect(inputs[2].getAttribute('aria-errormessage')).toBe(error.id);
    expect(error.textContent).toContain('Aceite os termos');
  });

  it('markAllAsTouched revela o erro sem blur e marcar o remove', async () => {
    const { host, inputs, refresh } = await render();
    host.required.markAllAsTouched();
    await refresh();
    expect(inputs[2].getAttribute('aria-invalid')).toBe('true');
    inputs[2].click();
    await refresh();
    expect(inputs[2].hasAttribute('aria-invalid')).toBe(false);
  });
});
