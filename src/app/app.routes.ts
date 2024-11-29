import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full',
  },
  {
    path: 'public',
    loadChildren: () => import('./modules/public/public-routing.module').then(m => m.PublicRoutingModule)
  }
];
