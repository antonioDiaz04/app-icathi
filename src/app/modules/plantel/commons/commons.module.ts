import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListadoCursosComponent } from './views/cursos/listado-cursos/listado-cursos.component';
import { ListadoDocentesComponent } from './views/docentes/listado-docentes/listado-docentes.component';


@NgModule({
  declarations: [ListadoCursosComponent,ListadoDocentesComponent],
  imports: [
    CommonModule,FormsModule
  ]
})
export class CommonsModule { }
