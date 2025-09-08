import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnoRoutingModule } from './alumno-routing.module';
import { AlumnoComponent } from './alumno.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ClasesComponent } from './pages/clases/clases.component';
import { CalificacionesComponent } from './pages/calificaciones/calificaciones.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { OfertaEducativaComponent } from './pages/oferta-educativa/oferta-educativa.component';


@NgModule({
  declarations: [
    AlumnoComponent,
    InicioComponent,
    PerfilComponent,
    ClasesComponent,
    CalificacionesComponent,
    OfertaEducativaComponent
  ],
  imports: [FormsModule,
    CommonModule,
    AlumnoRoutingModule,RouterModule
  ]
})
export class AlumnoModule { }
