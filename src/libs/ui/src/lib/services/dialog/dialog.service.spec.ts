import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { OverlayService } from '../../overlay/overlay.service';
import { DialogService } from './dialog.service';

@Component({ imports: [DialogComponent], template: `<shy-dialog heading="Título">corpo</shy-dialog>` })
class Content {}

describe('DialogService: presentation', () => {
  afterEach(async () => {
    await TestBed.inject(OverlayService).closeAll(false);
    document.documentElement.removeAttribute('data-shy-scroll-lock');
  });

  const paneOf = (presentation?: 'center' | 'sheet' | 'auto', paneClass?: string) => TestBed.inject(DialogService).open(Content, { presentation, paneClass }).pane;

  it('center (padrão) não adiciona classe; sheet e auto sim, sem perder paneClass', () => {
    expect(paneOf().className).not.toContain('shy-dialog-pane');
    expect(paneOf('center').className).not.toContain('shy-dialog-pane');
    expect(paneOf('sheet').classList.contains('shy-dialog-pane--sheet')).toBe(true);
    const auto = paneOf('auto', 'minha-classe');
    expect(auto.classList.contains('shy-dialog-pane--auto')).toBe(true);
    expect(auto.classList.contains('minha-classe')).toBe(true);
  });
});
