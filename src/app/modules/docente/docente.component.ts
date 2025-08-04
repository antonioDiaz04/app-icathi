// import type { DocenteDataService } from "./commons/services/docente-data.service"
import { Component, type OnInit, signal, computed, effect, type OnDestroy } from "@angular/core"

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
// import type { PendingAlertService } from "../../shared/services/pending-alert.service"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { filter } from "rxjs/operators"
import { AuthService } from "../../shared/services/auth.service"
import { PendingAlertService } from "../../shared/services/pending-alert.service"
import { DocenteDataService } from "./commons/services/docente-data.service"
import { NavigationEnd, Router } from "@angular/router"
import { ValidadorDocenteService } from "../validador/commons/services/validador-docente.service";

@Component({
  selector: "app-docente",
  templateUrl: "./docente.component.html",
  styleUrls: ["./docente.component.scss"],
  standalone: false,
})
export class DocenteComponent implements OnInit, OnDestroy {
  id = signal<number | null>(null)
  isAuthenticated = signal(false)
  docenteData = signal<any>(null)
  isMobile = signal(false)
  selectedEspecialidades_doce = signal<number[]>([])
  sidebarDocenteVisible = signal(false)
  visible_docente = signal(false)

  // Computed signals para alertas
  pendingCount = computed(() => this.pendingAlertService.pendingCount())
  highPriorityCount = computed(() => this.pendingAlertService.highPriorityCount())
  pendingAlerts = computed(() => this.pendingAlertService.pendingAlerts())

  // Computed para mostrar diferentes tipos de alertas
  documentAlerts = computed(() => this.pendingAlertService.documentAlerts())
  validationAlerts = computed(() => this.pendingAlertService.validationAlerts())

  // Effect para actualizar alertas cuando cambien los datos
  private updateAlertsEffect = effect(() => {
    const docente = this.docenteData()
    const especialidades = this.selectedEspecialidades_doce()

    if (docente) {
      this.pendingAlertService.updatePendingAlerts(docente, especialidades)
    }
  })

  constructor(
    private authService: AuthService,
    private pendingAlertService: PendingAlertService,
    private docenteDataService: DocenteDataService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private validadorDocenteService: ValidadorDocenteService,
  ) {
    // Escuchar cambios de ruta para actualizar alertas
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        // Pequeño delay para asegurar que los datos estén cargados
        setTimeout(() => {
          this.refreshPendingAlerts()
        }, 100)
      })
  }

  ngOnInit(): void {
    this.loadUserDetails()
    this.detectScreenSize()
  }

  ngOnDestroy(): void {
    this.pendingAlertService.clearAlerts()
  }

  /**
   * Refresca las alertas pendientes
   */
  private refreshPendingAlerts(): void {
    const docente = this.docenteData()
    const especialidades = this.selectedEspecialidades_doce()

    if (docente) {
      this.pendingAlertService.updatePendingAlerts(docente, especialidades)
    }
  }

  private detectScreenSize(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile.set(result.matches)
      })
  }

  private async loadUserDetails(): Promise<void> {
    try {
      this.isAuthenticated.set(await this.authService.isAuthenticated())

      if (this.isAuthenticated()) {
        const id = await this.authService.getIdFromToken()
        this.id.set(id)

        if (this.id() !== null) {
          await this.getDocenteData(this.id()!)
          await this.loadEspecialidades()
        }
      } else {
        console.warn("Usuario no autenticado")
        this.router.navigate(["/public/login"])
      }
    } catch (error) {
      console.error("Error al cargar los detalles del usuario:", error)
    }
  }

  private getDocenteData(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.validadorDocenteService.getDocentesByUserId(id.toString()).subscribe({
        next: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            this.docenteData.set(data[0])
            this.docenteDataService.docenteData.set(data[0])
          } else {
            this.docenteData.set(null)
          }
          resolve()
        },
        error: (error) => {
          console.error("Error al obtener los datos del docente:", error)
          reject(error)
        },
      })
    })
  }

  /**
   * Carga las especialidades del docente
   */
  private async loadEspecialidades(): Promise<void> {
    try {
      // Aquí deberías cargar las especialidades del docente
      // Por ejemplo, desde un servicio
      // const especialidades = await this.especialidadesService.getEspecialidadesByDocenteId(this.id()!);
      // this.selectedEspecialidades_doce.set(especialidades.map(e => e.id));
      // Por ahora, simulamos la carga
      // this.selectedEspecialidades_doce.set([]);
    } catch (error) {
      console.error("Error al cargar especialidades:", error)
    }
  }

  /**
   * Obtiene el texto del badge según la prioridad
   */
  getBadgeClass(): string {
    const highPriority = this.highPriorityCount()
    if (highPriority > 0) {
      return "ui red circular label"
    }
    return "ui orange circular label"
  }

  /**
   * Obtiene el tooltip con información detallada
   */
  getPendingAlertsTooltip(): string {
    const alerts = this.pendingAlerts()
    if (alerts.length === 0) return "No hay alertas pendientes"

    const highPriority = alerts.filter((a) => a.priority === "high")
    const mediumPriority = alerts.filter((a) => a.priority === "medium")
    const lowPriority = alerts.filter((a) => a.priority === "low")

    let tooltip = "Alertas pendientes:\n"

    if (highPriority.length > 0) {
      tooltip += `\n🔴 Alta prioridad (${highPriority.length}):\n`
      highPriority.forEach((alert) => (tooltip += `• ${alert.message}\n`))
    }

    if (mediumPriority.length > 0) {
      tooltip += `\n🟡 Media prioridad (${mediumPriority.length}):\n`
      mediumPriority.forEach((alert) => (tooltip += `• ${alert.message}\n`))
    }

    if (lowPriority.length > 0) {
      tooltip += `\n🟢 Baja prioridad (${lowPriority.length}):\n`
      lowPriority.forEach((alert) => (tooltip += `• ${alert.message}\n`))
    }

    return tooltip.trim()
  }

  async logout(): Promise<void> {
    this.pendingAlertService.clearAlerts()
    await this.authService.clearToken()
    this.router.navigate(["/public/login"])
  }

  closeDrawer(): void {
    this.visible_docente.set(false)
  }

  /**
   * Método para forzar actualización de alertas (útil para debugging)
   */
  forceUpdateAlerts(): void {
    this.refreshPendingAlerts()
  }
}
