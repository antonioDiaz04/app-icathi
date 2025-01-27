import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AspiranteService } from '../../../../shared/services/aspirante.service';
import { AlumnosCursosService } from '../../../../shared/services/alumnos-cursos.service';

@Component({
    selector: 'app-calificaciones',
    templateUrl: './calificaciones.component.html',
    styleUrls: ['./calificaciones.component.scss'],
    standalone: false
})
export class CalificacionesComponent implements OnInit {

  isUsuarioAlumno: number | null = null; // ID del alumno autenticado
  alumnoData: any = null; // Datos del alumno
  cursos: any[] = []; // Lista de cursos del alumno
  selectedCurso: any = null; // Curso seleccionado para el modal
  selectedMateria: string = ''; // Materia seleccionada para filtrar
  calificaciones: any[] = []; // Calificaciones de las materias
  today: Date = new Date(); // Fecha actual
  cursoSeleccionado: any = null;

  abrirModal(curso: any) {
    this.cursoSeleccionado = curso;
  }
  
  cerrarModal() {
    this.cursoSeleccionado = null;
      }
      constructor(
        private authService: AuthService,
        private router: Router,
        private aspiranteService: AspiranteService,
        private alumnosCursosService: AlumnosCursosService,
        private route: ActivatedRoute
      ) {}

      ngOnInit(): void {
        this.loadUserDetails();
      }

  /**
   * Carga los detalles del usuario autenticado y sus cursos.
   */
  private async loadUserDetails(): Promise<void> {
    try {
      this.isUsuarioAlumno = await this.authService.getIdFromToken();
      console.log('ID del usuario:', this.isUsuarioAlumno);

      if (this.isUsuarioAlumno !== null) {
        this.getAlumnoCursosDetails(this.isUsuarioAlumno);
      }
    } catch (error) {
      console.error('Error al cargar los detalles del usuario:', error);
    }
  }

  /**
   * Obtiene los datos del alumno y sus cursos relacionados.
   * @param id ID del alumno.
   */
  getAlumnoCursosDetails(id: number): void {
    this.aspiranteService.getAlumnoById_user(id).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.alumnoData = data[0]; // Asignar el primer elemento del array
          console.log('Datos del alumno:', this.alumnoData);

          this.alumnosCursosService.getCursoById_Alumno(this.alumnoData.id).subscribe({
            next: (cursos) => {
              this.cursos = cursos; // Asignar los cursos obtenidos
              this.calificaciones = this.cursos.map(curso => ({
                nombre_curso: curso.nombre_curso,
                calificacion_final: curso.calificacion_final,
                docente: `${curso.nombre_docente} ${curso.apellido_docente}`,
                fecha_inicio: curso.fecha_inicio,
                fecha_fin: curso.fecha_fin
              }));

              console.log('Cursos del alumno:', this.cursos);
            },

            error: (err) => {
              console.error('Error al obtener los cursos del alumno:', err);
            }
          });
        } else {
          console.warn('No se encontraron datos del alumno.');
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos del alumno:', err);
      }
    });
  }



  verDetalles(curso: any): void {

    this.selectedCurso = curso;

    console.log('Detalles del curso:', curso);
    // Lógica para mostrar un modal o redirigir a otra página
  }
  
  exportarCalificaciones(): void {
    console.log('Exportando calificaciones...');
    // Lógica para generar y descargar un archivo CSV
  }

  get promedioGeneral(): string {
    if (this.cursos.length === 0) {
      return 'N/A';
    }
    const sumaCalificaciones = this.cursos.reduce((sum, curso) => {
      return sum + (curso.calificacion_final || 0);
    }, 0);
    return (sumaCalificaciones / this.cursos.length).toFixed(1);
  }
  
}
