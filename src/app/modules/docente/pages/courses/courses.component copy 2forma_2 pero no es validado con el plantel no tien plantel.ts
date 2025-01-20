// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { environment } from '../../../../../environments/environment.prod';
// import { AuthService } from '../../../../shared/services/auth.service';
// import { Router } from '@angular/router';
// import { DocenteService } from '../../../../shared/services/docente.service';
// import { CursosdocentesService } from '../../../../shared/services/cursosdocentes.service';
// import { MenuItem } from 'primeng/api';

// @Component({
//     selector: 'app-courses',
//     templateUrl: './courses.component.html',
//     styleUrls: ['./courses.component.scss'],
//     standalone: false
// })
// export class CoursesComponent implements OnInit{
//   // Datos de los cursos
//   docenteData: any = {}; // Datos del docente
//   courses :any = [];
//   attendancePercentage: number = 85; // Porcentaje de asistencia
//   averageGrade: number = 90; // Promedio de calificaciones
//   constructor(
//     private docenteService: DocenteService,
//     private http: HttpClient,
//     private cursosDocentesService: CursosdocentesService,
//     private authService: AuthService,private router:Router
//   ) {}
//   items: MenuItem[] | undefined;

//     home: MenuItem | undefined;
//   ngOnInit(): void {
//     this.obtenerDatosDocenteYCursos(); // Llamada inicial para obtener datos
//   }
// //   // Método para marcar la asistencia
//   markAttendance(course: any) {

//     // Navegar a la ruta de detalles del curso pasando el id como parámetro
//     this.router.navigate([`/docente/asistencias/${course}`]);
//   }
//   async obtenerDatosDocenteYCursos(): Promise<void> {
//     try {
//       const userId = await this.authService.getIdFromToken(); // Obtener ID desde el token
//       this.docenteService.getDocenteById(Number(userId)).subscribe({
//         next: (docenteResponse) => {
//           this.docenteData =
//             Array.isArray(docenteResponse) && docenteResponse.length > 0
//               ? docenteResponse[0]
//               : docenteResponse;

//           if (this.docenteData?.id) {
//             console.log('ID del docente:', this.docenteData.id);
//             this.obtenerCursosAsignados(this.docenteData.id);
//           } else {
//             console.error("El campo 'id' no está definido en los datos del docente.");
//           }
//         },
//         error: (error) => {
//           console.error('Error al obtener los datos del docente:', error);
//         },
//       });
//     } catch (error) {
//       console.error('Error al obtener ID del token:', error);
//     }
//   }

//   obtenerCursosAsignados(docenteId: number): void {
//     this.cursosDocentesService.obtenerCursosAsignados(Number(docenteId)).subscribe({
//       next: (cursosResponse: any) => {  // Usamos "any" para no restringir el tipo
//         if (Array.isArray(cursosResponse)) {
//           this.courses = cursosResponse;
//           console.log('Cursos asignados:', this.courses);
//         } else {
//           console.error('La respuesta no es un arreglo de cursos:', cursosResponse);
//         }
//       },
//       error: (error) => {
//         console.error('Error al obtener los cursos asignados:', error);
//       }
//     });
  
//   }
// }
