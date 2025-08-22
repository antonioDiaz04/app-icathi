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
    docente = {
    nombre: 'María',
    apellidos: 'López',
    email: 'maria.lopez@ejemplo.edu.mx'
  };
  // Métricas estáticas de ejemplo
  metrics = {
    cursosActivos: 3,
    sesionesHoy: 2,
    asistenciaPromedio: 96,
    pendientes: 4
  };

  // Cursos asignados (estático)
  courses = [
    { id: 1, nombre: 'Excel Intermedio', horario: 'Lun y Mié 10:00–12:00', aula: 'B-203' },
    { id: 2, nombre: 'Introducción a JavaScript', horario: 'Mar y Jue 16:00–18:00', aula: 'Lab 2' },
    { id: 3, nombre: 'Comunicación Efectiva', horario: 'Vie 09:00–11:00', aula: 'A-105' },
  ];

  // Próximas sesiones (estático)
  upcoming = [
    { idCurso: 2, curso: 'Introducción a JavaScript', fecha: new Date(), horario: '16:00–18:00', aula: 'Lab 2' },
    { idCurso: 1, curso: 'Excel Intermedio', fecha: this.addHours(new Date(), 20), horario: '10:00–12:00', aula: 'B-203' },
  ];
  // Datos de los cursos
  // courses :any = [];
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

  marcarAsistencia(id: number) {
    // Simulación de acción
    console.log('Asistencia marcada para curso:', id);
    // Aquí puedes integrar tu servicio real de asistencia/toast.
  }
  
// Helper simple para ejemplo
 addHours(date: Date, h: number) {
  const d = new Date(date);
  d.setHours(d.getHours() + h);
  return d;
}
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
