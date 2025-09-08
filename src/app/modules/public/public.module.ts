import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroUserComponent } from './pages/registro-user/registro-user.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CursosComponent } from './pages/cursos/cursos.component'; // Importa FormsModule


import { SidebarModule } from 'primeng/sidebar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { TeacherApplicationComponent } from './components/teacher-application/teacher-application.component';
import { PostulacionComponent } from './pages/postulacion/postulacion.component';
import { ValidarCorreoComponent } from './pages/validar-correo/validar-correo.component';
import { CreapasswordComponent } from './pages/creapassword/creapassword.component';
import { OptionsRegiterComponent } from './pages/options-regiter/options-regiter.component';
import { CreatePasswordAlumnoComponent } from './pages/create-password-alumno/create-password-alumno.component';

import { DrawerModule } from 'primeng/drawer';


@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,RegistroUserComponent, CursosComponent, UnauthorizedComponent, TeacherApplicationComponent, PostulacionComponent, ValidarCorreoComponent, CreapasswordComponent, OptionsRegiterComponent, CreatePasswordAlumnoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [DrawerModule,FormsModule,SidebarModule,
    CommonModule,ReactiveFormsModule,
    PublicRoutingModule
// BrowserAnimationsModule,

  ]
})
export class PublicModule { }
