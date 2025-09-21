import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfertaEducativaComponent } from './oferta-educativa.component';
import { HomeComponent } from './views/home/home.component';
import { ListadoCursosComponent } from './views/cursos/listado-cursos.component';
import { ReportePdfViewerComponent } from '../../shared/components/reporte-pdf-viewer/reporte-pdf-viewer.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: OfertaEducativaComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'cursos',
        component: ListadoCursosComponent,
      },
      {
        path: 'reporte/:id',
        component: ReportePdfViewerComponent,
          data: { defaultReturn: '/oferta-educativa' }

      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfertaEducativaRoutingModule { }
