import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlEscolarRoutingModule } from './control-escolar-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ListPlantelComponent } from './pages/list-plantel/list-plantel.component';


@NgModule({
  declarations: [
    InicioComponent,
    ListPlantelComponent
  ],
  imports: [
    CommonModule,
    ControlEscolarRoutingModule
  ]
})
export class ControlEscolarModule { }
