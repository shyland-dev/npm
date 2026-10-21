import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionComponent } from './accordion.component';

@Component({
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <shy-accordion [multiple]="multiple()">
      <shy-accordion-item label="Um" [(open)]="first">Corpo 1</shy-accordion-item>
      <shy-accordion-item label="Dois" disabled>Corpo 2</shy-accordion-item>
      <shy-accordion-item label="Três" [level]="4">Corpo 3</shy-accordion-item>
    </shy-accordion>
  `,
})
class Host {
  multiple = signal(false);
  first = signal(false);
}

describe('AccordionComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const triggers = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.trigger'));
    const panels = () => Array.from(el.querySelectorAll<HTMLElement>('[role=region]'));
    const press = (target: HTMLElement, key: string) => {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      fixture.detectChanges();
    };
    return { fixture, host: fixture.componentInstance, triggers, panels, press };
  }

  it('semântica: heading com botão aria-expanded/aria-controls e painel region inert quando fechado', () => {
    const { fixture, triggers, panels } = render();
    expect(fixture.nativeElement.querySelectorAll('[role=heading]')[2].getAttribute('aria-level')).toBe('4');
    triggers().forEach((t, i) => {
      expect(t.getAttribute('aria-expanded')).toBe('false');
      expect(t.getAttribute('aria-controls')).toBe(panels()[i].id);
      expect(panels()[i].getAttribute('aria-labelledby')).toBe(t.id);
      expect(panels()[i].hasAttribute('inert')).toBe(true);
    });
    expect(triggers()[1].disabled).toBe(true);
  });

  it('clique abre e fecha, atualiza [(open)] e remove o inert', () => {
    const { fixture, host, triggers, panels } = render();
    triggers()[0].click();
    fixture.detectChanges();
    expect(host.first()).toBe(true);
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('true');
    expect(panels()[0].hasAttribute('inert')).toBe(false);
    triggers()[0].click();
    fixture.detectChanges();
    expect(host.first()).toBe(false);
  });

  it('modo único: abrir um fecha o outro; multiple mantém os dois', () => {
    const { fixture, host, triggers } = render();
    triggers()[0].click();
    triggers()[2].click();
    fixture.detectChanges();
    expect(triggers().map((t) => t.getAttribute('aria-expanded'))).toEqual(['false', 'false', 'true']);
    expect(host.first()).toBe(false);

    host.multiple.set(true);
    fixture.detectChanges();
    triggers()[0].click();
    fixture.detectChanges();
    expect(triggers().map((t) => t.getAttribute('aria-expanded'))).toEqual(['true', 'false', 'true']);
  });

  it('teclado: ↓/↑ e Home/End movem entre cabeçalhos habilitados, sem dar a volta', () => {
    const { triggers, press } = render();
    triggers()[0].focus();
    press(triggers()[0], 'ArrowDown');
    expect(document.activeElement).toBe(triggers()[2]);
    press(triggers()[2], 'ArrowDown');
    expect(document.activeElement).toBe(triggers()[2]);
    press(triggers()[2], 'Home');
    expect(document.activeElement).toBe(triggers()[0]);
    press(triggers()[0], 'End');
    expect(document.activeElement).toBe(triggers()[2]);
    press(triggers()[2], 'ArrowUp');
    expect(document.activeElement).toBe(triggers()[0]);
  });
});
