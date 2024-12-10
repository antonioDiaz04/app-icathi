import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidadorDocenteRoutingModule } from './validador-docente-routing.module';
import { ValidadorDocenteComponent } from './validador-docente.component';
import { DocentesComponent } from './pages/docentes/docentes.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';


@NgModule({
  declarations: [
    ValidadorDocenteComponent,
    DocentesComponent,
    PerfilesComponent
  ],
  imports: [
    CommonModule,
    ValidadorDocenteRoutingModule
  ]
})
export class ValidadorDocenteModule { }
