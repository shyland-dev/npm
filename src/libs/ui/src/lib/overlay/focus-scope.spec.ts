import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { focusableElements, focusInitial, FocusScopeDirective, restoreFocus, trapTab } from './focus-scope';

function build(html: string): HTMLElement {
  const root = document.createElement('div');
  root.tabIndex = -1;
  root.innerHTML = html;
  document.body.append(root);
  return root;
}

const tab = (shiftKey = false) => new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true, bubbles: true });

describe('focus helpers', () => {
  afterEach(() => (document.body.innerHTML = ''));

  it('focusableElements ignora desabilitados, hidden, inert e tabindex negativo', () => {
    const root = build(`<button id="a">a</button><button disabled>b</button><div hidden><button>c</button></div><div inert><button>d</button></div><a href="#" tabindex="-1">e</a><input id="f"><div tabindex="0" id="g"></div>`);
    expect(focusableElements(root).map((el) => el.id)).toEqual(['a', 'f', 'g']);
  });

  it('focusInitial: first prefere [autofocus]', () => {
    const root = build(`<button id="a">a</button><input id="b" autofocus>`);
    focusInitial(root, 'first');
    expect(document.activeElement?.id).toBe('b');
  });

  it('focusInitial: sem focável foca o próprio root; pane foca o root; none não mexe', () => {
    const root = build(`<p>texto</p>`);
    focusInitial(root, 'first');
    expect(document.activeElement).toBe(root);
    const other = build(`<button id="x">x</button>`);
    other.querySelector('button')!.focus();
    focusInitial(root, 'none');
    expect(document.activeElement?.id).toBe('x');
    focusInitial(root, 'pane');
    expect(document.activeElement).toBe(root);
  });

  it('focusInitial aceita um elemento', () => {
    const root = build(`<button id="a">a</button><button id="b">b</button>`);
    focusInitial(root, root.querySelector<HTMLElement>('#b')!);
    expect(document.activeElement?.id).toBe('b');
  });

  it('trapTab cicla do último para o primeiro e do primeiro para o último', () => {
    const root = build(`<button id="a">a</button><button id="b">b</button>`);
    const [a, b] = Array.from(root.querySelectorAll('button'));
    b.focus();
    const forward = tab();
    expect(trapTab(root, forward)).toBe(true);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(a);

    const backward = tab(true);
    expect(trapTab(root, backward)).toBe(true);
    expect(document.activeElement).toBe(b);
  });

  it('trapTab deixa o navegador agir no meio da lista e ignora outras teclas', () => {
    const root = build(`<button id="a">a</button><button id="b">b</button><button id="c">c</button>`);
    root.querySelector<HTMLElement>('#b')!.focus();
    const event = tab();
    expect(trapTab(root, event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    expect(trapTab(root, new KeyboardEvent('keydown', { key: 'Enter' }))).toBe(false);
  });

  it('trapTab com o foco fora do root puxa para dentro; sem focáveis, mantém no root', () => {
    const root = build(`<button id="a">a</button>`);
    const outside = build(`<button id="o">o</button>`).querySelector('button')!;
    outside.focus();
    trapTab(root, tab());
    expect(document.activeElement?.id).toBe('a');

    const empty = build('');
    trapTab(empty, tab());
    expect(document.activeElement).toBe(empty);
  });

  it('restoreFocus ignora elemento desconectado', () => {
    const el = document.createElement('button');
    expect(() => restoreFocus(el)).not.toThrow();
    expect(() => restoreFocus(null)).not.toThrow();
  });
});

@Component({
  imports: [FocusScopeDirective],
  template: `
    @if (open) {
      <div shyFocusScope shyFocusScopeTrap>
        <button id="first">1</button>
        <button id="last">2</button>
      </div>
    }
  `,
})
class Host {
  open = true;
}

describe('FocusScopeDirective', () => {
  it('foca o primeiro, prende o Tab e devolve o foco ao ser destruída', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement?.id).toBe('first');

    const last = fixture.nativeElement.querySelector('#last') as HTMLElement;
    last.focus();
    last.dispatchEvent(tab());
    expect(document.activeElement?.id).toBe('first');

    fixture.componentInstance.open = false;
    fixture.changeDetectorRef.detectChanges();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});
