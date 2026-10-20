import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'components/icon', pathMatch: 'full' },

  { path: 'components/icon', loadComponent: () => import('./components/icon/icon').then((m) => m.IconPage) },
  { path: 'components/select', loadComponent: () => import('./components/select/select').then((m) => m.SelectPage) },
  { path: 'components/snackbar', loadComponent: () => import('./components/snackbar/snackbar').then((m) => m.SnackbarPage) },

  { path: 'foundations', redirectTo: 'foundations/colors', pathMatch: 'full' },
  { path: 'foundations/colors', loadComponent: () => import('./foundations/colors/colors').then((m) => m.Colors) },
  { path: 'foundations/typography', loadComponent: () => import('./foundations/typography/typography').then((m) => m.Typography) },
  { path: 'foundations/units', loadComponent: () => import('./foundations/units/units').then((m) => m.Units) },
  { path: 'foundations/spacing', loadComponent: () => import('./foundations/spacing/spacing').then((m) => m.Spacing) },
  { path: 'foundations/motion', loadComponent: () => import('./foundations/motion/motion').then((m) => m.Motion) },
  { path: 'foundations/layers', loadComponent: () => import('./foundations/layers/layers').then((m) => m.Layers) },

  { path: '**', redirectTo: 'components/icon', pathMatch: 'full' },
];
