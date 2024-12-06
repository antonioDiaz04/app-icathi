import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantelComponent } from './plantel.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PlantelComponent,
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
export class PlantelRoutingModule { }
