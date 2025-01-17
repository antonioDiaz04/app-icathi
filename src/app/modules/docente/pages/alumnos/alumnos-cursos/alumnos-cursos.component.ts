import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../shared/services/auth.service';

@Component({
    selector: 'app-alumnos-cursos',
    templateUrl: './alumnos-cursos.component.html',
    styles: [],
    standalone: false
})
export class AlumnosCursosComponent implements OnInit {
  cursos: any[] = []; // Lista de cursos
  students: any[] = []; // Lista de todos los estudiantes
  filteredStudents: any[] = []; // Lista de estudiantes filtrados por curso
  selectedCourse: string = ''; // ID del curso seleccionado
  selectedCourseName: string = ''; // Nombre del curso seleccionado

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarAlumnos(); // Cargar datos al inicializar el componente
  }

  isModifying: boolean = false;
  selectedStudent: any;

  modifyGrade(student: any) {
    this.isModifying = true;
    this.selectedStudent = student;
  }

  cargarAlumnos() {
    this.authService.getIdFromToken()
      .then((idDocente) => {
        if (!idDocente) {
          console.error('No hay ID docente');
          return;
        }
        console.log('ID docente encontrado:', idDocente.toString());
        this.http.get<any>(`http://localhost:3000/docentes/alumnoANDcursos/${idDocente}`)
          .subscribe(
            (response) => {
              if (Array.isArray(response) && response.length > 0) {
                const data = response[0]; // Accede al primer elemento del array
                this.cursos = data.cursos; // Accede a los cursos
                this.students = data.alumnos; // Accede a los estudiantes

                console.log('Cursos:', this.cursos);
                console.log('Alumnos:', this.students);

                // Inicializa filteredStudents con todos los estudiantes
                this.filteredStudents = this.students;
              } else {
                console.error('Respuesta inesperada:', response);
              }
            },
            (error) => {
              console.error('Error al obtener los datos:', error);
            }
          );
      })
      .catch((error) => {
        console.error('Error al obtener el ID del docente:', error);
      });
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

  saveGrade(student: any) {
    // router.put('/:alumnoId/cursos/:cursoId', AlumnosPlantelCursosController.actualizarCalificacionFinal);

    // http://localhost:3000/plantelesCursos/5/cursos/3
    // Enviar los cambios de calificación al servidor
    this.http.put<any>(`http://localhost:3000/plantelesCursos/${student.alumno_id}/cursos/${student.curso_id}`, { nuevaCalificacion: student.calificacion })
      .subscribe(
        (response) => {
          console.log('Calificación guardada:', response);
          this.isModifying = false;
          this.selectedStudent = null;
        },
        (error) => {
          console.error('Error al guardar la calificación:', error);
        }
      );
  }
}
