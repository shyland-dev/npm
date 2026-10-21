import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ShyFileRejection } from '../../interfaces/file-dropzone/file-dropzone.interface';
import { FileDropzoneComponent } from './file-dropzone.component';

@Component({
  imports: [FileDropzoneComponent, ReactiveFormsModule],
  template: `<shy-file-dropzone [formControl]="control" label="Documents" accept="image/*,.pdf" [maxSize]="100" [multiple]="multiple" (rejected)="rejected = $event" />`,
})
class Host {
  control = new FormControl<File[]>([], { nonNullable: true });
  multiple = true;
  rejected: ShyFileRejection[] = [];
}

const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

function mount(multiple = true) {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.multiple = multiple;
  document.body.append(fixture.nativeElement);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  const drop = (...files: File[]) => {
    const event = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(event, 'dataTransfer', { value: { files } });
    root.querySelector('.dropzone')!.dispatchEvent(event);
    fixture.detectChanges();
    return event;
  };
  return { fixture, root, host: fixture.componentInstance, drop, input: root.querySelector('input[type="file"]') as HTMLInputElement };
}

async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('FileDropzoneComponent', () => {
  afterEach(() => document.body.querySelectorAll('[ng-version]').forEach((el) => el.remove()));

  it('usa o input file nativo com accept, multiple e nome acessível', async () => {
    const { fixture, input } = mount();
    await settle(fixture);
    expect(input.accept).toBe('image/*,.pdf');
    expect(input.multiple).toBe(true);
    expect(input.getAttribute('aria-label')).toBe('Documents');
  });

  it('soltar arquivos válidos grava no formControl e lista com botão de remover', async () => {
    const { fixture, root, host, drop } = mount();
    await settle(fixture);
    const event = drop(file('a.png', 'image/png'), file('b.pdf', 'application/pdf'));
    expect(event.defaultPrevented).toBe(true);
    expect(host.control.value.map((f) => f.name)).toEqual(['a.png', 'b.pdf']);
    expect(root.querySelectorAll('.files__item').length).toBe(2);
    expect(root.querySelector('[role="status"]')!.textContent).toContain('2 files added');
  });

  it('recusa por tipo e por tamanho, emite (rejected) e anuncia no status', async () => {
    const { fixture, root, host, drop } = mount();
    await settle(fixture);
    drop(file('c.txt', 'text/plain'), file('big.png', 'image/png', 500), file('ok.png', 'image/png'));
    expect(host.control.value.map((f) => f.name)).toEqual(['ok.png']);
    expect(host.rejected.map((r) => [r.file.name, r.reason])).toEqual([
      ['c.txt', 'type'],
      ['big.png', 'size'],
    ]);
    expect(root.querySelector('[role="status"]')!.textContent).toContain('c.txt rejected');
  });

  it('sem multiple, a nova escolha substitui a anterior e mantém só o primeiro arquivo', async () => {
    const { fixture, host, drop } = mount(false);
    await settle(fixture);
    drop(file('a.png', 'image/png'));
    drop(file('b.png', 'image/png'), file('c.png', 'image/png'));
    expect(host.control.value.map((f) => f.name)).toEqual(['b.png']);
  });

  it('remover tira o arquivo do valor; reset do formControl limpa a lista', async () => {
    const { fixture, root, host, drop } = mount();
    await settle(fixture);
    drop(file('a.png', 'image/png'), file('b.png', 'image/png'));
    (root.querySelector('.files__remove') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.control.value.map((f) => f.name)).toEqual(['b.png']);
    expect((root.querySelector('.files__remove') as HTMLButtonElement).getAttribute('aria-label')).toBe('Remove b.png');

    host.control.reset([]);
    await settle(fixture);
    expect(root.querySelectorAll('.files__item').length).toBe(0);
  });

  it('desabilitado ignora o drop e desabilita o input', async () => {
    const { fixture, host, input, drop } = mount();
    host.control.disable();
    await settle(fixture);
    expect(input.disabled).toBe(true);
    drop(file('a.png', 'image/png'));
    expect(host.control.value).toEqual([]);
  });
});
