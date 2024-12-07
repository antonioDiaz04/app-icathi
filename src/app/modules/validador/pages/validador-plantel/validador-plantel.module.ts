import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidadorPlantelRoutingModule } from './validador-plantel-routing.module';
import { ValidadorPlantelComponent } from './validador-plantel.component';


@NgModule({
  declarations: [
    ValidadorPlantelComponent
  ],
  imports: [
    CommonModule,
    ValidadorPlantelRoutingModule
  ]
})
export class ValidadorPlantelModule { }
