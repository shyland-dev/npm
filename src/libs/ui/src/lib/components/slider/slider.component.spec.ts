import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { SliderComponent } from './slider.component';

@Component({
  imports: [SliderComponent, FormsModule],
  template: `<shy-slider [(ngModel)]="model" label="Volume" [min]="10" [max]="50" [step]="5" showValue [displayWith]="fmt" />`,
})
class NgModelHost {
  model = 20;
  fmt = (v: number) => `${v} percent`;
}

@Component({
  imports: [SliderComponent, ReactiveFormsModule, FormFieldComponent],
  template: `<shy-form-field label="Level" hint="Pick"><shy-slider [formControl]="control" /></shy-form-field>`,
})
class FieldHost {
  control = new FormControl(30, { nonNullable: true });
}

@Component({
  imports: [SliderComponent],
  template: `<shy-slider [(value)]="value" label="Level" />`,
})
class SignalHost {
  value = signal(40);
}

function mount<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  document.body.append(fixture.nativeElement);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  return { fixture, root, input: root.querySelector('input[type="range"]') as HTMLInputElement, host: fixture.componentInstance };
}

async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function slide(fixture: ComponentFixture<unknown>, input: HTMLInputElement, value: number) {
  input.value = String(value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  fixture.detectChanges();
}

describe('SliderComponent', () => {
  afterEach(() => document.body.querySelectorAll('[ng-version]').forEach((el) => el.remove()));

  it('usa o input range nativo com min/max/step, rótulo e aria-valuetext', async () => {
    const { fixture, root, input } = mount(NgModelHost);
    await settle(fixture);
    expect(input.min).toBe('10');
    expect(input.max).toBe('50');
    expect(input.step).toBe('5');
    expect(input.value).toBe('20');
    expect(input.getAttribute('aria-label')).toBe('Volume');
    expect(input.getAttribute('aria-valuetext')).toBe('20 percent');
    expect(root.querySelector('.slider__value')!.textContent).toContain('20 percent');
  });

  it('mexer no controle grava no ngModel e atualiza a porcentagem do trilho', async () => {
    const { fixture, root, input, host } = mount(NgModelHost);
    await settle(fixture);
    slide(fixture, input, 30);
    expect(host.model).toBe(30);
    expect((root as HTMLElement).querySelector('shy-slider')!.getAttribute('style')).toContain('--_pct: 50');
  });

  it('[(value)] e formControl refletem o valor inicial e mudanças externas', async () => {
    const sig = mount(SignalHost);
    await settle(sig.fixture);
    expect(sig.input.value).toBe('40');
    slide(sig.fixture, sig.input, 70);
    expect(sig.host.value()).toBe(70);

    const field = mount(FieldHost);
    await settle(field.fixture);
    expect(field.input.value).toBe('30');
    field.host.control.setValue(80);
    await settle(field.fixture);
    expect(field.input.value).toBe('80');
    expect(field.input.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('desabilitado pelo formControl desabilita o input nativo', async () => {
    const { fixture, input, host } = mount(FieldHost);
    host.control.disable();
    await settle(fixture);
    expect(input.disabled).toBe(true);
  });
});
