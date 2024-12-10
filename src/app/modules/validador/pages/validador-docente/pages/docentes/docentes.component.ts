import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ValidadorDocenteService } from '../../../../commons/services/validador-docente.service';
import { Docente } from '../../../../interfaces/docente.model';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.scss']
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
  errorMessage: string | null = null;
  showValidateModal = false;
  showRejectModal = false;
  selectedDocenteId: number | null = null;

  constructor(private validadorDocenteService: ValidadorDocenteService) {}

  openValidateModal(id: number) {
    this.selectedDocenteId = id;
    this.showValidateModal = true;
  }

  closeValidateModal() {
    this.showValidateModal = false;
    this.selectedDocenteId = null;
  }

  openRejectModal(id: number) {
    this.selectedDocenteId = id;
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedDocenteId = null;
  }

  ngOnInit(): void {
    this.fetchDocentes();
  }

  // Obtener todos los docentes
  fetchDocentes(): void {
    this.validadorDocenteService.getAllDocentes()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error al cargar los docentes.';
          console.error('Fetch error:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (data: Docente[]) => {
          this.docentes = data;
          this.errorMessage = null;
        },
        (error) => {
          console.error('Error en la suscripción:', error);
        }
      );
  }

  // Validar un docente
  validateDocente(id: number): void {
    const payload = { estatus: true, fecha_validacion: new Date().toISOString() };
    this.validadorDocenteService.updateDocente(id.toString(), payload)
      .subscribe(
        () => {
          this.fetchDocentes();
        },
        (error) => {
          this.errorMessage = 'Error al validar el docente.';
          console.error('Error al validar:', error);
        }
      );
  }

  // Rechazar un docente
  rejectDocente(id: number): void {
    const payload = { estatus: false };
    this.validadorDocenteService.updateDocente(id.toString(), payload)
      .subscribe(
        () => {
          this.fetchDocentes();
        },
        (error) => {
          this.errorMessage = 'Error al rechazar el docente.';
          console.error('Error al rechazar:', error);
        }
      );
  }

  viewProfile(docenteId: number) {
    // this.router.navigate(['/perfil-docente', docenteId]);
  }

}
