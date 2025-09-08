import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AspiranteService } from '../../../../shared/services/aspirante.service';
import { AlumnosCursosService } from '../../../../shared/services/alumnos-cursos.service';
import { PlantelCursosService } from '../../../../shared/services/plantel-cursos.service';

@Component({
  selector: 'app-oferta-educativa',
  templateUrl: './oferta-educativa.component.html',
  styleUrls: ['./oferta-educativa.component.scss'], // Corregido styleUrl a styleUrls
})
export class OfertaEducativaComponent implements OnInit {

  ofertaEducativa: any[] = [];
  isUsuarioAlumno: number | null = null; // ID del alumno autenticado
  alumnoData: any = null; // Datos del alumno
  selectedCurso: any = null; // Curso seleccionado para el modal
  modalCurso: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private aspiranteService: AspiranteService,
    private alumnosCursosService: AlumnosCursosService,
    private plantelCursosService: PlantelCursosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  /**
   * Carga los detalles del usuario autenticado y obtiene su oferta educativa.
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
   * Obtiene los datos del alumno y su oferta educativa.
   * @param id ID del alumno.
   */
  private getAlumnoCursosDetails(id: number): void {
    this.aspiranteService.getAlumnoById_user(id).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.alumnoData = data[0]; // Asignar el primer elemento del array
          console.log('Datos del alumno:', this.alumnoData);
          console.log('ID del plantel:', this.alumnoData.id);

          // Obtener la oferta educativa del plantel
          this.plantelCursosService.getOfertaEducativa(this.alumnoData.id).subscribe({
            next: (oferta) => {
              this.ofertaEducativa = oferta;
              console.log('Oferta educativa:', this.ofertaEducativa);
            },
            error: (error) => {
              console.error('Error al obtener la oferta educativa:', error);
            },
          });
        } else {
          console.warn('No se encontraron datos del alumno.');
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos del alumno:', err);
      },
    });
  }



   /**
   * Abre el modal con los detalles del curso seleccionado.
   * @param curso Datos del curso.
   */
   openModal(curso: any): void {
    this.selectedCurso = curso;
  }

  /**
   * Cierra el modal.
   */
  closeModal(): void {
    this.selectedCurso = null;
  }

  /**
   * Retorna un color de borde basado en el tipo de curso o modalidad.
   * @param curso Datos del curso.
   */
  getBorderColor(curso: any): string {
    return curso.modalidad === 'Presencial' ? '#44509D' : '#F08762';
  }



  inscribirse(curso: any): void {
    alert(`Inscripción realizada al curso: ${curso.curso_nombre}`);
  }

  verDetalles(curso: any): void {
    this.modalCurso = curso;
  }

  cerrarModal(): void {
    this.modalCurso = null;
  }


}
