import { TestBed } from '@angular/core/testing';
import { ThemeService } from '../../services/theme/theme.service';
import { ThemeToggleComponent } from './theme-toggle.component';

describe('ThemeToggleComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [ThemeToggleComponent] });
  });

  function render() {
    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();
    const buttons = () => Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('[role="radio"]'));
    return { fixture, buttons, group: fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement };
  }

  it('expõe radiogroup com nome acessível e o modo atual marcado', () => {
    const { buttons, group } = render();

    expect(group.getAttribute('aria-label')).toBe('Theme');
    expect(buttons().map((b) => b.dataset['mode'])).toEqual(['light', 'system', 'dark']);
    expect(buttons().map((b) => b.getAttribute('aria-checked'))).toEqual(['false', 'false', 'true']);
  });

  it('usa roving tabindex', () => {
    const { buttons } = render();
    expect(buttons().map((b) => b.tabIndex)).toEqual([-1, -1, 0]);
  });

  it('clicar muda o modo no ThemeService', () => {
    const { fixture, buttons } = render();

    buttons()[0].click();
    fixture.detectChanges();

    expect(TestBed.inject(ThemeService).mode()).toBe('light');
    expect(buttons()[0].getAttribute('aria-checked')).toBe('true');
  });

  it('setas movem e selecionam, com wrap', () => {
    const { fixture, buttons, group } = render();

    group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(TestBed.inject(ThemeService).mode()).toBe('light');

    group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(TestBed.inject(ThemeService).mode()).toBe('dark');
    expect(buttons()[2].tabIndex).toBe(0);
  });

  it('aceita rótulos traduzidos', () => {
    const { fixture, buttons } = render();
    fixture.componentRef.setInput('labels', { group: 'Tema', light: 'Claro', system: 'Sistema', dark: 'Escuro' });
    fixture.detectChanges();

    expect(buttons().map((b) => b.textContent?.trim())).toEqual(['Claro', 'Sistema', 'Escuro']);
  });
});
