import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroCursoComponent } from './pages/registro-curso/registro-curso.component';
import { ListadoInstructoresComponent } from './pages/listado-instructores/listado-instructores.component';
import { ListadoInstructoresCursosComponent } from './pages/listado-instructores-cursos/listado-instructores-cursos.component';
import { ValidacionDeInstructorComponent } from './pages/validacion-de-instructor/validacion-de-instructor.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'Registro-curso',
        component: RegistroCursoComponent,
      },
      {
        path: 'Listado-instructores',
        component: ListadoInstructoresComponent,
      },
      {
        path: 'Listado-instructores-cursos',
        component: ListadoInstructoresCursosComponent,
      },
      {
        path: 'valida-instructor',
        component: ValidacionDeInstructorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
