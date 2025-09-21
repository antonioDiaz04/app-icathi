import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteComponent } from './docente.component';
// import { ProfileComponent } from './pages/profile/profile.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { AlumnosCursosComponent } from './pages/alumnos/alumnos-cursos/alumnos-cursos.component';
// import { CursosComponent } from './pages/cursos/cursos.component';
import { AistenciasComponent } from './pages/aistencias/aistencias.component';
import { CursosDocenteComponent } from './pages/cursos-docente/cursos-docente.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CursosDisponiblesComponent } from './pages/cursos-disponibles/cursos-disponibles.component';
import { SolicitarCursoComponent } from './pages/solicitar-curso/solicitar-curso.component';
import { MisSolicitudesComponent } from './pages/mis-solicitudes/mis-solicitudes.component';
import { DictamenPdfViewerComponent } from '../../shared/components/dictamen-pdf-viewer/dictamen-pdf-viewer.component';
import { ReportePdfViewerComponent } from '../../shared/components/reporte-pdf-viewer/reporte-pdf-viewer.component';
// import { PerfilesComponent } from '../validador/pages/validador-docente/pages/perfiles/perfiles.component';

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
        component: PerfilComponent,
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
        path: 'mis-cursos',
        component: CursosDocenteComponent,
      },
      {
        path: 'asistencias/:id',
        component: AistenciasComponent,
      },
      {
        path: 'cursos-disponibles',
        component: CursosDisponiblesComponent,
      },
      {
        path: 'cursos-solitud',
        component: SolicitarCursoComponent,
      },
      {
        path: 'cursos-solitud/nueva/:idCurso',
        component: SolicitarCursoComponent,
      },
      {
        path: 'mis-solicitudes',
        component: MisSolicitudesComponent,
      },
      {
        path: 'dictamen-validacion/:solicitudId',
        component: DictamenPdfViewerComponent,
        data: { defaultReturn: '/docente/mis-solicitudes' }
      },
      {
        path: 'curso-pdf/:id',
        component: ReportePdfViewerComponent,
          data: { defaultReturn: '/docente/perfil' }

      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
