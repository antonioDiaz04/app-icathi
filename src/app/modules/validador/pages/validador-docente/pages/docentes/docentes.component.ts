import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ValidadorDocenteService } from '../../../../commons/services/validador-docente.service';
import { Docente } from '../../../../interfaces/docente.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../shared/services/auth.service';

@Component({
    selector: 'app-docentes',
    templateUrl: './docentes.component.html',
    styleUrls: ['./docentes.component.scss'],
    standalone: false
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
    filteredDocentes: Docente[] = [];     // <— lista filtrada

  searchTerm = '';                       // <— texto de búsqueda
  statusFilter = '';                     // <— filtro por estado
  statusOptions = ['Pendiente de validación', 'Activo', 'Inactivo', 'Suspendido'];

  errorMessage: string | null = null;
  showValidateModal = false;
  showRejectModal = false;
  selectedDocenteId: number | null = null;
  showStatusChangeModal = false;
  selectedDocente: Docente | null = null;
  selectedStatus: number = 6; // Valor por defecto
  userId: number | null = null; // ID del usuario desde el token

  constructor(
        private authService:AuthService,
    
    private router: Router,
    private validadorDocenteService: ValidadorDocenteService) {}

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
    this.authService.getIdFromToken().then(id => {
      this.userId = id; // Asigna el ID del usuario al componente
      console.log('ID del usuario desde el token:', this.userId);
    });
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
          console.log("lista docentes",this.docentes)
              this.applyFilters();   
          this.errorMessage = null;
        },
        (error) => {
          console.error('Error en la suscripción:', error);
        }
      );
  }

  // Validar un docente
  validateDocente(id: number): void {

    
    console.log("<<<<<__",id  )
      this.validadorDocenteService.updateDocenteStatus(Number(this.userId),id.toString(), 4)
      .subscribe(
        () => {
          this.showValidateModal=false
          this.fetchDocentes(); // Vuelve a obtener la lista de docentes actualizada
          this.closeStatusChangeModal(); // Cierra el modal después de cambiar el estado
        },
        (error) => {
          this.errorMessage = 'Error al cambiar el estado del docente.';
          console.error('Error al cambiar el estado:', error);
        }
      );
  }

  // Rechazar un docente
  rejectDocente(id: number): void {

    console.log("<<<<<__",id  )
    this.validadorDocenteService.updateDocenteStatus(Number(this.userId),id.toString(), 5)
    .subscribe(
      () => {
        this.showRejectModal=false
        this.fetchDocentes(); // Vuelve a obtener la lista de docentes actualizada
        this.closeStatusChangeModal(); // Cierra el modal después de cambiar el estado
      },
      (error) => {
        this.errorMessage = 'Error al cambiar el estado del docente.';
        console.error('Error al cambiar el estado:', error);
      }
    );
  }

  viewProfile(docenteId: number) {
    this.router.navigate(['/validador/docente/perfil/', docenteId]);
  }
  openStatusChangeModal(docente: Docente): void {
    this.selectedDocente = docente;
    this.selectedStatus = docente.estatus_id    ; // Establece el estado actual
    this.showStatusChangeModal = true;
  }
  
  closeStatusChangeModal(): void {
    this.showStatusChangeModal = false;
    this.selectedDocente = null;
  }
  
  changeDocenteStatus(id: number, newStatus: number): void {
    const payload = { estatus: newStatus };
    console.log("<<<<<__",payload)
    this.validadorDocenteService.updateDocenteStatus(Number(this.userId),id.toString(), newStatus)
    .subscribe(
      () => {
        this.fetchDocentes(); // Vuelve a obtener la lista de docentes actualizada
        this.closeStatusChangeModal(); // Cierra el modal después de cambiar el estado
      },
      (error) => {
        this.errorMessage = 'Error al cambiar el estado del docente.';
        console.error('Error al cambiar el estado:', error);
      }
    );
  }
  

  /** Normaliza texto (minúsculas y sin acentos) */
  private norm(v: any): string {
    return (v ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
    /** Aplica búsqueda y filtro por estado */
  applyFilters(): void {
    const q = this.norm(this.searchTerm).trim();
    const tokens = q ? q.split(/\s+/) : [];

    this.filteredDocentes = this.docentes.filter(d => {
      if (this.statusFilter && d.estatus_valor !== this.statusFilter) return false;

      if (!tokens.length) return true;

      const haystack = this.norm(
        `${d.id} ${d.nombre} ${d.apellidos} ${d.email} ${d.estatus_valor} ${d.created_at}`
      );

      // todos los tokens deben aparecer
      return tokens.every(t => haystack.includes(t));
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  trackById(index: number, d: Docente) {
    return d.id;
  }

}
