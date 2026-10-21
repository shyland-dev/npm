import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepComponent } from './step.component';
import { StepperComponent } from './stepper.component';

@Component({
  imports: [StepperComponent, StepComponent],
  template: `
    <shy-stepper [(value)]="value" [linear]="linear()" label="Checkout" [orientation]="orientation()">
      <shy-step label="Cart" description="Items" />
      <shy-step label="Address" [error]="addressError()" />
      <shy-step label="Payment" [disabled]="paymentDisabled()" />
      <shy-step label="Done" />
    </shy-stepper>
  `,
})
class Host {
  readonly value = signal(1);
  readonly linear = signal(false);
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly addressError = signal(false);
  readonly paymentDisabled = signal(false);
}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  const steps = () => Array.from(root.querySelectorAll('shy-step')) as HTMLElement[];
  const button = (i: number) => steps()[i].querySelector('button') as HTMLButtonElement;
  return { fixture, host: fixture.componentInstance, root, steps, button };
}

describe('StepperComponent', () => {
  it('lista nomeada; só o passo atual tem aria-current="step"; antes dele estão concluídos', () => {
    const { root, steps, button } = setup();
    const list = root.querySelector('ol')!;
    expect(list.getAttribute('aria-label')).toBe('Checkout');
    expect(steps().map((s) => s.getAttribute('role'))).toEqual(['listitem', 'listitem', 'listitem', 'listitem']);
    expect(steps().map((s) => s.getAttribute('data-status'))).toEqual(['complete', 'current', 'upcoming', 'upcoming']);
    expect(root.querySelectorAll('[aria-current]').length).toBe(1);
    expect(button(1).getAttribute('aria-current')).toBe('step');
    expect(steps()[0].querySelector('.status-text')?.textContent).toBe('Completed');
    expect(steps()[0].querySelector('.description')?.textContent).toBe('Items');
  });

  it('o marcador mostra o número (ícone no concluído) e fica fora da árvore de acessibilidade', () => {
    const { steps } = setup();
    expect(steps()[1].querySelector('.marker')?.textContent?.trim()).toBe('2');
    expect(steps()[1].querySelector('.marker')?.getAttribute('aria-hidden')).toBe('true');
    expect(steps()[0].querySelector('.marker shy-icon')).not.toBeNull();
  });

  it('clicar num passo atualiza o model (nos dois sentidos fora do modo linear)', () => {
    const { fixture, host, button } = setup();
    button(3).click();
    fixture.detectChanges();
    expect(host.value()).toBe(3);
    button(0).click();
    fixture.detectChanges();
    expect(host.value()).toBe(0);
  });

  it('linear: só volta ou fica; passo adiante tem aria-disabled e ignora o clique', () => {
    const { fixture, host, button } = setup();
    host.linear.set(true);
    fixture.detectChanges();
    expect(button(2).getAttribute('aria-disabled')).toBe('true');
    expect(button(0).hasAttribute('aria-disabled')).toBe(false);
    button(3).click();
    fixture.detectChanges();
    expect(host.value()).toBe(1);
    button(0).click();
    fixture.detectChanges();
    expect(host.value()).toBe(0);
  });

  it('erro: status "error", texto escondido e marcador de erro; disabled usa o atributo nativo', () => {
    const { fixture, host, steps, button } = setup();
    host.addressError.set(true);
    host.paymentDisabled.set(true);
    fixture.detectChanges();
    expect(steps()[1].getAttribute('data-status')).toBe('error');
    expect(steps()[1].querySelector('.status-text')?.textContent).toBe('Error');
    expect(button(1).getAttribute('aria-current')).toBe('step');
    expect(button(2).disabled).toBe(true);
  });

  it('value fora do intervalo é limitado aos passos', () => {
    const { fixture, host, steps } = setup();
    host.value.set(99);
    fixture.detectChanges();
    expect(steps().map((s) => s.getAttribute('data-status'))).toEqual(['complete', 'complete', 'complete', 'current']);
  });

  it('orientation vira data-orientation', () => {
    const { fixture, host, root } = setup();
    host.orientation.set('vertical');
    fixture.detectChanges();
    expect(root.querySelector('shy-stepper')?.getAttribute('data-orientation')).toBe('vertical');
  });
});
