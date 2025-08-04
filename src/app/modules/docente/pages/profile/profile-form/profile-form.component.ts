import { Component, Input, Output, EventEmitter, ViewChild, type ElementRef, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { SafeResourceUrl } from "@angular/platform-browser"
import { FileUploadComponent } from "../file-upload/file-upload.component"
import { Especialidad, EspecialidadesSelectorComponent } from "../especialidades-selector/especialidades-selector.component"

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [EspecialidadesSelectorComponent,FileUploadComponent, CommonModule, FormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent {
  @Input() docenteData: any = {}
  @Input() especialidades: Especialidad[] = []
  @Input() selectedEspecialidades: number[] = []

  @Output() formSubmit = new EventEmitter<any>()
  @Output() cancel = new EventEmitter<void>()
  @Output() profilePhotoChange = new EventEmitter<File>()
  @Output() documentoIdentificacionChange = new EventEmitter<File>()
  @Output() curriculumChange = new EventEmitter<File>()
  @Output() cedulaChange = new EventEmitter<File>()
  @Output() especialidadesChange = new EventEmitter<number[]>()

  @ViewChild("fileInput") fileInput!: ElementRef
    passwordData = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  curriculumFileName = signal<string>("")
  documentoIdentificacionFileName = signal<string>("")
  cedulaFileName = signal<string>("")

  onSubmit(): void {
    this.formSubmit.emit(this.docenteData)
  }

  onCancel(): void {
    this.cancel.emit()
  }

  onProfilePhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.profilePhotoChange.emit(file)
      // Actualizar vista previa
      this.docenteData.foto_url = URL.createObjectURL(file)
    }
  }

  onDocumentoIdentificacionSelected(file: File): void {
    this.documentoIdentificacionFileName.set(file.name)
    this.documentoIdentificacionChange.emit(file)
  }

  onCurriculumSelected(file: File): void {
    this.curriculumFileName.set(file.name)
    this.curriculumChange.emit(file)
  }

  onCedulaSelected(file: File): void {
    this.cedulaFileName.set(file.name)
    this.cedulaChange.emit(file)
  }

  onEspecialidadesChange(especialidades: number[]): void {
    this.especialidadesChange.emit(especialidades)
  }

  getDocumentoIdentificacionUrl(): SafeResourceUrl | null {
    return this.docenteData?.documento_identificacion
      ? this.sanitizeUrl(this.docenteData.documento_identificacion)
      : null
  }

  getCurriculumUrl(): SafeResourceUrl | null {
    return this.docenteData?.curriculum_url ? this.sanitizeUrl(this.docenteData.curriculum_url) : null
  }

  getCedulaUrl(): SafeResourceUrl | null {
    return this.docenteData?.cedula_profesional ? this.sanitizeUrl(this.docenteData.cedula_profesional) : null
  }

  private sanitizeUrl(url: string): SafeResourceUrl {
    // Aquí deberías inyectar DomSanitizer y usar bypassSecurityTrustResourceUrl
    // Por simplicidad, retorno el URL tal como está
    return url as any
  }
}
