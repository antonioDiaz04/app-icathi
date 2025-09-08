import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidadorComponent } from './validador.component';
import { RoleGuard } from '../../shared/guards/role-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: ValidadorComponent,
    children: [
      // {
      //   path: 'alumno',
      //   loadChildren: () => import('./pages/validador-alumno/validador-alumno.module').then(m => m.ValidadorAlumnoModule),
      // },
      {
        path: 'cursos',
        loadChildren: () => import('./pages/validador-cursos/validador-cursos.module').then(m => m.ValidadorCursosModule),
        canActivate: [RoleGuard],
        data: { role: 'VALIDA_CURSO' },
      },
      {
        path: 'docente',
        loadChildren: () => import('./pages/validador-docente/validador-docente.module').then(m => m.ValidadorDocenteModule),
        canActivate: [RoleGuard],
        data: { role: 'VALIDA_DOCENTE' },
      },
      {
        path: 'plantel',
        loadChildren: () => import('./pages/validador-plantel/validador-plantel.module').then(m => m.ValidadorPlantelModule),
        canActivate: [RoleGuard],
        data: { role: 'VALIDA_PLANTEL' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidadorRoutingModule {}
