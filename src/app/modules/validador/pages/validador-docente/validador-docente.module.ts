import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidadorDocenteRoutingModule } from './validador-docente-routing.module';
import { ValidadorDocenteComponent } from './validador-docente.component';


@NgModule({
  declarations: [
    ValidadorDocenteComponent
  ],
  imports: [
    CommonModule,
    ValidadorDocenteRoutingModule
  ]
})
export class ValidadorDocenteModule { }
