import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidadorRoutingModule } from './validador-routing.module';
import { ValidadorComponent } from './validador.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ValidadorComponent
  ],
  imports: [
    CommonModule,RouterModule,
    ValidadorRoutingModule
  ]
})
export class ValidadorModule { }
