import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.prod';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    standalone: false
})
export class CoursesComponent implements OnInit{
  // Datos de los cursos
  courses :any = [];
  //   { name: 'Curso de Programación Web', schedule: 'Lunes y Miércoles - 10:00 AM a 12:00 PM', link: '/courses/web-development' },
  //   { name: 'Curso de Marketing Digital', schedule: 'Martes y Jueves - 2:00 PM a 4:00 PM', link: '/courses/digital-marketing' },
  //   { name: 'Curso de Inglés Intermedio', schedule: 'Viernes - 9:00 AM a 1:00 PM', link: '/courses/intermediate-english' }
  // ];

  // Datos estadísticos (debe ser calculado o obtenido desde una base de datos)

  // Datos estadísticos (debe ser calculado o obtenido desde una base de datos)
  attendancePercentage: number = 85; // Porcentaje de asistencia
  averageGrade: number = 90; // Promedio de calificaciones
constructor(private router:Router,private http:HttpClient,private autS:AuthService){}
ngOnInit() {
  this.autS.getIdFromToken().then((id) => {
    console.log("id --^^^^^^^^^del token",id)
    this.http.get(`${environment.api}/cursos/byIdDocente/${id}`).subscribe((data: any) => {
      this.courses = data;
      console.log("datsxppp",this.courses)
      this.updatePendingAlerts()
    });
  }).catch((error) => { // Corregido de catchh a catch
    // Manejar el error al obtener el ID del token
    console.error('Error al obtener ID del token:', error);
  });
}
docenteData: any = null; // Datos del docente

updatePendingAlerts() {
  const alerts: string[] = [];

  // Verificar que this.docenteData no sea null o undefined antes de acceder a sus propiedades
  if (!this.docenteData?.cedula_profesional) {
    alerts.push('Cédula profesional pendiente');
  }
  if (!this.docenteData?.curriculum_url) {
    alerts.push('Curriculum pendiente');
  }
  if (!this.docenteData?.documento_identificacion) {
    alerts.push('Documento de identificación pendiente');
  }

  if (!this.docenteData?.estatus_id) {
    alerts.push('Validación pendiente');
  }
  if (!this.docenteData?.usuario_validador_id) {
    alerts.push('Asignación de validador pendiente');
  }

}


  // Método para marcar la asistencia
  markAttendance(course: any) {

    // Navegar a la ruta de detalles del curso pasando el id como parámetro
    this.router.navigate([`/docente/asistencias/${course}`]);
  }
}
