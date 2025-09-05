import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidadorDocenteRoutingModule } from './validador-docente-routing.module';
import { ValidadorDocenteComponent } from './validador-docente.component';
import { DocentesComponent } from './pages/docentes/docentes.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { FormsModule } from '@angular/forms';
import { PanelValidadorComponent } from './pages/panel-validador/panel-validador.component';
import { PdfUploaderPreviewComponent } from '../../../../shared/components/pdf-uploader-preview/pdf-uploader-preview.component';


@NgModule({
  declarations: [
    ValidadorDocenteComponent,
    DocentesComponent,
    // PerfilesComponent,
    PanelValidadorComponent,
  ],
  imports: [FormsModule,
    CommonModule,
    ValidadorDocenteRoutingModule,
  ]
})
export class ValidadorDocenteModule { }
