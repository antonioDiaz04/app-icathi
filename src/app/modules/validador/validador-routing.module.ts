import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidadorComponent } from './validador.component';

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
      },
      {
        path: 'docente',
        loadChildren: () => import('./pages/validador-docente/validador-docente.module').then(m => m.ValidadorDocenteModule),
      },
      {
        path: 'plantel',
        loadChildren: () => import('./pages/validador-plantel/validador-plantel.module').then(m => m.ValidadorPlantelModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidadorRoutingModule {}
