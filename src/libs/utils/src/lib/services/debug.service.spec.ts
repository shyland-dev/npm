import { TestBed } from '@angular/core/testing';
import { DebugService } from './debug.service';

describe('DebugService (deprecated)', () => {
  it('mantém o formato [debug] @Componente#metodo', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    class Foo {
      run(service: DebugService) {
        service.log(this, 'x');
      }
    }
    new Foo().run(TestBed.inject(DebugService));
    expect(spy.mock.calls[0]).toEqual(['[debug] @Foo#run', 'x']);
    spy.mockRestore();
  });
});
