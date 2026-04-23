import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  { path: 'icons', loadComponent: () => import('./pages/icons/icons.component').then((m) => m.IconsComponent) },

  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
