import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SelectOption, SelectionChangeEvent } from '../../interfaces/select/select.interface';
import { SelectComponent } from './select.component';

const OPTIONS: SelectOption[] = [
  { id: 0, value: 'a', label: 'Alpha' },
  { id: 1, value: 'b', label: 'Beta' },
  { id: 2, value: 'c', label: 'Gamma' },
];

@Component({
  imports: [SelectComponent],
  template: `<shy-select [selectOptions]="options" [selectedOption]="selected()" (onSelectionChange)="events.push($event)">Pick one</shy-select>`,
})
class HostComponent {
  options = OPTIONS;
  selected = signal<string | null>(null);
  events: SelectionChangeEvent[] = [];
}

function render() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  return {
    fixture,
    host: fixture.componentInstance,
    trigger: () => root.querySelector('.select__trigger') as HTMLButtonElement,
    list: () => root.querySelector('[role="listbox"]') as HTMLElement | null,
    options: () => Array.from(root.querySelectorAll<HTMLElement>('[role="option"]')),
    key: (target: HTMLElement, key: string) => {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      fixture.detectChanges();
    },
    async flush() {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    },
  };
}

describe('SelectComponent', () => {
  it('mostra o conteúdo projetado como placeholder e expõe ARIA no trigger', () => {
    const { trigger } = render();
    expect(trigger().textContent).toContain('Pick one');
    expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('clicar abre a listbox com options e aria-selected', async () => {
    const { fixture, trigger, list, options } = render();
    trigger().click();
    fixture.detectChanges();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(list()?.getAttribute('aria-labelledby')).toBe(trigger().id);
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Alpha', 'Beta', 'Gamma']);
    expect(options().every((o) => o.getAttribute('aria-selected') === 'false')).toBe(true);
  });

  it('escolher uma opção emite, fecha e mostra o rótulo', () => {
    const { fixture, host, trigger, list, options } = render();
    trigger().click();
    fixture.detectChanges();
    options()[1].click();
    fixture.detectChanges();

    expect(host.events.map((e) => e.selectedOption.value)).toEqual(['b']);
    expect(list()).toBeNull();
    expect(trigger().textContent).toContain('Beta');
  });

  it('selectedOption pré-seleciona e acompanha mudança do input', () => {
    const { fixture, host, trigger } = render();
    host.selected.set('c');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Gamma');

    host.selected.set('a');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Alpha');
  });

  it('ArrowDown no trigger abre e foca a primeira opção; setas e Home/End navegam com wrap', async () => {
    const { fixture, trigger, list, options, key, flush } = render();
    key(trigger(), 'ArrowDown');
    await flush();

    expect(list()).not.toBeNull();
    expect(document.activeElement).toBe(options()[0]);

    key(options()[0], 'ArrowDown');
    expect(document.activeElement).toBe(options()[1]);
    key(options()[1], 'End');
    expect(document.activeElement).toBe(options()[2]);
    key(options()[2], 'ArrowDown');
    expect(document.activeElement).toBe(options()[0]);
    key(options()[0], 'ArrowUp');
    expect(document.activeElement).toBe(options()[2]);
    key(options()[2], 'Home');
    expect(document.activeElement).toBe(options()[0]);
    fixture.destroy();
  });

  it('Enter seleciona e devolve o foco ao trigger', async () => {
    const { host, trigger, options, key, flush } = render();
    key(trigger(), 'ArrowDown');
    await flush();
    key(options()[0], 'ArrowDown');
    key(options()[1], 'Enter');

    expect(host.events[0].selectedOption.value).toBe('b');
    expect(document.activeElement).toBe(trigger());
  });

  it('Escape fecha sem emitir e devolve o foco', async () => {
    const { host, trigger, list, options, key, flush } = render();
    key(trigger(), 'ArrowDown');
    await flush();
    key(options()[0], 'Escape');

    expect(list()).toBeNull();
    expect(host.events).toEqual([]);
    expect(document.activeElement).toBe(trigger());
  });

  it('clique fora fecha a listbox', () => {
    const { fixture, trigger, list } = render();
    trigger().click();
    fixture.detectChanges();
    expect(list()).not.toBeNull();

    document.body.click();
    fixture.detectChanges();
    expect(list()).toBeNull();
  });
});
