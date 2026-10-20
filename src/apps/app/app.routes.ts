import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'components/icon', pathMatch: 'full' },

  { path: 'components/button', loadComponent: () => import('./components/button/button').then((m) => m.ButtonPage) },
  { path: 'components/checkbox', loadComponent: () => import('./components/checkbox/checkbox').then((m) => m.CheckboxPage) },
  { path: 'components/form-field', loadComponent: () => import('./components/form-field/form-field').then((m) => m.FormFieldPage) },
  { path: 'components/icon', loadComponent: () => import('./components/icon/icon').then((m) => m.IconPage) },
  { path: 'components/icon-button', loadComponent: () => import('./components/icon-button/icon-button').then((m) => m.IconButtonPage) },
  { path: 'components/input', loadComponent: () => import('./components/input/input').then((m) => m.InputPage) },
  { path: 'components/progress', loadComponent: () => import('./components/progress/progress').then((m) => m.ProgressPage) },
  { path: 'components/radio', loadComponent: () => import('./components/radio/radio').then((m) => m.RadioPage) },
  { path: 'components/select', loadComponent: () => import('./components/select/select').then((m) => m.SelectPage) },
  { path: 'components/skeleton', loadComponent: () => import('./components/skeleton/skeleton').then((m) => m.SkeletonPage) },
  { path: 'components/snackbar', loadComponent: () => import('./components/snackbar/snackbar').then((m) => m.SnackbarPage) },
  { path: 'components/spinner', loadComponent: () => import('./components/spinner/spinner').then((m) => m.SpinnerPage) },
  { path: 'components/switch', loadComponent: () => import('./components/switch/switch').then((m) => m.SwitchPage) },
  { path: 'components/textarea', loadComponent: () => import('./components/textarea/textarea').then((m) => m.TextareaPage) },

  { path: 'foundations', redirectTo: 'foundations/colors', pathMatch: 'full' },
  { path: 'foundations/colors', loadComponent: () => import('./foundations/colors/colors').then((m) => m.Colors) },
  { path: 'foundations/typography', loadComponent: () => import('./foundations/typography/typography').then((m) => m.Typography) },
  { path: 'foundations/units', loadComponent: () => import('./foundations/units/units').then((m) => m.Units) },
  { path: 'foundations/spacing', loadComponent: () => import('./foundations/spacing/spacing').then((m) => m.Spacing) },
  { path: 'foundations/motion', loadComponent: () => import('./foundations/motion/motion').then((m) => m.Motion) },
  { path: 'foundations/layers', loadComponent: () => import('./foundations/layers/layers').then((m) => m.Layers) },

  { path: '**', redirectTo: 'components/icon', pathMatch: 'full' },
];
