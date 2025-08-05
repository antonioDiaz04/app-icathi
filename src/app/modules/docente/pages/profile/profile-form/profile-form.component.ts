import { Component, Input, Output, EventEmitter, ViewChild, type ElementRef, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { SafeResourceUrl } from "@angular/platform-browser"
import { FileUploadComponent } from "../file-upload/file-upload.component"
import { Especialidad, EspecialidadesSelectorComponent } from "../especialidades-selector/especialidades-selector.component"

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [EspecialidadesSelectorComponent, FileUploadComponent, CommonModule, FormsModule],
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
  // 👇 Agregamos estas variables para evitar el error
  // Nuevas propiedades para el manejo de contraseña
  showPasswordSection = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
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



  // password
  currentPasswordError: string = '';
  newPasswordError: string = '';
  confirmPasswordError: string = '';
  passwordsMatch: boolean = false;
  isFormValid: boolean = false;

  // Propiedades para criterios de validación
  hasMinLength: boolean = false;
  hasUpperCase: boolean = false;
  hasLowerCase: boolean = false;
  hasNumbers: boolean = false;
  hasSpecialChars: boolean = false;
  // Método para alternar la sección de contraseña

  // Método mejorado para alternar la sección de contraseña
  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.resetPasswordFields();
    }
  }

  // Método cuando cambia la nueva contraseña
  onNewPasswordChange(): void {
    this.calculatePasswordStrength();
    this.validateNewPassword();
    this.validatePasswordMatch();
    this.validateForm();
  }

  // Validación de nueva contraseña
  validateNewPassword(): void {
    const password = this.passwordData.new_password;

    if (!password) {
      this.newPasswordError = 'La nueva contraseña es requerida';
      return;
    }

    if (password.length < 8) {
      this.newPasswordError = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    if (this.passwordStrength === 'weak') {
      this.newPasswordError = 'La contraseña es muy débil. Incluye mayúsculas, minúsculas y números';
      return;
    }

    this.newPasswordError = '';
  }

  // Validación de coincidencia de contraseñas
  validatePasswordMatch(): void {
    if (!this.passwordData.confirm_password) {
      this.confirmPasswordError = '';
      this.passwordsMatch = false;
      return;
    }

    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
      this.passwordsMatch = false;
    } else {
      this.confirmPasswordError = '';
      this.passwordsMatch = true;
    }
  }

  // Validación general del formulario
  validateForm(): void {
    const hasCurrentPassword = !!this.passwordData.current_password;
    const hasNewPassword = !!this.passwordData.new_password;
    const hasConfirmPassword = !!this.passwordData.confirm_password;
    const noErrors = !this.currentPasswordError && !this.newPasswordError && !this.confirmPasswordError;
    const passwordsMatch = this.passwordsMatch;
    const strongEnough = this.passwordStrength !== 'weak';

    this.isFormValid = hasCurrentPassword && hasNewPassword && hasConfirmPassword &&
      noErrors && passwordsMatch && strongEnough;
  }

  // Método mejorado para calcular fortaleza
  calculatePasswordStrength(): void {
    const password = this.passwordData.new_password;

    if (!password) {
      this.passwordStrength = 'weak';
      this.resetPasswordCriteria();
      return;
    }

    // Evaluar criterios
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumbers = /\d/.test(password);
    this.hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.hasMinLength = password.length >= 8;

    // Calcular puntuación
    let score = 0;
    if (this.hasMinLength) score++;
    if (password.length >= 12) score++;
    if (this.hasUpperCase) score++;
    if (this.hasLowerCase) score++;
    if (this.hasNumbers) score++;
    if (this.hasSpecialChars) score++;

    // Determinar fortaleza
    if (score <= 2) {
      this.passwordStrength = 'weak';
    } else if (score <= 4) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  // Métodos auxiliares para la UI
  getPasswordStrengthWidth(): string {
    switch (this.passwordStrength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
    }
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Débil';
      case 'medium': return 'Moderada';
      case 'strong': return 'Fuerte';
      default: return 'Débil';
    }
  }

  // Resetear criterios de contraseña
  resetPasswordCriteria(): void {
    this.hasMinLength = false;
    this.hasUpperCase = false;
    this.hasLowerCase = false;
    this.hasNumbers = false;
    this.hasSpecialChars = false;
  }

  // Método mejorado para actualizar contraseña
  updatePassword(): void {
    if (!this.isFormValid) {
      return;
    }

    // Aquí iría la llamada al servicio
    console.log('Actualizando contraseña...');

    // Simulación de éxito
    setTimeout(() => {
      alert('Contraseña actualizada correctamente');
      this.resetPasswordFields();
      this.showPasswordSection = false;
    }, 1000);
  }

  // Cancelar cambio de contraseña
  cancelPasswordChange(): void {
    this.resetPasswordFields();
    this.showPasswordSection = false;
  }

  // Método mejorado para resetear campos
  resetPasswordFields(): void {
    this.passwordData = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };
    this.passwordStrength = 'weak';
    this.currentPasswordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.passwordsMatch = false;
    this.isFormValid = false;
    this.resetPasswordCriteria();
  }
}
