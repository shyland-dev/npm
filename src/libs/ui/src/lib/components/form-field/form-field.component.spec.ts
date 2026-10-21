import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { FormFieldComponent } from './form-field.component';

@Component({
  imports: [FormFieldComponent, InputComponent, ReactiveFormsModule],
  template: `
    <shy-form-field label="Nome" hint="Como no documento" error="Informe o nome" [required]="markRequired()" [counter]="true" [size]="size()" [invalid]="forced()">
      <span slot="prefix" class="pre">@</span>
      <input shyInput [formControl]="control" maxlength="10" />
    </shy-form-field>
    <shy-form-field label="Bio"><textarea shyInput id="bio"></textarea></shy-form-field>
  `,
})
class Host {
  readonly control = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly markRequired = signal(false);
  readonly size = signal<'sm' | 'md' | 'lg' | undefined>(undefined);
  readonly forced = signal<boolean | undefined>(undefined);
}

describe('FormFieldComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const refresh = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    };
    return {
      host: fixture.componentInstance,
      root,
      refresh,
      input: root.querySelector('input') as HTMLInputElement,
      label: root.querySelector('label') as HTMLLabelElement,
      error: root.querySelector('.error') as HTMLElement,
    };
  }

  it('liga o label ao controle por for/id e à dica por aria-describedby', async () => {
    const { input, label, root } = await render();
    expect(input.id).toMatch(/^shy-input-\d+$/);
    expect(label.getAttribute('for')).toBe(input.id);
    const hint = root.querySelector('.hint') as HTMLElement;
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('respeita o id definido no controle', async () => {
    const { root } = await render();
    const area = root.querySelector('textarea') as HTMLTextAreaElement;
    expect(area.id).toBe('bio');
    expect(root.querySelectorAll('label')[1].getAttribute('for')).toBe('bio');
  });

  it('não mostra erro nem aria-invalid antes de o campo ser tocado', async () => {
    const { input, error } = await render();
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-errormessage')).toBe(false);
    expect(error.textContent?.trim()).toBe('');
  });

  it('tocado e inválido: aria-invalid, aria-errormessage, texto e ícone', async () => {
    const { input, error, refresh } = await render();
    input.dispatchEvent(new Event('blur'));
    await refresh();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-errormessage')).toBe(error.id);
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
    expect(error.textContent).toContain('Informe o nome');
    expect(error.querySelector('shy-icon')).not.toBeNull();
    expect(error.getAttribute('aria-live')).toBe('polite');
  });

  it('markAllAsTouched (submit) também revela o erro, sem blur', async () => {
    const { host, input, refresh } = await render();
    host.control.markAllAsTouched();
    await refresh();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('o erro some quando o valor passa a ser válido', async () => {
    const { host, input, error, refresh } = await render();
    host.control.markAllAsTouched();
    await refresh();
    host.control.setValue('Ana');
    await refresh();
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(error.textContent?.trim()).toBe('');
  });

  it('invalid do campo força o estado', async () => {
    const { host, input, refresh } = await render();
    host.control.setValue('Ana');
    host.forced.set(true);
    await refresh();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('marca o rótulo com * (aria-hidden) quando required', async () => {
    const { host, label, refresh } = await render();
    expect(label.querySelector('.required')).toBeNull();
    host.markRequired.set(true);
    await refresh();
    expect(label.querySelector('.required')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('contador acompanha a digitação e usa o maxlength', async () => {
    const { input, root, refresh } = await render();
    const counter = root.querySelector('.counter') as HTMLElement;
    expect(counter.textContent?.trim()).toBe('0/10');
    input.value = 'abcd';
    input.dispatchEvent(new Event('input'));
    await refresh();
    expect(counter.textContent?.trim()).toBe('4/10');
  });

  it('size do campo prevalece e vai para a caixa e o controle', async () => {
    const { host, input, root, refresh } = await render();
    host.size.set('lg');
    await refresh();
    expect(input.getAttribute('data-size')).toBe('lg');
    expect(root.querySelector('.control')?.getAttribute('data-size')).toBe('lg');
  });

  it('projeta o prefixo no slot', async () => {
    const { root } = await render();
    expect(root.querySelector('.prefix .pre')).not.toBeNull();
    expect(root.querySelector('.suffix')?.children.length).toBe(0);
  });
});
