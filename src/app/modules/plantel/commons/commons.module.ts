import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListadoCursosComponent } from './views/cursos/listado-cursos/listado-cursos.component';
import { ListadoDocentesComponent } from './views/docentes/listado-docentes/listado-docentes.component';
import { RouterModule } from '@angular/router';
import { ListadoAlumnosComponent } from './views/alumnos/listado-alumnos/listado-alumnos.component';


@NgModule({
  declarations: [ListadoAlumnosComponent,ListadoCursosComponent,ListadoDocentesComponent],
  imports: [
    CommonModule,FormsModule,RouterModule,
  ]
})
export class CommonsModule { }
