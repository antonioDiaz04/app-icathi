import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfertaEducativaRoutingModule } from './oferta-educativa-routing.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { OfertaEducativaComponent } from './oferta-educativa.component';
import { HeaderComponent } from './component/header/header.component';
import { ListadoCursosComponent } from './views/cursos/listado-cursos.component';
import { CursoModalidadCAEComponent } from './views/cursos/typos-cursos/curso-modalidad-cae/curso-modalidad-cae.component';
import { CursoModalidadEscuelaComponent } from './views/cursos/typos-cursos/curso-modalidad-escuela/curso-modalidad-escuela.component';
import { CursoModalidadVirtualComponent } from './views/cursos/typos-cursos/curso-modalidad-virtual/curso-modalidad-virtual.component';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { TextareaModule } from 'primeng/textarea';
import { PdfExampleComponent } from './views/pdf-example/pdf-example.component';
// import {InputTextareaModule} from 'primeng/inputtextarea';
@NgModule({
  declarations: [PdfExampleComponent,
    HomeComponent,CursoModalidadCAEComponent,CursoModalidadEscuelaComponent,CursoModalidadVirtualComponent,OfertaEducativaComponent, HeaderComponent,ListadoCursosComponent
  ],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterModule,HttpClientModule,
    TextareaModule,
    CommonModule,FormsModule ,ReactiveFormsModule,
    OfertaEducativaRoutingModule
  ]
})
export class OfertaEducativaModule { }
