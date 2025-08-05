import { Component, signal, computed, effect } from "@angular/core"

// import type { DocenteDataService } from "../../commons/services/docente-data.service"
// import type { EspecialidadesService } from "../../../../shared/services/especialidad.service"
// import type { FileUploadService } from "../../../../shared/services/file-upload.service"
// import type { DocenteService } from "../../../../shared/services/docente.service"
// import type { ValidadorDocenteService } from "../../../validador/commons/services/validador-docente.service"
// import type { AuthService } from "../../../../shared/services/auth.service"
// import type { PendingAlertService } from "../../../../shared/services/pending-alert.service"
// import type { AlertTaiwilService } from "../../../../shared/services/alert-taiwil.service"
import type { Router } from "@angular/router"
import { forkJoin, type Observable, tap } from "rxjs"
import { PendingItem, PendingItemsComponent } from "./pending-items/pending-items.component"
import { AuthService } from "../../../../shared/services/auth.service"
// import { PendingAlertService } from "../../../../shared/services/pending-alert.service"
import { AlertTaiwilService } from "../../../../shared/services/alert-taiwil.service"
import { DocenteDataService } from "../../commons/services/docente-data.service"
import { FileUploadService } from "../../../../shared/services/file-upload.service"
import { DocenteService } from "../../../../shared/services/docente.service"
import { EspecialidadesService } from "../../../../shared/services/especialidad.service"
import { ValidadorDocenteService } from "../../../validador/commons/services/validador-docente.service"
import { CommonsModule } from "../../commons/commons.module"
import { LoadingDimmerComponent } from "./loading-dimmer/loading-dimmer.component"
// import { DocenteInfoComponentTsComponent } from "./docente-info.component.ts/docente-info.component.ts.component"
import { EspecialidadesDisplayComponent } from "./especialidades-display/especialidades-display.component"
import { ProfileStatusComponent } from "./profile-status/profile-status.component"
import { ProfileFormComponent } from "./profile-form/profile-form.component"
import { DocenteInfoComponentTsComponent } from "./docente-info.component.ts/docente-info.component.ts.component"
import { CommonModule } from "@angular/common"
import { PendingAlertService } from "../../../../shared/services/pending-alert.service"
// import { DocenteInfoComponentTsComponent } from "./docente-info.component.ts/docente-info.component.ts.component"


@Component({
  selector: 'app-profile',
  // imports: [CommonsModule],
   imports: [
    CommonModule,
    LoadingDimmerComponent,
    DocenteInfoComponentTsComponent,
    EspecialidadesDisplayComponent,
    ProfileStatusComponent,
    PendingItemsComponent,
    ProfileFormComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
})
export class ProfileComponent {
   // Signals
  docenteData = signal<any>(null)
  especialidades = signal<{ id: number; nombre: string }[]>([])
  selectedEspecialidades = signal<number[]>([])
  selectedEspecialidades_doce = signal<number[]>([])
  especialidades_cargadas = signal<any[]>([])
  isSaving = signal<boolean>(false)
  isEditing = signal<boolean>(false)
  id = signal<number | null>(null)

  // Archivos temporales
  private profilePhotoFile: File | null = null
  private documentoIdentificacionFile: File | null = null
  private curriculumFile: File | null = null
  private cedulaFile: File | null = null

  // Computed properties
  pendingItems = computed(() => {
    const data = this.docenteData()
    if (!data) return []

    const items: PendingItem[] = []

    if (!data.cedula_profesional) {
      items.push({ condition: true, message: "Cédula profesional pendiente", type: "pending" })
    }
    if (!data.curriculum_url) {
      items.push({ condition: true, message: "Curriculum pendiente", type: "pending" })
    }
    if (!data.documento_identificacion) {
      items.push({ condition: true, message: "Documento de identificación pendiente", type: "pending" })
    }
    if (!this.selectedEspecialidades_doce().length) {
      items.push({ condition: true, message: "Especialidad pendiente", type: "pending" })
    }
    if (!data.estatus_id) {
      items.push({ condition: true, message: "Validación pendiente", type: "pending" })
    }
    if (!data.usuario_validador_id) {
      items.push({ condition: true, message: "Asignación de validador pendiente", type: "pending" })
    } else {
      // items.push({
      //   condition: true,
      //   message: this.getValidadorStatus(data.usuario_validador_id),
      //   type: "completed",
      // })
    }

    return items
  })

  constructor(
    private authService: AuthService,
    // private router: Router,
    private pendingAlertService: PendingAlertService,
    private alertTaiwilService: AlertTaiwilService,
    public docenteDataService: DocenteDataService,
    private fileUploadService: FileUploadService,
    private docenteService: DocenteService,
    private especialidadesService: EspecialidadesService,
    private validadorDocenteService: ValidadorDocenteService,
  ) {
    effect(
      () => {
        this.updatePendingAlerts()
      },
      { allowSignalWrites: true },
    )
  }

  ngOnInit(): void {
    this.loadEspecialidades()
    this.loadUserDetails()
  }

  private async loadUserDetails(): Promise<void> {
    try {
      const id = await this.authService.getIdFromToken()
      this.id.set(id)

      if (this.id() !== null) {
        this.getDocenteData(this.id()!)
      }
    } catch (error) {
      console.error("Error al cargar los detalles del usuario:", error)
    }
  }

  private getDocenteData(id: number): void {
    this.validadorDocenteService.getDocentesByUserId(id.toString()).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.docenteData.set(data[0])
          this.docenteDataService.docenteData.set(this.docenteData())

          if (this.docenteData()?.id) {
            this.checkEspecialidades(this.docenteData().id)
          }
        } else {
          this.docenteData.set(null)
        }
      },
      error: (error) => {
        console.error("Error al obtener los datos del docente:", error)
      },
    })
  }

  private checkEspecialidades(docenteId: number): void {
    this.especialidadesService.obtenerEspecialidadesPorDocente(docenteId).subscribe({
      next: (response) => {
        this.especialidades_cargadas.set(response.especialidades)

        if (response.especialidades && response.especialidades.length > 0) {
          const newEspecialidades = response.especialidades.map((esp) => ({
            id: esp.especialidad_id,
            nombre: esp.especialidad,
          }))

          this.selectedEspecialidades_doce.set(newEspecialidades.map((esp) => esp.id))
          this.selectedEspecialidades.set(this.selectedEspecialidades_doce())
        }
      },
      error: (err) => {
        console.error("Error al cargar especialidades del docente:", err)
      },
    })
  }

  private loadEspecialidades(): void {
    this.especialidadesService.getEspecialidades().subscribe({
      next: (data) => {
        const newEspecialidades = data.map((e) => ({
          id: e.id,
          nombre: e.nombre,
        }))
        this.especialidades.set(newEspecialidades)
      },
      error: (err) => {
        console.error("Error al cargar especialidades", err)
      },
    })
  }

  private updatePendingAlerts(): void {
    try {
      const alerts: string[] = []
      const items = this.pendingItems()

      items.forEach((item) => {
        if (item.type === "pending") {
          alerts.push(item.message)
        }
      })

      // this.pendingAlertService.update(alerts)
    } catch (err) {
      console.warn("Error al evaluar alertas pendientes:", err)
    }
  }

  // Event handlers
  editarPerfil(): void {
    this.isEditing.set(true)
  }

  cancelarEdicion(): void {
    this.isEditing.set(false)
    // Limpiar archivos temporales
    this.profilePhotoFile = null
    this.documentoIdentificacionFile = null
    this.curriculumFile = null
    this.cedulaFile = null
  }

  verClases(): void {
    console.log("Ver clases")
    // Implementar navegación a clases
  }

  onProfilePhotoChange(file: File): void {
    this.profilePhotoFile = file
  }

  onDocumentoIdentificacionChange(file: File): void {
    this.documentoIdentificacionFile = file
  }

  onCurriculumChange(file: File): void {
    this.curriculumFile = file
  }

  onCedulaChange(file: File): void {
    this.cedulaFile = file
  }

  onEspecialidadesChange(especialidades: number[]): void {
    this.selectedEspecialidades.set(especialidades)
  }

  guardarCambios(): void {
    this.isSaving.set(true)

    const currentDocenteData = { ...this.docenteData() }
    const docenteDataToSave: any = {
      nombre: currentDocenteData.nombre,
      apellidos: currentDocenteData.apellidos,
      email: currentDocenteData.email,
      telefono: currentDocenteData.telefono,
    }

    if (this.selectedEspecialidades().length > 0) {
      docenteDataToSave.especialidades = this.selectedEspecialidades()
    }

    const uploads: Observable<any>[] = []

    // Preparar uploads de archivos
    if (this.profilePhotoFile) {
      uploads.push(
        this.fileUploadService
          .uploadProfilePhoto(this.profilePhotoFile)
          .pipe(tap((res) => (docenteDataToSave.foto_url = res.image))),
      )
    }

    if (this.curriculumFile) {
      uploads.push(
        this.fileUploadService
          .uploadCurriculum(this.curriculumFile)
          .pipe(tap((res) => (docenteDataToSave.curriculum_file_url = res.fileUrl))),
      )
    }

    if (this.documentoIdentificacionFile) {
      uploads.push(
        this.fileUploadService
          .uploadDocumentoIdentificacion(this.documentoIdentificacionFile)
          .pipe(tap((res) => (docenteDataToSave.documento_identificacion_file_url = res.fileUrl))),
      )
    }

    if (this.cedulaFile) {
      uploads.push(
        this.fileUploadService
          .uploadCedula(this.cedulaFile)
          .pipe(tap((res) => (docenteDataToSave.cedula_file_url = res.fileUrl))),
      )
    }

    const subirCambios = () => {
      this.docenteService.updateDocente(currentDocenteData.id, docenteDataToSave).subscribe({
        next: (response) => {
          this.alertTaiwilService.showTailwindAlert("Datos del docente guardados correctamente", "success")
          this.docenteDataService.docenteData.set({ ...this.docenteData(), ...docenteDataToSave })
          this.isEditing.set(false)
          this.isSaving.set(false)

          // Limpiar archivos temporales
          this.profilePhotoFile = null
          this.documentoIdentificacionFile = null
          this.curriculumFile = null
          this.cedulaFile = null
        },
        error: (err) => {
          console.error("Error al guardar los datos del docente:", err)
          this.alertTaiwilService.showTailwindAlert("Error al guardar los datos del docente", "error")
          this.isSaving.set(false)
        },
      })
    }

    if (uploads.length > 0) {
      forkJoin(uploads).subscribe({
        next: () => subirCambios(),
        error: (err) => {
          console.error("Error al subir archivos:", err)
          this.alertTaiwilService.showTailwindAlert("Error al subir archivos", "error")
          this.isSaving.set(false)
        },
      })
    } else {
      subirCambios()
    }
  }

  // private getValidadorStatus(usuarioValidadorId: number): string {
  //   if (!usuarioValidadorId) {
  //     return "Asignación de validador pendiente"
  //   }
  //   if (usuarioValidadorId > 0) {
  //     return "El validador ya está asignado y el perfil está en proceso de revisión"
  //   }
  //   return "Estado desconocido"
  // }
}
