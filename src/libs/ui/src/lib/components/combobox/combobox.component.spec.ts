import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShySelectOption } from '../../interfaces/select/select.interface';
import { OverlayService } from '../../overlay/overlay.service';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ComboboxComponent } from './combobox.component';

const OPTIONS: ShySelectOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' },
  { value: 'd', label: 'Álamo' },
];

@Component({
  imports: [ComboboxComponent, FormsModule],
  template: `<shy-combobox [options]="options" [(ngModel)]="model" placeholder="Search" label="Letter" />`,
})
class NgModelHost {
  options = OPTIONS;
  model: string | null = null;
}

@Component({
  imports: [ComboboxComponent, ReactiveFormsModule, FormFieldComponent],
  template: `<shy-form-field label="Letter" hint="Pick one"><shy-combobox [options]="options" [formControl]="control" required /></shy-form-field>`,
})
class FieldHost {
  options = OPTIONS;
  control = new FormControl<string | null>(null, Validators.required);
}

@Component({
  imports: [ComboboxComponent],
  template: `<shy-combobox [options]="options" [(value)]="value" label="Letter" />`,
})
class SignalHost {
  options = OPTIONS;
  value = signal<unknown>('c');
}

const pane = () => document.querySelector('.shy-overlay-pane') as HTMLElement | null;
const optionEls = () => Array.from(document.querySelectorAll<HTMLElement>('.shy-overlay-pane [role="option"]'));

function mount<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  document.body.append(fixture.nativeElement);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  const input = root.querySelector('[role="combobox"]') as HTMLInputElement;
  const key = (k: string) => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };
  const type_ = (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  };
  return { fixture, root, input, key, type: type_, host: fixture.componentInstance };
}

async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('ComboboxComponent', () => {
  afterEach(async () => {
    await TestBed.inject(OverlayService).closeAll(false);
    document.body.querySelectorAll('[ng-version]').forEach((el) => el.remove());
  });

  it('o campo é um combobox com listbox no painel (aria-controls, activedescendant, aria-selected, aria-disabled)', async () => {
    const { fixture, input, key } = mount(NgModelHost);
    await settle(fixture);
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-label')).toBe('Letter');

    key('ArrowDown');

    const listbox = pane()!.querySelector('[role="listbox"]')!;
    expect(pane()!.dataset['layer']).toBe('dropdown');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    expect(optionEls().map((o) => o.textContent?.trim())).toEqual(['Alpha', 'Beta', 'Gamma', 'Álamo']);
    expect(optionEls()[1].getAttribute('aria-disabled')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
  });

  it('digitar filtra sem acento nem caixa e abre o painel', async () => {
    const { fixture, input, type } = mount(NgModelHost);
    await settle(fixture);
    type('ala');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(optionEls().map((o) => o.textContent?.trim())).toEqual(['Álamo']);
  });

  it('sem resultado mostra o texto vazio numa região role=status', async () => {
    const { fixture, type } = mount(NgModelHost);
    await settle(fixture);
    type('zzz');
    expect(optionEls().length).toBe(0);
    expect(pane()!.querySelector('[role="status"]')!.textContent).toContain('No results');
  });

  it('setas pulam a opção desabilitada e Enter escolhe, grava o valor e põe o rótulo no campo', async () => {
    const { fixture, input, key, host } = mount(NgModelHost);
    await settle(fixture);
    key('ArrowDown'); // abre em Alpha
    key('ArrowDown'); // pula Beta
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    key('Enter');
    await settle(fixture);
    expect(host.model).toBe('c');
    expect(input.value).toBe('Gamma');
    expect(pane()).toBeNull();
  });

  it('Esc fecha e restaura o texto da escolha', async () => {
    const { fixture, input, key, type } = mount(SignalHost);
    await settle(fixture);
    expect(input.value).toBe('Gamma');
    type('xx');
    key('Escape');
    await settle(fixture);
    expect(pane()).toBeNull();
    expect(input.value).toBe('Gamma');
  });

  it('apagar o texto limpa o valor', async () => {
    const { fixture, host, type } = mount(SignalHost);
    await settle(fixture);
    type('');
    expect(host.value()).toBeNull();
  });

  it('clique numa opção escolhe e ignora a desabilitada', async () => {
    const { fixture, host, type } = mount(SignalHost);
    await settle(fixture);
    type('');
    optionEls()[1].click();
    fixture.detectChanges();
    expect(host.value()).toBeNull();
    optionEls()[0].click();
    fixture.detectChanges();
    expect(host.value()).toBe('a');
  });

  it('formControl: valor inicial vira texto, required marca inválido ao sair e erra no campo', async () => {
    const { fixture, input, host } = mount(FieldHost);
    await settle(fixture);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();

    host.control.setValue('a');
    await settle(fixture);
    expect(input.value).toBe('Alpha');

    host.control.setValue(null);
    host.control.markAsTouched();
    await settle(fixture);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('desabilitado não abre', async () => {
    const { fixture, input, key, host } = mount(FieldHost);
    host.control.disable();
    await settle(fixture);
    expect(input.disabled).toBe(true);
    key('ArrowDown');
    expect(pane()).toBeNull();
  });
});
