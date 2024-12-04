import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PrivateComponent } from './private.component'
import { HomeComponent } from './pages/home/home.component'
import { RegistroCursoComponent } from './pages/registro-curso/registro-curso.component'
import { ListadoInstructoresComponent } from './pages/listado-instructores/listado-instructores.component'
import { ListadoInstructoresCursosComponent } from './pages/listado-instructores-cursos/listado-instructores-cursos.component'
import { ValidacionDeInstructorComponent } from './pages/validacion-de-instructor/validacion-de-instructor.component'
import { ListadoCursosComponent } from './pages/listado-cursos/listado-cursos.component'
import { ListadoPlantelesComponent } from './pages/planteles/listado-planteles/listado-planteles.component'
import { FrmPlantelComponent } from './pages/planteles/frm-plantel/frm-plantel.component'
import { UsuariosComponent } from './pages/usuarios/usuarios.component'

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
      // {
      // path: 'control-productos',
      // children: [
      {
        path: 'lista-planteles',
        component: ListadoPlantelesComponent,
      },
      {
        path: 'frm-plantel',
        component: FrmPlantelComponent,
      },
      // ]},
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'Registro-curso',
        component: RegistroCursoComponent,
      },
      {
        path: 'listado-cursos',
        component: ListadoCursosComponent,
      },
      {
        path: 'Instructores-cursos',
        component: ListadoCursosComponent,
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
      {
        path: 'listado-usuarios',
        component: UsuariosComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
