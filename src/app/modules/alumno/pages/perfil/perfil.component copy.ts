// import { Component } from '@angular/core';
// import { AuthService } from '../../../../shared/services/auth.service';
// import { Router } from 'express';
// import { AspiranteService } from '../../../../shared/services/aspirante.service';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-perfil',
//   templateUrl: './perfil.component.html',
//   styleUrls: ['./perfil.component.scss']
// })
// export class PerfilComponent {
//   // Datos del docente
//   // docenteData = {
//   //   nombre: 'Juan Pérez',
//   //   email: 'juan.perez@example.com',
//   //   telefono: '123-456-7890'
//   // };
//   is_usuario_alumno: number | null = null; // ID del alumno a cargar
//   alumnoData: any = null; // Datos del alumno cargados

//   constructor(

//         private authService: AuthService,
//        private router: Router,
    
//     private aspiranteService: AspiranteService, // Inyectar el servicio AspiranteService
//     private route: ActivatedRoute // Inyectar el ActivatedRoute para obtener el ID desde la URL
//   ) {}


//   ngOnInit(): void {
//     this.loadUserDetails();


//   }
  
//   private async loadUserDetails(): Promise<void> {
//     try {
//       // Verificar autenticación
//       // this.isAuthenticated = await this.authService.isAuthenticated();

//       // if (this.isAuthenticated) {
//         // Obtener el ID del token
//         this.is_usuario_alumno = await this.authService.getIdFromToken();
//         console.log('ID del usuario:', this.is_usuario_alumno);

//         // Obtener los datos del docente
//         if (this.is_usuario_alumno !== null) {
//           this.getAlumnoDetails(this.is_usuario_alumno);
//         }
//       // } else {
//       //   console.warn('Usuario no autenticado');
//       // }
//     } catch (error) {
//       console.error('Error al cargar los detalles del usuario:', error);
//     }
//   }
  
//   getAlumnoDetails(id: number): void {
//     // this.aspiranteService.getAlumnoById_user(id).subscribe({
//     //   next: (data) => {
//     //     this.alumnoData = data[0]; // Asignar el primer (y único) alumnoData que devuelve el array
//     //     console.log(this.alumnoData);
//     //   },
//     //   error: (err) => {
//     //     console.error('Error al obtener los datos del alumno', err);
//     //   }
//     // });
//   }
//   // Método para enviar los datos
//   onSubmit() {
//     alert('Datos guardados correctamente');
//     // Aquí iría la lógica para enviar los datos a un servicio o API
//   }

//   // Método para cancelar la edición
//   cancelar() {
//     alert('Edición cancelada');
//     // Aquí podrías resetear el formulario o manejar la cancelación de forma adecuada
//   }

//   // Método para habilitar la edición (podrías agregar más lógica aquí si lo necesitas)
//   editar() {
//     alert('Editando información');
//     // Aquí habilitarías el formulario o podrías hacer otras acciones
//   }
// }
