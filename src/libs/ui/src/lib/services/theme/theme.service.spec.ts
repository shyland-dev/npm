import { TestBed } from '@angular/core/testing';
import { provideShyTheme, ThemeService } from './theme.service';

type Listener = (event: { matches: boolean }) => void;

function mockMatchMedia(light: boolean) {
  const listeners: Listener[] = [];
  const mql = {
    matches: light,
    addEventListener: (_: string, fn: Listener) => listeners.push(fn),
    removeEventListener: () => undefined,
  };
  vi.stubGlobal('matchMedia', () => mql);
  window.matchMedia = (() => mql) as unknown as typeof window.matchMedia;
  return {
    emit: (matches: boolean) => {
      mql.matches = matches;
      listeners.forEach((fn) => fn({ matches }));
    },
  };
}

function create(config?: Parameters<typeof provideShyTheme>[0]): ThemeService {
  TestBed.resetTestingModule();
  if (config) TestBed.configureTestingModule({ providers: [provideShyTheme(config)] });
  return TestBed.inject(ThemeService);
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');
    mockMatchMedia(false);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('usa escuro por padrão e grava os atributos no html', () => {
    const service = create();

    expect(service.mode()).toBe('dark');
    expect(service.resolved()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('dark');
  });

  it('persiste a escolha e a restaura', () => {
    create().setMode('light');

    const next = create();
    expect(next.mode()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('ignora valor inválido salvo', () => {
    localStorage.setItem('shy-theme', 'azul');
    expect(create().mode()).toBe('dark');
  });

  it('respeita defaultMode e storageKey configurados', () => {
    const service = create({ defaultMode: 'light', storageKey: 'meu-tema' });
    expect(service.mode()).toBe('light');

    service.setMode('dark');
    expect(localStorage.getItem('meu-tema')).toBe('dark');
  });

  it('system segue o sistema e reage a mudanças', () => {
    const media = mockMatchMedia(true);
    const service = create();

    service.setMode('system');
    expect(service.mode()).toBe('system');
    expect(service.resolved()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('system');

    media.emit(false);
    expect(service.resolved()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggle alterna entre claro e escuro', () => {
    const service = create();

    service.toggle();
    expect(service.resolved()).toBe('light');
    service.toggle();
    expect(service.resolved()).toBe('dark');
  });

  it('continua funcionando se o localStorage lançar erro', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });

    const service = create();
    expect(() => service.setMode('light')).not.toThrow();
    expect(service.resolved()).toBe('light');
    vi.restoreAllMocks();
  });
});
