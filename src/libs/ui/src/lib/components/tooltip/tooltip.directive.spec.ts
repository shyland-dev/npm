import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayService } from '../../overlay/overlay.service';
import { TooltipDirective } from './tooltip.directive';

@Component({
  imports: [TooltipDirective],
  template: `<button id="t" shyTooltip="Excluir item" aria-describedby="extra">Del</button><span id="extra">info</span>`,
})
class Host {}

const pane = () => document.querySelector('.shy-overlay-pane') as HTMLElement | null;
const pointer = (el: Element, type: string, pointerType = 'mouse') => {
  const event = new Event(type);
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  el.dispatchEvent(event);
};

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<Host>;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(Host);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    trigger = fixture.nativeElement.querySelector('#t');
  });

  afterEach(async () => {
    await TestBed.inject(OverlayService).closeAll(false);
    fixture.nativeElement.remove();
    vi.useRealTimers();
  });

  it('abre depois do atraso no hover do mouse, com role=tooltip e aria-describedby acrescentado', () => {
    pointer(trigger, 'pointerenter');
    vi.advanceTimersByTime(499);
    expect(pane()).toBeNull();
    vi.advanceTimersByTime(1);

    expect(pane()!.getAttribute('role')).toBe('tooltip');
    expect(pane()!.dataset['layer']).toBe('tooltip');
    expect(pane()!.textContent).toContain('Excluir item');
    expect(trigger.getAttribute('aria-describedby')).toBe(`extra ${pane()!.id}`);
  });

  it('não abre no toque', () => {
    pointer(trigger, 'pointerenter', 'touch');
    vi.advanceTimersByTime(2000);
    expect(pane()).toBeNull();
  });

  it('sair do ponteiro fecha depois de um atraso curto e restaura o aria-describedby original', async () => {
    pointer(trigger, 'pointerenter');
    vi.advanceTimersByTime(500);
    pointer(trigger, 'pointerleave');
    vi.advanceTimersByTime(100);
    await vi.runAllTimersAsync();

    expect(pane()).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBe('extra');
  });

  it('é pairável: o ponteiro na dica cancela o fechamento', () => {
    pointer(trigger, 'pointerenter');
    vi.advanceTimersByTime(500);
    pointer(trigger, 'pointerleave');
    pointer(pane()!, 'pointerenter');
    vi.advanceTimersByTime(1000);
    expect(pane()).not.toBeNull();
  });

  it('Esc fecha sem tirar o foco do gatilho', async () => {
    trigger.focus();
    pointer(trigger, 'pointerenter');
    vi.advanceTimersByTime(500);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await vi.runAllTimersAsync();
    expect(pane()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('clicar no gatilho fecha a dica', async () => {
    pointer(trigger, 'pointerenter');
    vi.advanceTimersByTime(500);
    pointer(trigger, 'pointerdown');
    await vi.runAllTimersAsync();
    expect(pane()).toBeNull();
  });

  it('destruir o gatilho cancela abertura pendente e fecha a dica aberta', () => {
    pointer(trigger, 'pointerenter');
    fixture.destroy();
    vi.advanceTimersByTime(1000);
    expect(pane()).toBeNull();
  });
});
