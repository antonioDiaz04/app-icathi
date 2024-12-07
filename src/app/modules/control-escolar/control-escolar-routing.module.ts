import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlEscolarComponent } from './control-escolar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ControlEscolarComponent,
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
export class ControlEscolarRoutingModule { }
