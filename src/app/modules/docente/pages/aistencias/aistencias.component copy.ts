// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { environment } from '../../../../../environments/environment.prod';
// import { ActivatedRoute } from '@angular/router';
// import { CursosService } from '../../../../shared/services/cursos.service';
// import { AlumnosCursosService } from '../../../../shared/services/alumnos-cursos.service';
// import { AsistenciasService } from '../../../../shared/services/asistencias.service';

// interface CURSO {
//   id: number;
//   nombre: string;
//   clave: string;
//   duracion_horas: number;
//   descripcion: string;
//   area_id: number;
//   area_nombre: string;
//   especialidad_id: number;
//   especialidad_nombre: string;
//   tipo_curso_id: number;
//   tipo_curso_nombre: string;
//   vigencia_inicio: string | null;
//   fecha_publicacion: string | null;
//   ultima_actualizacion: string | null;
// }

// @Component({
//   selector: 'app-aistencias',
//   templateUrl: './aistencias.component.html',
//   styles: [],
// })
// export class AistenciasComponent implements OnInit {
//   alumnosConAsistencias: any[] = []; // Almacena los datos obtenidos del API
//   curso_id: string | null = null;
//   loading: boolean = false; // Variable para controlar el estado de carga
//   errorMessage: string = ''; // Variable para el mensaje de error
//   curso: CURSO | null = null; // Curso seleccionado para ver detalles
//   modalVisible: boolean = false;
//   modalEditarVisible: boolean = false;
//   // aistencia_a_modificar: Number = false;
//   alumnoSeleccionado: any = {};
//   // cursoData: any; // Aquí se almacenarán los datos del curso
//   selectedStudent: any;
//   isModifying: boolean = false;

//   constructor(
//     private asistenciasService: AsistenciasService,
//     private cursosService: CursosService,
//     private route: ActivatedRoute,
//     private http: HttpClient, private alumnosCursosService: AlumnosCursosService
//   ) { }

//   ngOnInit(): void {
//     this.getAlumnosConAsistencias(); // Llama a la función que obtiene los datos
//   }

//   // Método para calcular el número de sesiones basado en las horas del curso
//   calcularSesiones(): number {
//     return Math.ceil(this.curso?.duracion_horas! / 2); // Asumimos 2 horas por sesión
//   }

//   // // Método para calcular el porcentaje de asistencia
//   // calcularPorcentajeAsistencia(asistencias: number): number {
//   //   const sesiones = this.calcularSesiones();
//   //   return (asistencias / sesiones) * 100;
//   // }

//   // Método para registrar la asistencia de un alumno


//   // Método para obtener los alumnos con asistencia
//   getAlumnosConAsistencias(): void {
//     this.route.paramMap.subscribe((params) => {
//       this.curso_id = params.get('id');
//       if (this.curso_id) {
//         this.obtenerCursoPorId(Number(this.curso_id)); // Obtener detalles del curso

//         this.loading = true; // Activamos el loading antes de la solicitud
//         const API_URL = `${environment.api}/curso-docente/asistencia/${this.curso_id}`; // Cambia esto por tu endpoint
//         this.http.get(API_URL).subscribe(
//           (data: any) => {
//             this.alumnosConAsistencias = data.data; // Almacenamos los datos obtenidos del API
//             this.loading = false; // Desactivamos el loading una vez recibimos los datos
//             console.log("alumnosConAsistencias", this.alumnosConAsistencias);
//           },
//           (err) => {
//             console.error('Error al obtener datos del API:', err);
//             this.loading = false; // Desactivamos el loading en caso de error
//             this.errorMessage = 'Hubo un error al obtener los datos. Intenta nuevamente.';
//           }
//         );
//       }
//     });
//   }

//   // Método para obtener el curso por ID
//   obtenerCursoPorId(idCurso: number): void {
//     this.cursosService.getCursoById(idCurso).subscribe({
//       next: (data) => {
//         this.curso = data;
//       },
//       error: (err) => {
//         console.error('Error al obtener el curso:', err);
//         this.errorMessage = 'Hubo un error al obtener los detalles del curso.';
//       },
//     });
//   }

//   // Mostrar el modal con los datos del alumno seleccionado
//   mostrarModal(alumno: any): void {
//     this.alumnoSeleccionado = { ...alumno }; // Copia los datos del alumno
//     this.isModifying = true;
//     // this.selectedStudent = student;
//     // this.modalVisible = true;
//   }
//   mostrarModal_Modificar(alumno: any): void {
//     console.log("--",alumno)
//     this.alumnoSeleccionado = { ...alumno }; // Copia los datos del alumno
//     this.modalEditarVisible = true;
//   }
//   modifyGrade(alumno: any) {
//     this.isModifying = true;
//     this.alumnoSeleccionado = { ...alumno }; // Copia los datos del alumno
//   }
//   // Cerrar el modal sin guardar cambios
//   cerrarModal(): void {
//     this.modalVisible = false;
//     this.modalEditarVisible = false;
//     this.alumnoSeleccionado = {};
//   } 

//   // Guardar los cambios en el backend
//   guardarCambios(alumno: any): void {
//     alumno.editable = false; // Desactiva la edición
 

