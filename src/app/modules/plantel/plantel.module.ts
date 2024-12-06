import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantelRoutingModule } from './plantel-routing.module';
import { PlantelComponent } from './plantel.component';


@NgModule({
  declarations: [
    PlantelComponent
  ],
  imports: [
    CommonModule,
    PlantelRoutingModule
  ]
})
export class PlantelModule { }
