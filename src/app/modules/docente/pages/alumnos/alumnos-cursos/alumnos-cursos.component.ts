import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../shared/services/auth.service';
import { environment } from '../../../../../../environments/environment.prod';
import { runInThisContext } from 'vm';

@Component({
    selector: 'app-alumnos-cursos',
    templateUrl: './alumnos-cursos.component.html',
    styles: [],
    standalone: false
})
export class AlumnosCursosComponent implements OnInit {
  cursos: any[] = []; // Lista de cursos
  students: any[] = []; // Lista de todos los estudiantes
  selectedCourse: string = ''; // ID del curso seleccionado
  selectedCourseName: string = ''; // Nombre del curso seleccionado
  
  isCourseSelectorOpen: boolean = false; // Para controlar el modal del selector de cursos
  isModifyGradeModalOpen: boolean = false; // Para controlar el modal de modificar calificación
  selectedStudent: any = null; // Alumno seleccionado para modificar calificación
  
  filteredStudents: any[] = []; // Ensure it's an empty array by default

  // get filteredStudentsSafe(): any[] {
  //   return this.filteredStudents || [];
  // }
  



  
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarAlumnos(); // Cargar datos al inicializar el componente
  }

  isModifying: boolean = false;
  openCourseSelector(): void {
    this.isCourseSelectorOpen = true;
  }
  
  closeCourseSelector(): void {
    this.isCourseSelectorOpen = false;
  }
  
  openModifyGradeModal(student: any): void {
    this.selectedStudent = { ...student }; // Crear una copia para no afectar datos originales
    this.isModifyGradeModalOpen = true;
  }
  
  closeModifyGradeModal(): void {
    this.isModifyGradeModalOpen = false;
  }
  reloadList(): void {
    this.cargarAlumnos(); // Reutiliza el método existente para recargar los datos
  }
    
  modifyGrade(student: any) {
    this.isModifying = true;
    this.selectedStudent = student;
  }
  hasData: boolean = true;  // Inicialmente se asume que hay datos.

  cargarAlumnos() {
    this.authService.getIdFromToken()
      .then((idDocente) => {
        if (!idDocente) {
          console.error('No hay ID docente');
          return;
        }
        console.log('ID usuario del docente encontrado:', idDocente.toString());
        this.http.get<any>(`${environment.api}/docentes/alumnoANDcursos/${idDocente}`)
          .subscribe(
            (response) => {
              if (Array.isArray(response) && response.length > 0) {
                const data = response[0]; // Accede al primer elemento del array
                this.cursos = data.cursos; // Accede a los cursos
                this.students = data.alumnos; // Accede a los estudiantes

                console.log('Cursos:', this.cursos);
                console.log('Alumnos:', this.students);

                // Verifica si no hay cursos o alumnos
                if ((!this.cursos || this.cursos.length === 0) && (!this.students || this.students.length === 0)) {
                  this.hasData = false;  // No hay datos, se ocultará el selector de cursos
                } else {
                  this.hasData = true;  // Hay datos, se mostrará el selector de cursos
                }

                // Inicializa filteredStudents con todos los estudiantes
                this.filteredStudents = this.students;
              } else {
                console.error('Respuesta inesperada:', response);
                this.hasData = false;  // No hay datos válidos, se ocultará el selector
              }
            },
            (error) => {
              console.error('Error al obtener los datos:', error);
              this.hasData = false;  // Si ocurre un error, se ocultará el selector
            }
          );
      })
      .catch((error) => {
        console.error('Error al obtener el ID del docente:', error);
        this.hasData = false;  // Si hay error en el ID, también se ocultará el selector
      });
  }

  showNotification(type: string, message: string) {
    // Implementa un sistema de notificaciones, como SweetAlert2, Toastr, o Semantic UI
    // Aquí se muestra un ejemplo con un simple console.log
    console.log(`[${type.toUpperCase()}] - ${message}`);
  }

  onCourseChange(event: Event): void {
    const courseId = (event.target as HTMLSelectElement).value;

    // Actualiza el curso seleccionado y filtra los estudiantes basado en el ID del curso
    this.selectedCourse = courseId;

    // Encuentra el nombre del curso seleccionado
    const selectedCourseObj = this.cursos.find(course => course.id == parseInt(courseId, 10));
    this.selectedCourseName = selectedCourseObj ? selectedCourseObj.curso_nombre : '';

    // Filtrar estudiantes que pertenecen al curso seleccionado
    this.filteredStudents = courseId
      ? this.students.filter(student => student.curso_id == parseInt(courseId, 10))
      : this.students; // Muestra todos los estudiantes si no hay curso seleccionado

    console.log('Curso seleccionado:', courseId);
    console.log('Estudiantes filtrados:', this.filteredStudents);
  }

  saveGrade(student: any): void {
    if (student && student.calificacion !== undefined) {
      this.http.put<any>(
        `${environment.api}/plantelesCursos/${student.alumno_id}/cursos/${student.curso_id}`,
        { nuevaCalificacion: student.calificacion }
      ).subscribe(
        (response) => {
          console.log('Calificación guardada:', response);
          // Actualiza la lista de alumnos con la nueva calificación
          const index = this.filteredStudents.findIndex(s => s.alumno_id === student.alumno_id);
          if (index > -1) {
            this.filteredStudents[index].calificacion = student.calificacion;
          }
          this.closeModifyGradeModal();
          this.reloadList()
        },
        (error) => {
          console.error('Error al guardar la calificación:', error);
        }
      );
    }
  }
  
}
