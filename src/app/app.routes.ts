import { Routes } from '@angular/router';
import { RoleGuard } from './shared/guards/role-guard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full',
  },
  {
    path: 'public',
    loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'privado',
    loadChildren: () => import('./modules/private/private.module').then(m => m.PrivateModule),
    // canActivate: [RoleGuard], // Aplicamos el RoleGuard a la ruta

    // data: { role: 'ADMIN' } // Rol necesario para acceder a esta ruta (

  }
];
