import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteRoutingModule } from './docente-routing.module';
import { DocenteComponent } from './docente.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DocenteComponent,
    ProfileComponent,
    CoursesComponent,
    StatisticsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    DocenteRoutingModule
  ]
})
export class DocenteModule { }
