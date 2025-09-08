import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';

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
  ],  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class PlantelModule { }
