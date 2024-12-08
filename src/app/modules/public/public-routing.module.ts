 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroUserComponent } from './pages/registro-user/registro-user.component';
import { CursosComponent } from './pages/cursos/cursos.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { PostulacionComponent } from './pages/postulacion/postulacion.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
