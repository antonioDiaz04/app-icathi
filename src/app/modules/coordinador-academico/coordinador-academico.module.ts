import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinadorAcademicoRoutingModule } from './coordinador-academico-routing.module';
import { CoordinadorAcademicoComponent } from './coordinador-academico.component';


@NgModule({
  declarations: [
    CoordinadorAcademicoComponent
  ],
  imports: [
    CommonModule,
    CoordinadorAcademicoRoutingModule
  ]
})
export class CoordinadorAcademicoModule { }
