import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DividerComponent } from './divider.component';

@Component({
  imports: [DividerComponent],
  template: `
    <shy-divider />
    <shy-divider>ou</shy-divider>
    <shy-divider orientation="vertical" />
  `,
})
class Host {}

describe('DividerComponent', () => {
  it('role="separator"; só o vertical declara aria-orientation', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const [plain, withText, vertical] = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('shy-divider')) as HTMLElement[];
    for (const el of [plain, withText, vertical]) expect(el.getAttribute('role')).toBe('separator');
    expect(plain.hasAttribute('aria-orientation')).toBe(false);
    expect(vertical.getAttribute('aria-orientation')).toBe('vertical');
    expect(withText.querySelector('.text')?.textContent).toBe('ou');
  });
});
