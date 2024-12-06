import { Routes } from '@angular/router';
import { RoleGuard } from './shared/guards/role-guard.guard';
import { AlumnoModule } from './modules/alumno/alumno.module';

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
    path: 'alumno',
    loadChildren: () => import('./modules/alumno/alumno.module').then(m => m.AlumnoModule)
  },
  {
    path: 'docente',
    loadChildren: () => import('./modules/docente/docente.module').then(m => m.DocenteModule)
  },
  {
    path: 'control',
    loadChildren: () => import('./modules/control-escolar/control-escolar.module').then(m => m.ControlEscolarModule)
  },
  {
    path: 'plantel',
    loadChildren: () => import('./modules/plantel/plantel.module').then(m => m.PlantelModule)
  },
  {
    path: 'academico',
    loadChildren: () => import('./modules/coordinador-academico/coordinador-academico.module').then(m => m.CoordinadorAcademicoModule)
  },
  {
    path: 'validador',
    loadChildren: () => import('./modules/validador/validador.module').then(m => m.ValidadorModule)
  },
  {
    path: 'privado',
    loadChildren: () => import('./modules/private/private.module').then(m => m.PrivateModule),
    // canActivate: [RoleGuard], // Aplicamos el RoleGuard a la ruta

    // data: { role: 'ADMIN' } // Rol necesario para acceder a esta ruta (

  }
];