//     console.log("guardar ---",alumno)
//     this.alumnosCursosService.getCursoByAlumnoAndCurso(alumno.alumno_id, Number(this.curso_id))
//       .subscribe({
//         next: (data) => {
//           console.log('Datos del curso --- alumnos:', data);

//           // Construir el payload con los datos del curso y del alumno
//           const payload = {
//             alumno_id: data.alumno_id, // Desde los datos del curso
//             curso_id: data.curso_id,  // Desde los datos del curso
//             plantel_id: data.plantel_id, // Desde los datos del curso
//             fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
//             observaciones: alumno.observaciones, // Desde el formulario del alumno
//             total_asistencias: alumno.asistencia // Desde el formulario del alumno
//           };

//           console.log('Payload para actualizar asistencia:', payload);
//              // Validar campos requeridos
//         if (!this.validarPayload(payload,alumno)) {
//           return; // Detener ejecución si las validaciones fallan
//         }
//           if (alumno.asistencia_id > 0) {
//             this.asistenciasService.update(alumno.asistencia_id, payload).subscribe({
//               next: () => {
//                 console.log('Asistencia actualizada con éxito.');
//                 // this.cerrarModal();
//                 this.getAlumnosConAsistencias()
//                 this.isModifying = false;
//                 this.selectedStudent = null;

//               },
//               error: (error) => {
//                 console.error('Error al actualizar la asistencia:', error);
//               }
//             });
//           } else {
//             this.asistenciasService.create(payload).subscribe({
//               next: () => {
//                 console.log('Asistencia actualizada con éxito.');
//                 this.cerrarModal();
//                 this.getAlumnosConAsistencias()
//               },
//               error: (error) => {
//                 this.getAlumnosConAsistencias()

//                 console.error('Error al actualizar la asistencia:', error);
//               }
//             });
//           }
//           // Llamar al servicio de actualización de asistencia

//         },
//         error: (error) => {
//           console.error('Error al obtener los datos del curso:', error);
//         }
//       });

//     console.log('Datos del alumno:', JSON.stringify(alumno));
//   }






//   actualizarAsistencia(alumno: any) {
//     this.alumnosCursosService.getCursoByAlumnoAndCurso(alumno.alumno_id, Number(this.curso_id))
//       .subscribe({
//         next: (data) => {
//           console.log('Datos del curso --- alumnos:', data);

//           // Construir el payload con los datos del curso y del alumno
//           const payload = {
//             alumno_id: data.alumno_id, // Desde los datos del curso
//             curso_id: data.curso_id,  // Desde los datos del curso
//             plantel_id: data.plantel_id, // Desde los datos del curso
//             fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
//             observaciones: alumno.observaciones, // Desde el formulario del alumno
//             total_asistencias: alumno.asistencia // Desde el formulario del alumno
//           };

//           console.log('Payload para actualizar asistencia:', payload);
//    // Validar campos requeridos
//    if (!this.validarPayload(payload,alumno)) {
//     return; // Detener ejecución si las validaciones fallan
//   }
//           // Llamar al servicio de actualización de asistencia
//           this.asistenciasService.update(alumno.asistencia_id, payload).subscribe({
//             next: () => {
//               console.log('Asistencia actualizada con éxito.');
//               this.cerrarModal();
//               this.getAlumnosConAsistencias()

//             },
//             error: (error) => {
//               console.error('Error al actualizar la asistencia:', error);
//             }
//           });
//         },
//         error: (error) => {
//           console.error('Error al obtener los datos del curso:', error);
//         }
//       });

//     console.log('Datos del alumno:', JSON.stringify(alumno));    // Aquí puedes validar y procesar el número de asistencias
//   }

//   calcularPorcentajeAsistencia(alumno: any): number {
//     if (!alumno.totalClases || alumno.totalClases === 0) {
//       return 0;
//     }
//     // Lógica para calcular el porcentaje basado en el número de asistencias
//     return Math.round((alumno.numeroAsistencias / alumno.totalClases) * 100);
//   }


//   cancelarCambios(alumno: any) {
//     this.cerrarModal();

//     console.log(`Cancelando cambios para ${alumno.alumno_nombre}`);
//     // Restaurar los datos si es necesario
//   }
//   private validarPayload(payload: any,alumno: any): boolean {

//     // const camposRequeridos = ['alumno_id', 'curso_id', 'plantel_id', 'fecha', 'total_asistencias'];
//     const camposRequeridos = [ 'total_asistencias'];
  
//     for (const campo of camposRequeridos) {
//       if (payload[campo] === null || payload[campo] === undefined) {    alumno.editable = false; // Desactiva la edición
//     this.isModifying = false;

//         alert(`El campo "${campo}" no puede estar vacío.`);
//         return false;
//       }
//     }
  
//     // Validar total_asistencias > 0
//     if (payload.total_asistencias <= 0) {

//       alert('El campo "total_asistencias" debe ser mayor a 0.');
//       return false;
//     }
  
//     return true;
//   }

//   // actualizarAsistencia(alumno: any) {
//   //     console.log(`Número de asistencias actualizado para ${alumno.alumno_nombre}: ${alumno.numeroAsistencias}`);
//   //     // Aquí puedes validar y procesar el número de asistencias
//   //   }
// }
