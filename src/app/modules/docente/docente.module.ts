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


@NgModule({
  declarations: [
    DocenteComponent,
    ProfileComponent,
    CoursesComponent,
    StatisticsComponent
  ],
  imports: [
    NbThemeModule.forRoot(),
    SafeUrlPipe,

    FormsModule,
    NbSelectModule,
    NbCardModule,
    CommonModule,
    DocenteRoutingModule
  ]
})
export class DocenteModule { }
