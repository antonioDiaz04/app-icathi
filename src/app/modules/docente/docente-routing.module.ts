import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteComponent } from './docente.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { AlumnosCursosComponent } from './pages/alumnos/alumnos-cursos/alumnos-cursos.component';

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
      // {
      // path: 'control-productos',
      // children: [
      // {
      //   path: 'lista-planteles',
      //   component: ListadoPlantelesComponent,
      // },


    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
