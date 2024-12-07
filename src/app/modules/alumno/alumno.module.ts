import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnoRoutingModule } from './alumno-routing.module';
import { AlumnoComponent } from './alumno.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AlumnoComponent,
    InicioComponent
  ],
  imports: [
    CommonModule,
    AlumnoRoutingModule,RouterModule
  ]
})
export class AlumnoModule { }
