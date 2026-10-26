import { DragEnd, trackDrag } from './drag';

function pointer(type: string, x: number, y: number, time: number, pointerType = 'touch'): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true }, pointerType: { value: pointerType }, clientX: { value: x }, clientY: { value: y }, timeStamp: { value: time } });
  return event;
}

describe('trackDrag', () => {
  let el: HTMLElement;
  let moves: number[];
  let ends: DragEnd[];
  let starts: number;

  const track = (sign: 1 | -1 | 0, extra: Partial<Parameters<typeof trackDrag>[1]> = {}) => trackDrag(el, { axis: 'x', sign, onStart: () => starts++, onMove: (o) => moves.push(o), onEnd: (e) => ends.push(e), ...extra });

  beforeEach(() => {
    el = document.createElement('div');
    Object.defineProperty(el, 'offsetWidth', { value: 200 });
    document.body.append(el);
    moves = [];
    ends = [];
    starts = 0;
  });

  afterEach(() => el.remove());

  it('só vira arrasto depois do limiar e informa deslocamento, tamanho e velocidade', () => {
    track(0);
    el.dispatchEvent(pointer('pointerdown', 100, 0, 0));
    el.dispatchEvent(pointer('pointermove', 105, 0, 20));
    expect(starts).toBe(0);
    el.dispatchEvent(pointer('pointermove', 140, 2, 40));
    el.dispatchEvent(pointer('pointermove', 180, 2, 60));
    el.dispatchEvent(pointer('pointerup', 180, 2, 60));

    expect(starts).toBe(1);
    expect(moves).toEqual([40, 80]);
    expect(ends).toHaveLength(1);
    expect(ends[0]).toMatchObject({ offset: 80, size: 200, cancelled: false });
    expect(ends[0].velocity).toBeCloseTo(2, 1);
  });

  it('sign restringe o sentido: contra o sentido permitido nada acontece', () => {
    track(1);
    el.dispatchEvent(pointer('pointerdown', 100, 0, 0));
    el.dispatchEvent(pointer('pointermove', 40, 0, 30));
    el.dispatchEvent(pointer('pointerup', 40, 0, 40));
    expect(starts).toBe(0);
    expect(ends).toEqual([]);

    el.dispatchEvent(pointer('pointerdown', 100, 0, 100));
    el.dispatchEvent(pointer('pointermove', 160, 0, 130));
    el.dispatchEvent(pointer('pointerup', 160, 0, 140));
    expect(moves).toEqual([60]);
  });

  it('movimento no outro eixo abandona o gesto (o scroll nativo segue)', () => {
    track(0);
    el.dispatchEvent(pointer('pointerdown', 100, 100, 0));
    el.dispatchEvent(pointer('pointermove', 102, 140, 30));
    el.dispatchEvent(pointer('pointermove', 160, 150, 60));
    el.dispatchEvent(pointer('pointerup', 160, 150, 70));
    expect(starts).toBe(0);
    expect(ends).toEqual([]);
  });

  it('mouse é ignorado por padrão; pointercancel termina como cancelled', () => {
    track(0);
    el.dispatchEvent(pointer('pointerdown', 100, 0, 0, 'mouse'));
    el.dispatchEvent(pointer('pointermove', 180, 0, 30, 'mouse'));
    expect(starts).toBe(0);

    el.dispatchEvent(pointer('pointerdown', 100, 0, 100));
    el.dispatchEvent(pointer('pointermove', 160, 0, 130));
    el.dispatchEvent(pointer('pointercancel', 160, 0, 140));
    expect(ends[0].cancelled).toBe(true);
  });

  it('canStart filtra o alvo e a função devolvida remove os ouvintes', () => {
    const stop = track(0, { canStart: () => false });
    el.dispatchEvent(pointer('pointerdown', 100, 0, 0));
    el.dispatchEvent(pointer('pointermove', 180, 0, 30));
    expect(starts).toBe(0);
    stop();

    track(0);
    el.dispatchEvent(pointer('pointerdown', 100, 0, 0));
    el.dispatchEvent(pointer('pointermove', 180, 0, 30));
    expect(starts).toBe(1);
  });

  it('o clique logo após um arrasto é engolido', async () => {
    track(0);
    const onClick = vi.fn();
    el.addEventListener('click', onClick);
    el.dispatchEvent(pointer('pointerdown', 100, 0, 0));
    el.dispatchEvent(pointer('pointermove', 180, 0, 30));
    el.dispatchEvent(pointer('pointerup', 180, 0, 40));
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
