import { DocenteDataService } from './commons/services/docente-data.service';
import { Component, OnInit, signal, computed, effect, Signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ValidadorDocenteService } from '../validador/commons/services/validador-docente.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PendingAlertService } from '../../shared/services/pending-alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.scss'],
  standalone: false
})
export class DocenteComponent implements OnInit {
  id = signal<number | null>(null); // ID del usuario
  isAuthenticated = signal(false); // Estado de autenticación
  docenteData = signal<any>(null); // Datos del docente
  isMobile = signal(false); // Variable para verificar si está en móvil
  // pendingCount = signal(0);
  selectedEspecialidades_doce = signal<number[]>([]); // Solo los IDs de las especialidades
  sidebarDocenteVisible = signal(false);
  visible_docente = signal(false);

  pendingCount = computed(() => this.pendingAlertService.pendingCount());

    // Observable original (si lo necesitas)
  pendingAlerts$!: Observable<string[]>;

  // Signal derivada del observable (solo lectura)
  readonlyPendingAlerts!: Signal<string[]>;
  constructor(
    private authService: AuthService,
    private pendingAlertService: PendingAlertService,
    private docenteDataService: DocenteDataService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private validadorDocenteService: ValidadorDocenteService
  ) {

  }

  ngOnInit(): void {

    this.loadUserDetails();
    this.detectScreenSize();
    this.updatePendingAlerts();
  // Asignar observable base
    // this.pendingAlerts$ = this.pendingAlertService.pendingAlerts$;

    // // Convertir a Signal (sin usar takeUntilDestroyed aquí)
    // this.readonlyPendingAlerts = toSignal(this.pendingAlerts$, {
    //   initialValue: []
    // });
  }

  updatePendingAlerts() {
    const alerts: string[] = [];
    const docente = this.docenteData();

    // Verificar que docente no sea null o undefined antes de acceder a sus propiedades
    if (!docente?.cedula_profesional) {
      alerts.push('Cédula profesional pendiente');
    }
    if (!docente?.curriculum_url) {
      alerts.push('Curriculum pendiente');
    }
    if (!docente?.documento_identificacion) {
      alerts.push('Documento de identificación pendiente');
    }
    if (!this.selectedEspecialidades_doce()?.length) {
      alerts.push('Especialidad pendiente');
    }
    if (!docente?.estatus_id) {
      alerts.push('Validación pendiente');
    }
    if (!docente?.usuario_validador_id) {
      alerts.push('Asignación de validador pendiente');
    }
    // this.pendingAlertService.updatePendingAlerts(alerts);
  }

  private detectScreenSize(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  private async loadUserDetails(): Promise<void> {
    this.updatePendingAlerts();

    try {
      // Verificar autenticación
      this.isAuthenticated.set(await this.authService.isAuthenticated());

      if (this.isAuthenticated()) {
        // Obtener el ID del token
        const id = await this.authService.getIdFromToken();
        this.id.set(id);
        console.log('ID del usuario:', this.id());

        // Obtener los datos del docente
        if (this.id() !== null) {
          this.getDocenteData(this.id()!);
        }
      } else {
        console.warn('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los detalles del usuario:', error);
    }
  }

  private getDocenteData(id: number): void {
    this.validadorDocenteService.getDocentesByUserId(id.toString()).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.docenteData.set(data[0]); // Obtén el primer elemento
        } else {
          this.docenteData.set(null); // Maneja el caso en que no hay datos
        }
        console.log('Datos del docente:', this.docenteData());
        // this.docenteDataService.docenteData = this.docenteData();
        this.docenteDataService.docenteData.set(this.docenteData());

        this.updatePendingAlerts();
      },
      error: (error) => {
        console.error('Error al obtener los datos del docente:', error);
      },
    });
  }

  async logout(): Promise<void> {
    await this.authService.clearToken();
    this.router.navigate(['/public/login']);
  }

  editarPerfil(): void {
    console.log('Redirigir a la página de edición del perfil');
  }

  verClases(): void {
    console.log('Redirigir a la página de clases');
  }

  show() {
    this.sidebarDocenteVisible.set(true);
  }

  closeDrawer() {
    this.visible_docente.set(false);
  }
}