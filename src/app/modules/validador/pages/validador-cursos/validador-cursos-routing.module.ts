import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidadorCursosComponent } from './validador-cursos.component';

const routes: Routes = [
  { path: '', component: ValidadorCursosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidadorCursosRoutingModule { }
