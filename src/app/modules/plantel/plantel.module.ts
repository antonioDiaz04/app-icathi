import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantelRoutingModule } from './plantel-routing.module';
import { PlantelComponent } from './plantel.component';
import { RouterModule } from '@angular/router';
import { CommonsModule } from './commons/commons.module';


@NgModule({
  declarations: [
    PlantelComponent
  ],
  imports: [RouterModule,
    CommonsModule,
    PlantelRoutingModule
  ]
})
export class PlantelModule { }
