import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidadorDocenteComponent } from './validador-docente.component';

const routes: Routes = [
  { path: '', component: ValidadorDocenteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidadorDocenteRoutingModule { }
