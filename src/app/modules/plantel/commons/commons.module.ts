import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListadoCursosComponent } from './views/cursos/listado-cursos/listado-cursos.component';
import { ListadoDocentesComponent } from './views/docentes/listado-docentes/listado-docentes.component';
import { RouterModule } from '@angular/router';
import { ListadoAlumnosComponent } from './views/alumnos/listado-alumnos/listado-alumnos.component';
import { AuthService } from '../../../shared/services/auth.service';
import { DocenteService } from '../../../shared/services/docente.service';
import { CursosdocentesService } from '../../../shared/services/cursosdocentes.service';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { ListadoCursosAprovadosComponent } from './views/cursos/listado-cursos-aprovados/listado-cursos-aprovados.component';
import { HistorialComponent } from './views/cursos/historial/historial.component';
import { RegistroAlumnosComponent } from './views/alumnos/registro-alumnos/registro-alumnos.component';
// import { RegistroDeocen}teComponent } from './views/docentes/registro-deocente/registro-deocente.component';
import { RegistroDocenteComponent } from './views/docentes/registro-docente/registro-docente.component';

// import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ImpartidosComponent } from './views/cursos/impartidos/impartidos.component';

// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HomeComponent } from './views/home/home.component';
import { SolicitudCursoComponent } from './views/cursos/solicitud-curso/solicitud-curso.component';

@NgModule({
  declarations: [    FilterPipe,ListadoAlumnosComponent,ListadoCursosComponent,HomeComponent,ListadoDocentesComponent, ListadoCursosAprovadosComponent, HistorialComponent, RegistroAlumnosComponent, RegistroDocenteComponent, ImpartidosComponent, SolicitudCursoComponent],
  imports: [
    CommonModule,ReactiveFormsModule,FormsModule,RouterModule,
  ],
  providers:[AuthService,DocenteService,CursosdocentesService]
})
export class CommonsModule { }
