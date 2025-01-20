import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlEscolarComponent } from './control-escolar.component';

@NgModule({
  imports: [
    CommonModule,
    ControlEscolarComponent, // Importar el componente standalone
  ],
})
export class ControlEscolarModule {}
