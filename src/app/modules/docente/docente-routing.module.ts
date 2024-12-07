import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteComponent } from './docente.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DocenteComponent,
    children: [
      // {
      // path: 'control-productos',
      // children: [
      // {
      //   path: 'lista-planteles',
      //   component: ListadoPlantelesComponent,
      // },

 
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
