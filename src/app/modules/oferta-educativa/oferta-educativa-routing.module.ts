import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfertaEducativaComponent } from './oferta-educativa.component';
import { HomeComponent } from './views/home/home.component';
import { ListadoCursosComponent } from './views/cursos/listado-cursos.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'cursos',
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

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfertaEducativaRoutingModule { }
