import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfertaEducativaRoutingModule } from './oferta-educativa-routing.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [RouterModule,
    CommonModule,
    OfertaEducativaRoutingModule
  ]
})
export class OfertaEducativaModule { }
