import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroUserComponent } from './pages/registro-user/registro-user.component';

import { FormsModule } from '@angular/forms';
import { CursosComponent } from './pages/cursos/cursos.component'; // Importa FormsModule
@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,RegistroUserComponent, CursosComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule,
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
