import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dev',
    loadChildren: () => import('./features/dev/dev.module').then(m => m.DevModule)
  },
  {
    path: '',
    redirectTo: '/dev',
    pathMatch: 'full'
  }
];
