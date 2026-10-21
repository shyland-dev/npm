import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

@Component({
  imports: [AvatarComponent],
  template: `
    <shy-avatar [src]="src()" name="Ana Maria Souza" />
    <shy-avatar name="ana" label="Ana, administradora" size="lg" shape="rounded" />
    <shy-avatar />
    <shy-avatar name="  " />
  `,
})
class Host {
  readonly src = signal<string | undefined>('/ana.jpg');
}

describe('AvatarComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const avatars = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('shy-avatar')) as HTMLElement[];
    return { fixture, host: fixture.componentInstance, avatars };
  }

  it('mostra a imagem (decorativa) e dá o nome acessível ao host', () => {
    const { avatars } = render();
    const img = avatars[0].querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('alt')).toBe('');
    expect(avatars[0].getAttribute('role')).toBe('img');
    expect(avatars[0].getAttribute('aria-label')).toBe('Ana Maria Souza');
  });

  it('se a imagem falhar mostra as iniciais (primeira e última palavra) e volta a tentar quando o src muda', () => {
    const { fixture, host, avatars } = render();
    avatars[0].querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(avatars[0].querySelector('img')).toBeNull();
    expect(avatars[0].querySelector('.initials')?.textContent?.trim()).toBe('AS');
    host.src.set('/outra.jpg');
    fixture.detectChanges();
    expect(avatars[0].querySelector('img')).not.toBeNull();
  });

  it('label sobrescreve o nome acessível; tamanho e forma vão para data-*', () => {
    const { avatars } = render();
    expect(avatars[1].getAttribute('aria-label')).toBe('Ana, administradora');
    expect(avatars[1].dataset['size']).toBe('lg');
    expect(avatars[1].dataset['shape']).toBe('rounded');
    expect(avatars[1].querySelector('.initials')?.textContent?.trim()).toBe('A');
    expect(avatars[0].dataset['size']).toBe('md');
  });

  it('sem nome nem label é decorativo e mostra o ícone', () => {
    const { avatars } = render();
    for (const avatar of [avatars[2], avatars[3]]) {
      expect(avatar.getAttribute('aria-hidden')).toBe('true');
      expect(avatar.hasAttribute('role')).toBe(false);
      expect(avatar.querySelector('shy-icon')).not.toBeNull();
    }
  });
});
