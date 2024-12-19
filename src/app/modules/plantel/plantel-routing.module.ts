import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantelComponent } from './plantel.component';
import { HomeComponent } from './commons/views/home/home.component';
import { ListadoAlumnosComponent } from './commons/views/alumnos/listado-alumnos/listado-alumnos.component';
import { ListadoCursosComponent } from './commons/views/cursos/listado-cursos/listado-cursos.component';
import { ListadoDocentesComponent } from './commons/views/docentes/listado-docentes/listado-docentes.component';
import { ListadoCursosAprovadosComponent } from './commons/views/cursos/listado-cursos-aprovados/listado-cursos-aprovados.component';
import { HistorialComponent } from './commons/views/cursos/historial/historial.component';
import { RegistroAlumnosComponent } from './commons/views/alumnos/registro-alumnos/registro-alumnos.component';
import { RegistroDocenteComponent } from './commons/views/docentes/registro-docente/registro-docente.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PlantelComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'listado-alumnos',
        component: ListadoAlumnosComponent,
      },
      {
        path: 'registro-alumnos',
        component: RegistroAlumnosComponent,
      },
      {
        path: 'registro-docentes',
        component: RegistroDocenteComponent,
      },
      {
        path: 'historial-cursos',
        component: HistorialComponent,
      },
      {
        path: 'listado-cursos',
        component: ListadoCursosComponent,
      },
      {
        path: 'listado-cursos-solicitados',
        component: ListadoCursosAprovadosComponent,
      },
      {
        path: 'listado-docentes',
        component: ListadoDocentesComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantelRoutingModule { }
