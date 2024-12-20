import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../shared/services/auth.service';

@Component({
  selector: 'app-alumnos-cursos',
  templateUrl: './alumnos-cursos.component.html',
  styles: [],
})
export class AlumnosCursosComponent implements OnInit {
  cursos: any[] = []; // List of courses
  students: any[] = []; // List of all students
  filteredStudents: any[] = []; // List of students filtered by course
  selectedCourse: string = ''; // Holds the selected course ID
  selectedCourseName: string = ''; // Holds the name of the selected course

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarAlumnos(); // Fetch data when the component is initialized
  }

  cargarAlumnos() {
    this.authService.getIdFromToken()
      .then((idDocente) => {
        if (!idDocente) {
          console.log('No hay ID docente');
          return;
        }

        console.log('Hay ID docente:', idDocente.toString());

        this.http.get<any>(`http://localhost:3000/docentes/alumnoANDcursos/${idDocente?.toString()}`)
          .subscribe((response) => {
            // Verifica que la respuesta sea un array y tenga al menos un elemento
            if (Array.isArray(response) && response.length > 0) {
              const data = response[0]; // Access the first element of the array
              this.cursos = data.cursos; // Access the courses
              this.students = data.alumnos; // Access the students

              console.log('Cursos:', this.cursos);
              console.log('Alumnos:', this.students);

              // Initialize filteredStudents to all students initially
              this.filteredStudents = this.students;
            } else {
              console.error('Respuesta inesperada:', response);
            }
          }, (error) => {
            console.error('Error al obtener los datos:', error);
          });
      })
      .catch((error) => {
        console.error('Error al obtener el ID del docente:', error);
      });
  }

  onCourseChange(event: Event): void {
    const courseId = (event.target as HTMLSelectElement).value;

    // Update the selected course and filter students based on the course ID
    this.selectedCourse = courseId;

    // Find the selected course name
    const selectedCourseObj = this.cursos.find(course => course.id == parseInt(courseId, 10));
    this.selectedCourseName = selectedCourseObj ? selectedCourseObj.curso_nombre : '';

    if (courseId) {
      // Filter students who belong to the selected course
      this.filteredStudents = this.students.filter(student => student.curso_id == parseInt(courseId, 10));
    } else {
      // If no course is selected, show all students
      this.filteredStudents = this.students;
    }

    console.log('Curso seleccionado:', courseId);
    console.log('Estudiantes filtrados:', this.filteredStudents);
  }

  modifyGrade(student: any): void {
    // Logic to modify the student's grade
    console.log('Modificando calificación para el estudiante:', student);
    // You could open a modal or redirect to another page to edit the grade
  }
}
