import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { iconCheckCircleFill, iconStar, iconStarFill } from '@shyland-dev/ui/icons';
import { IconComponent } from './icon.component';
import { provideShyIcons } from './icon-registry';

@Component({
  imports: [IconComponent],
  template: `<shy-icon [label]="label()" [name]="name()" [hoverFill]="hoverFill()">{{ content() }}</shy-icon>`,
})
class HostComponent {
  label = signal<string | undefined>(undefined);
  name = signal<string | undefined>(undefined);
  hoverFill = signal(false);
  content = signal('check');
}

async function render() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  await new Promise((resolve) => setTimeout(resolve));
  fixture.detectChanges();
  const el = fixture.nativeElement.querySelector('shy-icon') as HTMLElement;
  return { fixture, host: fixture.componentInstance, el, layers: () => el.querySelectorAll('.icon-layer') };
}

describe('IconComponent', () => {
  it('renderiza o SVG do nome projetado', async () => {
    const { layers } = await render();
    expect(layers()[0].innerHTML).toContain('<svg');
    expect(layers()[0].querySelector('svg')?.classList.contains('bi-check')).toBe(true);
  });

  it('é decorativo por padrão e vira imagem com label', async () => {
    const { fixture, host, el } = await render();
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('role')).toBe(false);

    host.label.set('Favorite');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Favorite');
    expect(el.hasAttribute('aria-hidden')).toBe(false);
  });

  it('o input name tem prioridade sobre o conteúdo projetado', async () => {
    const { fixture, host, layers } = await render();
    host.name.set('x');
    fixture.detectChanges();
    expect(layers()[0].querySelector('svg')?.classList.contains('bi-x')).toBe(true);
  });

  it('acompanha mudança do conteúdo projetado', async () => {
    const { fixture, host, layers } = await render();
    host.content.set('list');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
    expect(layers()[0].querySelector('svg')?.classList.contains('bi-list')).toBe(true);
  });

  it('usa o ícone question-circle quando o nome não existe', async () => {
    const { fixture, host, layers } = await render();
    host.name.set('nao-existe');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(layers()[0].querySelector('svg')?.classList.contains('bi-question-circle')).toBe(true);
  });

  it('hoverFill adiciona a camada -fill e alterna a opacidade no hover', async () => {
    TestBed.configureTestingModule({ providers: [provideShyIcons(iconCheckCircleFill)] });
    const { fixture, host, el, layers } = await render();
    expect(layers().length).toBe(1);

    host.name.set('check-circle');
    host.hoverFill.set(true);
    fixture.detectChanges();
    expect(layers().length).toBe(2);
    expect((layers()[1] as HTMLElement).style.opacity).toBe('0');

    el.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect((layers()[0] as HTMLElement).style.opacity).toBe('0');
    expect((layers()[1] as HTMLElement).style.opacity).toBe('1');

    el.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect((layers()[1] as HTMLElement).style.opacity).toBe('0');
  });

  describe('registro de ícones', () => {
    it('os ícones internos respondem de imediato, sem baixar o catálogo', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { fixture, host, layers } = await render();
      host.name.set('x-lg');
      fixture.detectChanges();
      expect(layers()[0].querySelector('svg')?.classList.contains('bi-x-lg')).toBe(true);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('provideShyIcons registra o ícone (e a variante -fill) sem carregar o catálogo', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      TestBed.configureTestingModule({ providers: [provideShyIcons(iconStar, iconStarFill)] });
      const { fixture, host, layers } = await render();
      host.name.set('star');
      host.hoverFill.set(true);
      fixture.detectChanges();
      expect(layers().length).toBe(2);
      expect(layers()[0].querySelector('svg')?.classList.contains('bi-star')).toBe(true);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('nome não registrado baixa o catálogo sob demanda (com aviso em dev) e então renderiza', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { fixture, host, layers } = await render();
      host.name.set('camera-video');
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(layers()[0].querySelector('svg')?.classList.contains('bi-camera-video')).toBe(true);
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});
