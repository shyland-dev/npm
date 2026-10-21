import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectOption, SelectionChangeEvent, ShySelectOption } from '../../interfaces/select/select.interface';
import { OverlayService } from '../../overlay/overlay.service';
import { FormFieldComponent } from '../form-field/form-field.component';
import { SelectComponent } from './select.component';

const OPTIONS: ShySelectOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' },
  { value: 'd', label: 'Delta' },
];

@Component({
  imports: [SelectComponent, FormsModule],
  template: `<shy-select [options]="options" [(ngModel)]="model" placeholder="Pick one" label="Letter" />`,
})
class NgModelHost {
  options = OPTIONS;
  model: string | null = null;
}

@Component({
  imports: [SelectComponent, ReactiveFormsModule],
  template: `<shy-select [options]="options" [formControl]="control" multiple label="Letters" />`,
})
class ReactiveHost {
  options = OPTIONS;
  control = new FormControl<string[]>(['a']);
}

@Component({
  imports: [SelectComponent],
  template: `<shy-select [options]="options" [(value)]="value" label="Letter" />`,
})
class SignalHost {
  options = OPTIONS;
  value = signal<unknown>('c');
}

@Component({
  imports: [SelectComponent, FormFieldComponent, ReactiveFormsModule],
  template: `<shy-form-field label="Country" hint="Pick one"><shy-select [options]="options" [formControl]="control" /></shy-form-field>`,
})
class FieldHost {
  options = OPTIONS;
  control = new FormControl('', { nonNullable: true });
}

@Component({
  imports: [SelectComponent],
  template: `<shy-select [selectOptions]="legacy" [selectedOption]="selected()" (onSelectionChange)="events.push($event)">Pick legacy</shy-select>`,
})
class LegacyHost {
  legacy: SelectOption[] = [
    { id: 0, value: 'a', label: 'Alpha' },
    { id: 1, value: 'b', label: 'Beta' },
  ];
  selected = signal<string | null>(null);
  events: SelectionChangeEvent[] = [];
}

const pane = () => document.querySelector('.shy-overlay-pane') as HTMLElement | null;
const optionEls = () => Array.from(document.querySelectorAll<HTMLElement>('.shy-overlay-pane [role="option"]'));
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function mount<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  document.body.append(fixture.nativeElement);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  const trigger = root.querySelector('[role="combobox"]') as HTMLButtonElement;
  const key = (k: string) => {
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };
  return { fixture, root, trigger, key, host: fixture.componentInstance };
}

