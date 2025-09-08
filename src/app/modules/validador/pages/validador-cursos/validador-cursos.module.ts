import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ValidadorCursosRoutingModule } from './validador-cursos-routing.module';
import { ValidadorCursosComponent } from './validador-cursos.component';


@NgModule({
  declarations: [
    ValidadorCursosComponent
  ],
  imports: [
    CommonModule,
    ValidadorCursosRoutingModule,
    FormsModule
    
  ]
})
export class ValidadorCursosModule { }
