import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidadorPlantelComponent } from './validador-plantel.component';


const routes: Routes = [
  { path: '', component: ValidadorPlantelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidadorPlantelRoutingModule { }
