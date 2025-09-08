import { Component } from "@angular/core"
import { Postulacion } from "../../model/postulacion.model"
import { PostulacionesService } from "../../services/postulaciones.service"
import { AuthService } from "../../../../shared/services/auth.service"

interface ActionResponse {
  success: boolean
  message: string
  type: "success" | "error" | "warning"
}

@Component({
  selector: "app-admin-postulaciones",
  templateUrl: "./admin-postulaciones.component.html",
  styleUrl: "./admin-postulaciones.component.scss",
})
export class AdminPostulacionesComponent {
  postulaciones: Postulacion[] = []
  postulacionesFiltradas: Postulacion[] = []
  public Math = Math

  // --- NUEVO: tabs/listado/detalle ---
  activeTab: 'list' | 'detail' = 'list'
  selectedId: number | null = null
  detalle: Postulacion | null = null
  newPassword = '' // para asignar contraseña

  // UI/estado
  terminoBusqueda = ""
  filtroEstatus: number | null = null
  filtroDias = 7

  // paginación/orden
  total = 0
  limit = 20
  offset = 0
  orderBy = "p.postulacion_created_at"
  orderDir: "ASC" | "DESC" = "DESC"

  // feedback por fila/acciones
  actionResponses: Map<number, ActionResponse> = new Map()
  loadingActions: Set<number> = new Set()

  cargando = false
  errorMsg = ""

  estatusOpciones = [
    { id: null, label: "Todos" },
    { id: 6, label: "Pendiente de validación" },
    { id: 4, label: "Activo" },
    { id: 5, label: "Inactivo" },
    { id: 7, label: "Suspendido" },
  ]

  showPass = false;

  badge(ok?: boolean | null) {
    return ok
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  }

  // Mínimos para permitir "Asignar"
  canAssignPass() {
    return !!this.newPassword && this.newPassword.length >= 8;
  }
  constructor(private service: PostulacionesService,
    private authService:AuthService
  )
  
  { }

  ngOnInit(): void { this.cargar() }

  cargar() {
    this.cargando = true
    this.errorMsg = ""
    this.service
      .list({
        recentDays: this.filtroDias,
        search: this.terminoBusqueda.trim(),
        estatusId: this.filtroEstatus ?? undefined,
        limit: this.limit,
        offset: this.offset,
        orderBy: this.orderBy,
        orderDir: this.orderDir,
      })
      .subscribe({
        next: (resp) => {
          this.postulaciones = resp.data
          this.total = resp.total
          this.postulacionesFiltradas = [...this.postulaciones]
          this.cargando = false
        },
        error: (err) => {
          this.cargando = false
          this.errorMsg = "No se pudieron cargar las postulaciones."
          console.error(err)
        },
      })
  }

  // helpers feedback
  private showActionResponse(id: number, response: ActionResponse) {
    this.actionResponses.set(id, response)
    setTimeout(() => this.actionResponses.delete(id), 5000)
  }
  private setLoading(id: number, loading: boolean) {
    if (loading) this.loadingActions.add(id)
    else this.loadingActions.delete(id)
  }
  isLoading(id: number) { return this.loadingActions.has(id) }

  // navegación / filtros
  cambiarOrden(campo: string) {
    if (this.orderBy === campo) this.orderDir = this.orderDir === "ASC" ? "DESC" : "ASC"
    else { this.orderBy = campo; this.orderDir = "ASC" }
    this.offset = 0; this.cargar()
  }
  cambiarPagina(dir: "prev" | "next") {
    if (dir === "prev" && this.offset > 0) { this.offset = Math.max(0, this.offset - this.limit); this.cargar() }
    if (dir === "next" && this.offset + this.limit < this.total) { this.offset += this.limit; this.cargar() }
  }
  onChangeFiltros() { this.offset = 0; this.cargar() }
  onInputBuscar() { this.offset = 0; this.cargar() }

  // --- NUEVO: ver detalle y volver ---
  verDetalles(p: Postulacion) {
    console.log("Ver detalles de:", p)
    this.cargando = true
    this.selectedId = p.docente_id
    this.detalle = null
    this.activeTab = 'detail'
    this.setLoading(p.docente_id, true)
    // Usa getById con id de docente (ajusta si tu endpoint requiere id de postulación)
    this.service.getById(p.docente_id).subscribe({
      next: (resp) => {
        this.cargando = false
        this.detalle = resp.data
        this.setLoading(p.docente_id!, false)
      },
      error: (e) => {
        this.cargando = false
        console.error(e)
        this.showActionResponse(p.docente_id, { success: false, type: 'error', message: 'No se pudo cargar el detalle.' })
        this.setLoading(p.docente_id!, false)
      }
    })
  }

  volverAlListado() {
    this.cargando = false
    this.activeTab = 'list'
    this.selectedId = null
    this.detalle = null
    this.newPassword = ''
  }

  // --- Validar correo (registro validado) ---
  marcarCorreoValidado(value = true) {
    if (!this.detalle?.usuario_id) {
      if (this.selectedId) this.showActionResponse(this.selectedId, { success: false, type: 'warning', message: 'Sin usuario asociado.' })
      return
    }
    this.setLoading(this.selectedId!, true)
    this.service.marcarCorreoValidado(this.detalle.usuario_id, value).subscribe({
      next: () => {
        (this.detalle as any).correo_validado = value
        this.showActionResponse(this.selectedId!, { success: true, type: 'success', message: value ? 'Correo validado.' : 'Correo desmarcado.' })
        this.setLoading(this.selectedId!, false)
      },
      error: (e) => {
        console.error(e)
        this.showActionResponse(this.selectedId!, { success: false, type: 'error', message: 'No se pudo actualizar validación.' })
        this.setLoading(this.selectedId!, false)
      }
    })
  }

  // --- Asignar contraseña manual (o usar resetPassword como fallback) ---
  asignarPassword() {
    console.log("this.detalle", this.detalle?.email)
    if (!this.detalle?.usuario_id) {
      if (this.selectedId) this.showActionResponse(this.selectedId, { success: false, type: 'warning', message: 'Sin usuario asociado.' })
      return
    }
    if (!this.newPassword || this.newPassword.length < 8) {
      this.showActionResponse(this.selectedId!, { success: false, type: 'warning', message: 'La contraseña debe tener al menos 8 caracteres.' })
      return
    }
    this.setLoading(this.selectedId!, true)
    console.log("this.detalle.usuario_id, this.newPassword", this.detalle?.email, this.newPassword)

    // Requiere endpoint en backend. Ver método en el service más abajo.
    // Requiere endpoint en backend. Ver método en el service más abajo.
    this.authService.crearContraseñaADMIN(this.detalle?.email, this.newPassword).subscribe({
      next: () => {
        this.showActionResponse(this.selectedId!, {
          success: true,
          type: 'success',
          message: 'Contraseña asignada.'
        });
        this.newPassword = '';
        this.setLoading(this.selectedId!, false);
        console.log("Contraseña asignada:", this.newPassword);
        this.editandoPass = false; // cerrar edición
        console.log("this.detalle*******++", this.detalle);
              this.recargarDetalle();

        // this.verDetalles(this.detalle!); // recargar detalle para ver cambios
        // this.volverAlListado()
      },
      error: (err) => {
        console.error('Error al asignar contraseña:', err);
        // Fallback: si no existe el endpoint, avisa usar resetPassword
        this.showActionResponse(this.selectedId!, {
          success: false,
          type: 'error',
          message: 'No se pudo asignar. Verifica el endpoint o usa "Reset pass".'
        });
        this.setLoading(this.selectedId!, false);
      }
    });



  }
recargarDetalle() {
  if (!this.selectedId) return;
  
  this.setLoading(this.selectedId, true);
  this.service.getById(this.selectedId).subscribe({
    next: (resp) => {
      this.detalle = resp.data;
      this.setLoading(this.selectedId!, false);
    },
    error: (e) => {
      console.error('Error al recargar detalle:', e);
      this.setLoading(this.selectedId!, false);
    }
  });
}
  resetPassword() {
    if (!this.detalle?.usuario_id) {
      if (this.selectedId) this.showActionResponse(this.selectedId, { success: false, type: 'warning', message: 'Sin usuario asociado.' })
      return
    }
    if (!confirm('¿Generar contraseña temporal y enviar por correo?')) return
    this.setLoading(this.selectedId!, true)
    this.service.resetPassword(this.detalle.usuario_id).subscribe({
      next: () => {
        this.showActionResponse(this.selectedId!, { success: true, type: 'success', message: 'Contraseña temporal enviada.' })
        this.setLoading(this.selectedId!, false)
      },
      error: (e) => {
        console.error(e)
        this.showActionResponse(this.selectedId!, { success: false, type: 'error', message: 'No se pudo resetear.' })
        this.setLoading(this.selectedId!, false)
      }
    })
  }

  // CONTRASEÑAS
  // Indicador muy simple de fuerza (0-4) -> devolvemos 0..4 y lo mapeamos a % con *25 en el HTML
  passwordStrength(): 0 | 1 | 2 | 3 | 4 {
    const p = this.newPassword || '';
    let score: 0 | 1 | 2 | 3 | 4 = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score = (score < 4 ? (score + 1 as 1 | 2 | 3 | 4) : 4);
    return (score > 4 ? 4 : score) as 0 | 1 | 2 | 3 | 4;
  }

  strengthLabel() {
    const s = this.passwordStrength();
    return ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'][s];
  }

  strengthBarClass() {
    const s = this.passwordStrength();
    // Colores neutros sin Tailwind arbitrary (usa clases estándar)
    return {
      'bg-red-400': s <= 1,
      'bg-yellow-400': s === 2,
      'bg-blue-400': s === 3,
      'bg-green-500': s === 4,
    };
  }

  editandoPass = false;
// showPass = false;
// newPassword = '';

cancelarEdicion() {
  this.editandoPass = false;
  this.newPassword = '';
  this.showPass = false;
}



}
