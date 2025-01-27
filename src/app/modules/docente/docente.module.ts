import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteRoutingModule } from './docente-routing.module';
import { DocenteComponent } from './docente.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { FormsModule } from '@angular/forms';
import { NbThemeModule,NbCardModule, NbSelectModule } from '@nebular/theme';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { AlumnosCursosComponent } from './pages/alumnos/alumnos-cursos/alumnos-cursos.component';
import { CursosComponent } from './pages/cursos/cursos.component';
import { AistenciasComponent } from './pages/aistencias/aistencias.component';
import { CursosDocenteComponent } from './pages/cursos-docente/cursos-docente.component';
import { DrawerModule } from 'primeng/drawer';
import { Breadcrumb } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    DocenteComponent,
    ProfileComponent,
    CoursesComponent,
    StatisticsComponent,
    AlumnosCursosComponent,
    CursosComponent,
    AistenciasComponent,
    CursosDocenteComponent
  ],
  imports: [
    NbThemeModule.forRoot(),DialogModule,
    SafeUrlPipe,
    DrawerModule,
    Breadcrumb,
    FormsModule,
    NbSelectModule,
    NbCardModule,
    CommonModule,
    DocenteRoutingModule
  ]
})
export class DocenteModule { }
