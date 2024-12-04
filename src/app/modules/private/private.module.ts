import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroCursoComponent } from './pages/registro-curso/registro-curso.component';
import { ListadoInstructoresComponent } from './pages/listado-instructores/listado-instructores.component';
import { ListadoInstructoresCursosComponent } from './pages/listado-instructores-cursos/listado-instructores-cursos.component';
import { FormularioInstructorComponent } from './pages/formulario-instructor/formulario-instructor.component';
import { ValidacionDeInstructorComponent } from './pages/validacion-de-instructor/validacion-de-instructor.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ListadoCursosComponent } from './pages/listado-cursos/listado-cursos.component';
import { InstructoresCursosComponent } from './pages/instructores-cursos/instructores-cursos.component';
import { ListadoPlantelesComponent } from './pages/planteles/listado-planteles/listado-planteles.component';
import { FrmPlantelComponent } from './pages/planteles/frm-plantel/frm-plantel.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { FormsModule } from '@angular/forms'; // Importar FormsModule


@NgModule({
  declarations: [
    PrivateComponent,
    HomeComponent,
    HeaderComponent,
    RegistroCursoComponent,
    ListadoInstructoresComponent,
    ListadoInstructoresCursosComponent,
    FormularioInstructorComponent,
    ValidacionDeInstructorComponent,

    ListadoCursosComponent,
    InstructoresCursosComponent,
    ListadoPlantelesComponent,
    FrmPlantelComponent,
    UsuariosComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    CommonModule,RouterModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
