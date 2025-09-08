 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroUserComponent } from './pages/registro-user/registro-user.component';
import { CursosComponent } from './pages/cursos/cursos.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { PostulacionComponent } from './pages/postulacion/postulacion.component';
import { ValidarCorreoComponent } from './pages/validar-correo/validar-correo.component';
import { CreapasswordComponent } from './pages/creapassword/creapassword.component';
import { ListadoPlantelComponent } from './pages/plantel/listado-plantel/listado-plantel.component';
import { OptionsRegiterComponent } from './pages/options-regiter/options-regiter.component';
import { CreatePasswordAlumnoComponent } from './pages/create-password-alumno/create-password-alumno.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Home',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/home',
            },
          ],
        },
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'logoin',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/login',
            },
          ],
        },
      },
      {
        path: 'select-rol',
        component: OptionsRegiterComponent,
        data: {
          title: 'select-rol',
          breadcrumb: [
            {
              label: 'select-rol',
              path: '/public/select-rol',
            },
          ],
        },
      },
      {
        path: 'proceso',
        component: PostulacionComponent,
        data: {
          title: 'proceso',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/proceso',
            },
          ],
        },
      },

      {
        path: 'registro-user',
        component: RegistroUserComponent,
        data: {
          title: 'registro-user',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/login',
            },
          ],
        },
      },
      {
        path: 'cursos',
        component: CursosComponent,
        data: {
          title: 'cursos',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/login',
            },
          ],
        },
      },
      {
        path: 'planteles',
        component: ListadoPlantelComponent,
        data: {
          title: 'planteles',
          breadcrumb: [
            {
              label: 'planteles',
              path: '/public/planteles',
            },
          ],
        },
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
        data: {
          title: 'acceso denegado',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/login',
            },
          ],
        },
      },
      {
        path: 'validar-correo',
        component: ValidarCorreoComponent,
        data: {
          title: 'acceso denegado',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/login',
            },
          ],
        },
      },
      {
        path: 'crear-password',
        component: CreapasswordComponent,
        data: {
          title: 'acceso docente',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/login',
            },
          ],
        },
      },
      {
        path: 'alumnos-crear-password',
        component: CreatePasswordAlumnoComponent,
        data: {
          title: 'acceso alumno',
          breadcrumb: [
            {
              label: 'Home',
              path: '/public/login',
            },
          ],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