async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('SelectComponent', () => {
  afterEach(async () => {
    await TestBed.inject(OverlayService).closeAll(false);
    document.querySelectorAll('shy-select, shy-form-field').forEach((el) => el.closest('[ng-version]')?.remove());
    document.body.querySelectorAll('[ng-version]').forEach((el) => el.remove());
  });

  describe('ARIA e painel', () => {
    it('o botão é um combobox com listbox no painel (aria-controls, activedescendant, aria-selected, aria-disabled)', () => {
      const { fixture, trigger, key } = mount(NgModelHost);
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.textContent).toContain('Pick one');
      expect(trigger.getAttribute('aria-label')).toBe('Letter');

      trigger.click();
      fixture.detectChanges();

      const listbox = pane()!.querySelector('[role="listbox"]')!;
      expect(pane()!.dataset['layer']).toBe('dropdown');
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(trigger.getAttribute('aria-controls')).toBe(listbox.id);
      expect(listbox.getAttribute('aria-label')).toBe('Letter');
      expect(optionEls().map((o) => o.textContent?.trim())).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta']);
      expect(optionEls()[1].getAttribute('aria-disabled')).toBe('true');
      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
      expect(document.activeElement).not.toBe(listbox);
      key('Escape');
    });

    it('dentro do form-field: id/for do label, aria-describedby e aria-invalid vêm do campo', () => {
      const { fixture, root, trigger, host } = mount(FieldHost);
      const label = root.querySelector('label')!;
      expect(label.getAttribute('for')).toBe(trigger.id);
      expect(trigger.getAttribute('aria-describedby')).toBeTruthy();

      host.control.setErrors({ required: true });
      host.control.markAsTouched();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('teclado', () => {
    it('↓ abre na primeira opção habilitada; setas pulam a desabilitada, com volta; Home/End', () => {
      const { trigger, key } = mount(NgModelHost);
      key('ArrowDown');
      const active = () => document.getElementById(trigger.getAttribute('aria-activedescendant')!)?.textContent?.trim();
      expect(active()).toBe('Alpha');
      key('ArrowDown');
      expect(active()).toBe('Gamma');
      key('End');
      expect(active()).toBe('Delta');
      key('ArrowDown');
      expect(active()).toBe('Alpha');
      key('ArrowUp');
      expect(active()).toBe('Delta');
      key('Home');
      expect(active()).toBe('Alpha');
    });

    it('↑ abre na última opção', () => {
      const { trigger, key } = mount(NgModelHost);
      key('ArrowUp');
      expect(document.getElementById(trigger.getAttribute('aria-activedescendant')!)?.textContent?.trim()).toBe('Delta');
    });

    it('Enter escolhe, fecha, mantém o foco no botão e atualiza o ngModel', async () => {
      const { fixture, trigger, key, host } = mount(NgModelHost);
      await settle(fixture); // o ngModel escreve o valor inicial de forma assíncrona
      trigger.focus();
      key('ArrowDown');
      key('ArrowDown');
      key('Enter');
      await tick();
      await settle(fixture);

      expect(pane()).toBeNull();
      expect(host.model).toBe('c');
      expect(trigger.textContent).toContain('Gamma');
      expect(document.activeElement).toBe(trigger);
    });

    it('Espaço também escolhe quando aberto', async () => {
      const { trigger, key, host } = mount(NgModelHost);
      key(' ');
      key(' ');
      await tick();
      expect(host.model).toBe('a');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('typeahead salta para a opção que começa com a letra (pulando desabilitadas)', () => {
      const { trigger, key } = mount(NgModelHost);
      key('ArrowDown');
      key('d');
      expect(document.getElementById(trigger.getAttribute('aria-activedescendant')!)?.textContent?.trim()).toBe('Delta');
      key('b'); // Beta está desabilitada
      expect(document.getElementById(trigger.getAttribute('aria-activedescendant')!)?.textContent?.trim()).toBe('Delta');
    });

    it('Esc fecha sem alterar o valor e o foco continua no botão', async () => {
      const { trigger, key, host } = mount(NgModelHost);
      trigger.focus();
      key('ArrowDown');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await tick();
      expect(pane()).toBeNull();
      expect(host.model).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });

    it('blur (Tab) fecha o painel', async () => {
      const { trigger, key } = mount(NgModelHost);
      trigger.focus();
      key('ArrowDown');
      trigger.blur();
      await tick();
      expect(pane()).toBeNull();
    });

    it('clique fora fecha; clique no botão alterna', async () => {
      const { fixture, trigger } = mount(NgModelHost);
      trigger.click();
      expect(pane()).not.toBeNull();
      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      await tick();
      expect(pane()).toBeNull();

      trigger.click();
      trigger.click();
      await tick();
      fixture.detectChanges();
      expect(pane()).toBeNull();
    });

    it('clique numa opção escolhe; opção desabilitada não', async () => {
      const { fixture, trigger, host } = mount(NgModelHost);
      trigger.click();
      optionEls()[1].click();
      expect(host.model).toBeNull();
      expect(pane()).not.toBeNull();
      optionEls()[3].click();
      await tick();
      await settle(fixture);
      expect(host.model).toBe('d');
    });
  });

  describe('valor (CVA e signals)', () => {
    it('ngModel escreve o valor para o botão e lê de volta', async () => {
      const { fixture, trigger, host } = mount(NgModelHost);
      host.model = 'c';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await settle(fixture);
      expect(trigger.textContent).toContain('Gamma');
    });

    it('formControl com multiple: valor em array, alterna sem fechar, aria-multiselectable', () => {
      const { fixture, trigger, host } = mount(ReactiveHost);
      expect(trigger.textContent).toContain('Alpha');
      trigger.click();
      fixture.detectChanges();
      expect(pane()!.querySelector('[role="listbox"]')!.getAttribute('aria-multiselectable')).toBe('true');
      expect(optionEls()[0].getAttribute('aria-selected')).toBe('true');

      optionEls()[2].click();
      fixture.detectChanges();
      expect(host.control.value).toEqual(['a', 'c']);
      expect(host.control.dirty).toBe(true);
      expect(pane()).not.toBeNull();
      expect(trigger.textContent).toContain('Alpha, Gamma');

      optionEls()[0].click();
      expect(host.control.value).toEqual(['c']);
    });

    it('formControl.setValue e disable() refletem no componente', () => {
      const { fixture, trigger, host } = mount(ReactiveHost);
      host.control.setValue(['d']);
      fixture.detectChanges();
      expect(trigger.textContent).toContain('Delta');

      host.control.disable();
      fixture.detectChanges();
      expect(trigger.disabled).toBe(true);
      trigger.click();
      expect(pane()).toBeNull();
    });

    it('[(value)] com signal: mostra o valor e atualiza o signal', async () => {
      const { fixture, trigger, host } = mount(SignalHost);
      expect(trigger.textContent).toContain('Gamma');
      trigger.click();
      optionEls()[3].click();
      await tick();
      await settle(fixture);
      expect(host.value()).toBe('d');
      host.value.set('a');
      fixture.detectChanges();
      expect(trigger.textContent).toContain('Alpha');
    });

    it('compareWith compara objetos', () => {
      @Component({
        imports: [SelectComponent],
        template: `<shy-select [options]="options" [value]="{ id: 2 }" [compareWith]="same" label="x" />`,
      })
      class ObjHost {
        options: ShySelectOption[] = [
          { value: { id: 1 }, label: 'One' },
          { value: { id: 2 }, label: 'Two' },
        ];
        same = (a: unknown, b: unknown) => (a as { id: number }).id === (b as { id: number }).id;
      }
      const { trigger } = mount(ObjHost);
      expect(trigger.textContent).toContain('Two');
    });
  });

  describe('API antiga (@deprecated)', () => {
    it('mostra o conteúdo projetado como placeholder e escolhe por selectedOption', () => {
      const { fixture, trigger, host } = mount(LegacyHost);
      expect(trigger.textContent).toContain('Pick legacy');

      host.selected.set('b');
      fixture.detectChanges();
      expect(trigger.textContent).toContain('Beta');
    });

    it('selectOptions + onSelectionChange: escolher emite o evento antigo', async () => {
      const { fixture, trigger, host } = mount(LegacyHost);
      trigger.click();
      fixture.detectChanges();
      optionEls()[1].click();
      await tick();
      await settle(fixture);

      expect(host.events.map((e) => e.selectedOption.value)).toEqual(['b']);
      expect(host.events[0].selectedOption.id).toBe(1);
      expect(trigger.textContent).toContain('Beta');
    });
  });
});
