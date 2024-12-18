import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnoComponent } from './alumno.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ClasesComponent } from './pages/clases/clases.component';
import { CalificacionesComponent } from './pages/calificaciones/calificaciones.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AlumnoComponent,
    children: [
      {
        path: 'inicio',
        component: InicioComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'clases',
        component: ClasesComponent,
      },
      {
        path: 'calificaciones',
        component: CalificacionesComponent,
      },

    ],
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
