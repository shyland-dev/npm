import { computePosition } from './position';

const viewport = { x: 0, y: 0, width: 400, height: 300 };
const size = { width: 100, height: 60 };
const rect = (x: number, y: number, width = 80, height = 30) => ({ x, y, width, height });

describe('computePosition', () => {
  it('bottom-start: abaixo da âncora, alinhado ao início', () => {
    const r = computePosition(rect(50, 50), size, viewport, { placement: 'bottom-start', offset: 4 });
    expect(r).toEqual({ x: 50, y: 84, placement: 'bottom-start' });
  });

  it('bottom-end alinha o fim; top-start fica acima', () => {
    expect(computePosition(rect(150, 50), size, viewport, { placement: 'bottom-end' })).toMatchObject({ x: 130, y: 80 });
    expect(computePosition(rect(50, 150), size, viewport, { placement: 'top-start', offset: 10 })).toMatchObject({ x: 50, y: 80 });
  });

  it('sem alinhamento centraliza no eixo cruzado', () => {
    expect(computePosition(rect(100, 50), size, viewport, { placement: 'bottom' })).toMatchObject({ x: 90, y: 80, placement: 'bottom' });
  });

  it('start/end seguem a direção do texto', () => {
    const anchor = rect(200, 100);
    expect(computePosition(anchor, size, viewport, { placement: 'start' })).toMatchObject({ x: 100, y: 85 });
    expect(computePosition(anchor, size, viewport, { placement: 'start', rtl: true })).toMatchObject({ x: 280, y: 85 });
    expect(computePosition(anchor, size, viewport, { placement: 'end' })).toMatchObject({ x: 280 });
  });

  it('bottom-start em RTL alinha à direita da âncora', () => {
    expect(computePosition(rect(150, 50), size, viewport, { placement: 'bottom-start', rtl: true })).toMatchObject({ x: 130 });
  });

  it('flip: troca de lado quando não cabe e o oposto cabe', () => {
    const r = computePosition(rect(50, 250), size, viewport, { placement: 'bottom-start', offset: 4 });
    expect(r.placement).toBe('top-start');
    expect(r.y).toBe(250 - 4 - 60);
  });

  it('flip desligado mantém o lado mesmo transbordando', () => {
    const r = computePosition(rect(50, 250), size, viewport, { placement: 'bottom-start', flip: false });
    expect(r.placement).toBe('bottom-start');
    expect(r.y).toBe(280);
  });

  it('flip: se nenhum lado cabe, fica onde transborda menos', () => {
    const r = computePosition(rect(50, 130, 80, 30), { width: 100, height: 200 }, viewport, { placement: 'bottom-start' });
    // em cima o painel passaria 70 da borda (topo em -70); embaixo, 60 (termina em 360): fica embaixo
    expect(r.placement).toBe('bottom-start');
  });

  it('shift: desliza no eixo cruzado para caber, respeitando o padding', () => {
    expect(computePosition(rect(350, 50), size, viewport, { placement: 'bottom-start', padding: 8 }).x).toBe(292);
    expect(computePosition(rect(-20, 50), size, viewport, { placement: 'bottom-start', padding: 8 }).x).toBe(8);
  });

  it('shift desligado não corrige', () => {
    expect(computePosition(rect(350, 50), size, viewport, { placement: 'bottom-start', shift: false }).x).toBe(350);
  });

  it('shift vertical em start/end', () => {
    expect(computePosition(rect(200, 280), size, viewport, { placement: 'end-start', padding: 0 }).y).toBe(240);
  });

  it('matchWidth usa a largura da âncora (só em top/bottom)', () => {
    const r = computePosition(rect(50, 50, 200), size, viewport, { placement: 'bottom-start', matchWidth: true });
    expect(r.width).toBe(200);
    // em start/end a largura do painel não muda
    expect(computePosition(rect(50, 50, 200), size, viewport, { placement: 'end', matchWidth: true }).width).toBe(100);
  });

  it('viewport com origem deslocada (visualViewport com zoom)', () => {
    const r = computePosition(rect(120, 120), size, { x: 100, y: 100, width: 100, height: 100 }, { placement: 'bottom-start' });
    expect(r.x).toBeGreaterThanOrEqual(100);
    expect(r.x + size.width).toBeLessThanOrEqual(200);
  });
});
