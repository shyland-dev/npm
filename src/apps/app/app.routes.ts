import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'components/icon', pathMatch: 'full' },

  { path: 'components/alert', loadComponent: () => import('./components/alert/alert').then((m) => m.AlertPage) },
  { path: 'components/badge', loadComponent: () => import('./components/badge/badge').then((m) => m.BadgePage) },
  { path: 'components/button', loadComponent: () => import('./components/button/button').then((m) => m.ButtonPage) },
  { path: 'components/card', loadComponent: () => import('./components/card/card').then((m) => m.CardPage) },
  { path: 'components/checkbox', loadComponent: () => import('./components/checkbox/checkbox').then((m) => m.CheckboxPage) },
  { path: 'components/dialog', loadComponent: () => import('./components/dialog/dialog').then((m) => m.DialogPage) },
  { path: 'components/divider', loadComponent: () => import('./components/divider/divider').then((m) => m.DividerPage) },
  { path: 'components/drawer', loadComponent: () => import('./components/drawer/drawer').then((m) => m.DrawerPage) },
  { path: 'components/menu', loadComponent: () => import('./components/menu/menu').then((m) => m.MenuPage) },
  { path: 'components/popover', loadComponent: () => import('./components/popover/popover').then((m) => m.PopoverPage) },
  { path: 'components/tooltip', loadComponent: () => import('./components/tooltip/tooltip').then((m) => m.TooltipPage) },
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

  { path: 'examples/form', loadComponent: () => import('./examples/form/form').then((m) => m.FormExample) },
  { path: 'examples/overlays', loadComponent: () => import('./examples/overlays/overlays').then((m) => m.OverlaysExample) },

  { path: 'foundations', redirectTo: 'foundations/colors', pathMatch: 'full' },
  { path: 'foundations/colors', loadComponent: () => import('./foundations/colors/colors').then((m) => m.Colors) },
  { path: 'foundations/typography', loadComponent: () => import('./foundations/typography/typography').then((m) => m.Typography) },
  { path: 'foundations/units', loadComponent: () => import('./foundations/units/units').then((m) => m.Units) },
  { path: 'foundations/spacing', loadComponent: () => import('./foundations/spacing/spacing').then((m) => m.Spacing) },
  { path: 'foundations/motion', loadComponent: () => import('./foundations/motion/motion').then((m) => m.Motion) },
  { path: 'foundations/layers', loadComponent: () => import('./foundations/layers/layers').then((m) => m.Layers) },

  { path: '**', redirectTo: 'components/icon', pathMatch: 'full' },
];
