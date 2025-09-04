import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidadorDocenteComponent } from './validador-docente.component';
// import { DocentesComponent } from './pages/docentes/docentes.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { PanelValidadorComponent } from './pages/panel-validador/panel-validador.component';
import { ValidacionSolicitudComponent } from './pages/validacion-solicitud/validacion-solicitud.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ValidadorDocenteComponent,
    children: [
      {
        path: 'home',
        component: PanelValidadorComponent,
        data: {
          title: 'Home',
          breadcrumb: [
            {
              label: 'Home',
              path: '/validador/home',
            },
          ],
        },
      },
      {
        path: 'perfil/:id',
        component: PerfilesComponent,
        data: {
          title: 'Home',
          breadcrumb: [
            {
              label: 'Home',
              path: '/validador/home',
            },
          ],
        },
      },
      {
        path: 'solicitudes-cursos',
        component: ValidacionSolicitudComponent,
        data: {
          title: 'Home',
          breadcrumb: [
            {
              label: 'Home',
              path: '/validador/home',
            },
          ],
        },
      },



    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidadorDocenteRoutingModule { }



