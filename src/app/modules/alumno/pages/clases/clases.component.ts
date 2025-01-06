import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AspiranteService } from '../../../../shared/services/aspirante.service';
import { AlumnosCursosService } from '../../../../shared/services/alumnos-cursos.service';

@Component({
    selector: 'app-clases',
    templateUrl: './clases.component.html',
    styleUrls: ['./clases.component.scss'],
    standalone: false
})
export class ClasesComponent {

  is_usuario_alumno: number | null = null; // ID del alumno a cargar
  curosData: any = null; // Datos del alumno cargados

  alumnoData: any = null; // Datos del alumno cargados
  cursos: any[] = []; // Especificamos que es un array vacío inicialmente


  selectedCurso: any = null; // Curso seleccionado para mostrar en el modal

    constructor(
  
          private authService: AuthService,
         private router: Router,
      
      private aspiranteService: AspiranteService, // Inyectar el servicio AspiranteService
      private alumnosCursosService: AlumnosCursosService, // Inyectar el servicio AspiranteService
      private route: ActivatedRoute // Inyectar el ActivatedRoute para obtener el ID desde la URL
    ) {}

    openModal(curso: any): void {
      this.selectedCurso = curso; // Asignar el curso seleccionado
    }
  
    closeModal(): void {
      this.selectedCurso = null; // Limpiar el curso seleccionado
    }
    
  ngOnInit(): void {
    this.loadUserDetails();


  }
  private async loadUserDetails(): Promise<void> {
    try {

        this.is_usuario_alumno = await this.authService.getIdFromToken();
        console.log('ID del usuario:', this.is_usuario_alumno);

        // Obtener los datos del docente
        if (this.is_usuario_alumno !== null) {
          this.getAlumno_cursosDetails(this.is_usuario_alumno);
        }

    } catch (error) {
      console.error('Error al cargar los detalles del usuario:', error);
    }
  }
  
  getAlumno_cursosDetails(id: number): void {

    this.aspiranteService.getAlumnoById_user(id).subscribe({
      next: (data) => {
        this.alumnoData = data[0]; // Asignar el primer (y único) alumnoData que devuelve el array
        console.log(this.alumnoData);


        this.alumnosCursosService.getCursoById_Alumno(this.alumnoData.id).subscribe({
          next: (data) => {
            // this.curosData = data; // Asignar el primer (y único) curosData que devuelve el array
            // this.curosData = data;
            // this.curso = data[0];  // Asignamos los datos recibidos a la propiedad 'curso'
            this.cursos
             = data;  // Asignamos los datos recibidos a la propiedad 'curso'

            console.log("-----",this.cursos);

            // this.alumnoData = data[0]; // Asignar el primer elemento del array
            // console.log('Datos del alumno:', this.alumnoData);
          },
          error: (err) => {
            console.error('Error al obtener los datos del alumno', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener los datos del alumno', err);
      }
    });
    
  }
  verDetalles(cursoId: number) {

  }
}
