import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'icons', loadComponent: () => import('./pages/icons/icons').then((m) => m.Icons) },

  { path: 'foundations', redirectTo: 'foundations/colors', pathMatch: 'full' },
  { path: 'foundations/colors', loadComponent: () => import('./foundations/colors/colors').then((m) => m.Colors) },
  { path: 'foundations/typography', loadComponent: () => import('./foundations/typography/typography').then((m) => m.Typography) },
  { path: 'foundations/units', loadComponent: () => import('./foundations/units/units').then((m) => m.Units) },
  { path: 'foundations/spacing', loadComponent: () => import('./foundations/spacing/spacing').then((m) => m.Spacing) },
  { path: 'foundations/motion', loadComponent: () => import('./foundations/motion/motion').then((m) => m.Motion) },
  { path: 'foundations/layers', loadComponent: () => import('./foundations/layers/layers').then((m) => m.Layers) },

  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
