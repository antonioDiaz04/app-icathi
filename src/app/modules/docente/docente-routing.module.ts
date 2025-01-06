import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteComponent } from './docente.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { AlumnosCursosComponent } from './pages/alumnos/alumnos-cursos/alumnos-cursos.component';
import { CursosComponent } from './pages/cursos/cursos.component';
import { AistenciasComponent } from './pages/aistencias/aistencias.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DocenteComponent,
    children: [
      {
        path: 'perfil',
        component: ProfileComponent,
      },
      {
        path: 'home',
        component: CoursesComponent,
      },
      {
        path: 'alumnos-cursos',
        component: AlumnosCursosComponent,
      },
      {
        path: 'asistencias/:id',
        component: AistenciasComponent,
      },

    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
