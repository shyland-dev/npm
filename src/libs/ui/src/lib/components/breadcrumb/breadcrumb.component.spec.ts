import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BreadcrumbItemComponent } from './breadcrumb-item.component';
import { BreadcrumbComponent } from './breadcrumb.component';

@Component({
  imports: [BreadcrumbComponent, BreadcrumbItemComponent],
  template: `
    <shy-breadcrumb label="Você está em">
      <shy-breadcrumb-item><a href="/">Início</a></shy-breadcrumb-item>
      <shy-breadcrumb-item><a href="/docs">Docs</a></shy-breadcrumb-item>
      <shy-breadcrumb-item current>Breadcrumb</shy-breadcrumb-item>
    </shy-breadcrumb>
    <shy-breadcrumb />
  `,
})
class Host {}

describe('BreadcrumbComponent', () => {
  it('navigation nomeada com lista; só o item atual tem aria-current="page"', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const [named, unnamed] = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('shy-breadcrumb')) as HTMLElement[];
    expect(named.getAttribute('role')).toBe('navigation');
    expect(named.getAttribute('aria-label')).toBe('Você está em');
    expect(unnamed.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(named.querySelector('ol')).not.toBeNull();
    const items = Array.from(named.querySelectorAll('shy-breadcrumb-item'));
    expect(items.map((i) => i.getAttribute('role'))).toEqual(['listitem', 'listitem', 'listitem']);
    expect(named.querySelectorAll('[aria-current]').length).toBe(1);
    expect(items[2].querySelector('[aria-current]')?.getAttribute('aria-current')).toBe('page');
    expect(items[2].hasAttribute('data-current')).toBe(true);
    expect(items[0].querySelector('a')?.getAttribute('href')).toBe('/');
  });
});
