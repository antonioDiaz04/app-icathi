import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfertaEducativaComponent } from './oferta-educativa.component';
import { HomeComponent } from './views/home/home.component';

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

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfertaEducativaRoutingModule { }
