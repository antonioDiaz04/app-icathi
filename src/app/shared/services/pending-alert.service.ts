import { Injectable, signal, computed } from "@angular/core"

export interface PendingAlert {
  id: string
  message: string
  priority: "high" | "medium" | "low"
  category: "document" | "validation" | "profile" | "assignment"
}

@Injectable({
  providedIn: "root",
})
export class PendingAlertService {
  private _pendingAlerts = signal<PendingAlert[]>([])

  // Computed signals para diferentes métricas
  pendingAlerts = this._pendingAlerts.asReadonly()
  pendingCount = computed(() => this._pendingAlerts().length)
  highPriorityCount = computed(() => this._pendingAlerts().filter((alert) => alert.priority === "high").length)

  // Computed por categorías
  documentAlerts = computed(() => this._pendingAlerts().filter((alert) => alert.category === "document"))
  validationAlerts = computed(() => this._pendingAlerts().filter((alert) => alert.category === "validation"))
  profileAlerts = computed(() => this._pendingAlerts().filter((alert) => alert.category === "profile"))
  assignmentAlerts = computed(() => this._pendingAlerts().filter((alert) => alert.category === "assignment"))

  /**
   * Actualiza las alertas pendientes basado en los datos del docente
   */
  updatePendingAlerts(docenteData: any, especialidades: number[] = []): void {
    const alerts: PendingAlert[] = []

    if (!docenteData) {
      alerts.push({
        id: "no-data",
        message: "Datos del docente no disponibles",
        priority: "high",
        category: "profile",
      })
      this._pendingAlerts.set(alerts)
      return
    }

    // Validaciones de documentos
    if (!docenteData.cedula_profesional || docenteData.cedula_profesional.trim() === "") {
      alerts.push({
        id: "cedula-profesional",
        message: "Cédula profesional requerida",
        priority: "high",
        category: "document",
      })
    }

    if (!docenteData.curriculum_url || docenteData.curriculum_url.trim() === "") {
      alerts.push({
        id: "curriculum",
        message: "Curriculum vitae requerido",
        priority: "high",
        category: "document",
      })
    }

    if (!docenteData.documento_identificacion || docenteData.documento_identificacion.trim() === "") {
      alerts.push({
        id: "documento-identificacion",
        message: "Documento de identificación requerido",
        priority: "high",
        category: "document",
      })
    }

    // Validaciones de perfil
    if (!docenteData.telefono || docenteData.telefono.trim() === "") {
      alerts.push({
        id: "telefono",
        message: "Número de teléfono requerido",
        priority: "medium",
        category: "profile",
      })
    }

    if (!docenteData.foto_url || docenteData.foto_url.trim() === "") {
      alerts.push({
        id: "foto-perfil",
        message: "Foto de perfil requerida",
        priority: "low",
        category: "profile",
      })
    }

    // Validaciones de especialidades
    if (!especialidades || especialidades.length === 0) {
      alerts.push({
        id: "especialidades",
        message: "Especialidades requeridas",
        priority: "high",
        category: "assignment",
      })
    }

    // Validaciones de estatus y validador
    if (!docenteData.estatus_id || docenteData.estatus_id !== 2) {
      // Asumiendo que 2 es "aprobado"
      alerts.push({
        id: "validacion-pendiente",
        message: "Validación de perfil pendiente",
        priority: "high",
        category: "validation",
      })
    }

    if (!docenteData.usuario_validador_id) {
      alerts.push({
        id: "asignacion-validador",
        message: "Asignación de validador pendiente",
        priority: "medium",
        category: "assignment",
      })
    }

    this._pendingAlerts.set(alerts)
  }

  /**
   * Limpia todas las alertas
   */
  clearAlerts(): void {
    this._pendingAlerts.set([])
  }

  /**
   * Remueve una alerta específica por ID
   */
  removeAlert(alertId: string): void {
    this._pendingAlerts.update((alerts) => alerts.filter((alert) => alert.id !== alertId))
  }

  /**
   * Obtiene alertas por categoría
   */
  getAlertsByCategory(category: PendingAlert["category"]): PendingAlert[] {
    return this._pendingAlerts().filter((alert) => alert.category === category)
  }

  /**
   * Obtiene alertas por prioridad
   */
  getAlertsByPriority(priority: PendingAlert["priority"]): PendingAlert[] {
    return this._pendingAlerts().filter((alert) => alert.priority === priority)
  }

  /**
   * Verifica si hay alertas de alta prioridad
   */
  hasHighPriorityAlerts(): boolean {
    return this.highPriorityCount() > 0
  }
}
