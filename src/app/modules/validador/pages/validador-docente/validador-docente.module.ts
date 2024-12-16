import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidadorDocenteRoutingModule } from './validador-docente-routing.module';
import { ValidadorDocenteComponent } from './validador-docente.component';
import { DocentesComponent } from './pages/docentes/docentes.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ValidadorDocenteComponent,
    DocentesComponent,
    PerfilesComponent
  ],
  imports: [FormsModule,
    CommonModule,
    ValidadorDocenteRoutingModule
  ]
})
export class ValidadorDocenteModule { }
