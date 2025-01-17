import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { HomeComponent } from './pages/home/home.component';
import { ListadoInstructoresComponent } from './pages/listado-instructores/listado-instructores.component';
import { ListadoInstructoresCursosComponent } from './pages/listado-instructores-cursos/listado-instructores-cursos.component';
import { FormularioInstructorComponent } from './pages/formulario-instructor/formulario-instructor.component';
import { ValidacionDeInstructorComponent } from './pages/validacion-de-instructor/validacion-de-instructor.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ListadoCursosComponent } from './pages/cursos/listado-cursos.component';
import { InstructoresCursosComponent } from './pages/instructores-cursos/instructores-cursos.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ListadoPlantelesComponent } from './pages/planteles/listado-planteles/listado-planteles.component';
import { FrmPlantelComponent } from './pages/planteles/frm-plantel/frm-plantel.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { DocentesComponent } from './pages/docentes/docentes.component';
// <<<<<<< HEAD
import { PdfExampleComponent } from './pages/pdf-example/pdf-example.component';
import { CursoModalidadCAEComponent } from './pages/cursos/typos-cursos/curso-modalidad-cae/curso-modalidad-cae.component';
import { CursoModalidadVirtualComponent } from './pages/cursos/typos-cursos/curso-modalidad-virtual/curso-modalidad-virtual.component';
import { CursoModalidadEscuelaComponent } from './pages/cursos/typos-cursos/curso-modalidad-escuela/curso-modalidad-escuela.component';
// =======
// import { OfertaEducativaComponent } from '../oferta-educativa/oferta-educativa.component';
// >>>>>>> origin/padilla

 
  

@NgModule({
  declarations: [
    PrivateComponent,
    HomeComponent,
    HeaderComponent,CursoModalidadCAEComponent,CursoModalidadVirtualComponent,CursoModalidadEscuelaComponent,
    ListadoInstructoresComponent,
    ListadoInstructoresCursosComponent,
    FormularioInstructorComponent,
    ValidacionDeInstructorComponent,

    ListadoCursosComponent,
    InstructoresCursosComponent,
    ListadoPlantelesComponent,
    FrmPlantelComponent,
    UsuariosComponent,
    DocentesComponent,
    PdfExampleComponent,
    // OfertaEducativaComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,ReactiveFormsModule,RouterModule,
    PrivateRoutingModule,
    FormsModule,
     HttpClientModule,
  ]
})
export class PrivateModule { }
