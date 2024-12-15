import { Component } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  // Datos de los cursos
  courses = [
    { name: 'Curso de Programación Web', schedule: 'Lunes y Miércoles - 10:00 AM a 12:00 PM', link: '/courses/web-development' },
    { name: 'Curso de Marketing Digital', schedule: 'Martes y Jueves - 2:00 PM a 4:00 PM', link: '/courses/digital-marketing' },
    { name: 'Curso de Inglés Intermedio', schedule: 'Viernes - 9:00 AM a 1:00 PM', link: '/courses/intermediate-english' }
  ];

  // Datos estadísticos (debe ser calculado o obtenido desde una base de datos)

  // Datos estadísticos (debe ser calculado o obtenido desde una base de datos)
  attendancePercentage: number = 85; // Porcentaje de asistencia
  averageGrade: number = 90; // Promedio de calificaciones

  // Método para marcar la asistencia
  markAttendance(course: any) {
    alert(`Asistencia marcada para el curso: ${course.name}`);
    // Aquí puedes implementar la lógica para guardar la asistencia en la base de datos.
  }
}
