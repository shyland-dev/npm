import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, DialogComponent, DialogService, FormFieldComponent, InputComponent, OverlayService, SHY_OVERLAY_DATA, ShyDialogSize, ShyOverlayRef } from '@shyland-dev/ui';

/** Conteúdo pequeno que abre num popover ancorado dentro do diálogo (testa a ADR-F4-5). */
@Component({
  selector: 'app-popover-note',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="note">I am a popover opened from inside the dialog: still clickable. <button type="button" (click)="ref.close()">Got it</button></div>`,
  styles: `
    .note {
      max-inline-size: calc(var(--shy-space-32) * 2);
      padding: var(--shy-space-4);
      border: var(--shy-border-width) solid var(--shy-color-border-strong);
      border-radius: var(--shy-radius-md);
      background: var(--shy-color-surface-raised);
      box-shadow: var(--shy-shadow-3);
      font-size: var(--shy-text-sm);
    }
  `,
})
export class PopoverNote {
  protected readonly ref = inject(ShyOverlayRef);
}

export interface DemoDialogData {
  size: ShyDialogSize;
}

@Component({
  selector: 'app-demo-dialog',
  imports: [DialogComponent, ButtonComponent, FormFieldComponent, InputComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <shy-dialog heading="Rename project" [size]="data.size" closeLabel="Close dialog">
      <shy-form-field label="Project name" hint="Shown in the sidebar.">
        <input shyInput [ngModel]="name()" (ngModelChange)="name.set($event)" />
      </shy-form-field>
      <p class="more">This dialog is {{ data.size }}. Esc closes it, the backdrop does not, and Tab stays inside.</p>
      @for (line of filler; track $index) {
        <p class="more">{{ line }}</p>
      }
      <div slot="footer">
        <button shyButton variant="ghost" intent="neutral" type="button" (click)="popover($event)">Popover</button>
        <button shyButton variant="outline" type="button" (click)="nested()">Dialog on dialog</button>
        <button shyButton type="button" (click)="ref.close(name())">Save</button>
      </div>
    </shy-dialog>
  `,
  styles: `
    .more {
      margin-block-start: var(--shy-space-4);
      color: var(--shy-color-text-muted);
    }
  `,
})
export class DemoDialog {
  protected readonly ref = inject<ShyOverlayRef<string>>(ShyOverlayRef);
  protected readonly data = inject<DemoDialogData>(SHY_OVERLAY_DATA);
  private readonly overlay = inject(OverlayService);
  private readonly dialogs = inject(DialogService);
  protected readonly name = signal('Shyland UI');
  protected readonly filler = this.data.size === 'sm' ? [] : Array.from({ length: this.data.size === 'full' ? 12 : 3 }, (_, i) => `Body paragraph ${i + 1}: the body scrolls on its own when the dialog is taller than the screen.`);

  protected popover(event: Event): void {
    const anchor = event.currentTarget as HTMLElement;
    this.overlay.open(PopoverNote, { layer: 'popover', anchor, position: { placement: 'top-start' }, closeOnOutsideClick: true });
  }

  protected nested(): void {
    void this.dialogs.alert({ title: 'Second dialog', message: 'Opened above the first one. Esc closes only this one.' });
  }
}
