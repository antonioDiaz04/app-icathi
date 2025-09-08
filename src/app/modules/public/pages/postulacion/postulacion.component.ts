import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostulacionService } from '../../../../shared/services/postulacion.service';
import { Router } from '@angular/router';
import { VerificacionService } from '../../../../shared/services/verificacion.service';
import { AlertTaiwilService } from '../../../../shared/services/alert-taiwil.service';
@Component({
  selector: 'app-postulacion',
  templateUrl: './postulacion.component.html',
  styleUrls: ['./postulacion.component.scss'],
  standalone: false
})
export class PostulacionComponent {
  postulationForm: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;
  username: string = ''; // Para mostrarlo tras el registro
  registroCompletado: boolean = false; // Indica si se completó el registro
  isLoading = false;

  constructor(
    private alertTaiwilService: AlertTaiwilService,
    private verificacionService: VerificacionService, // <- nuevo
    private fb: FormBuilder,
    private router: Router,
    private postulacionService: PostulacionService) { // Inyecta el servicio
    this.postulationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName1: ['', [Validators.required, Validators.minLength(2)]], // Apellido paterno
      lastName2: ['', [Validators.required, Validators.minLength(2)]], // Apellido materno
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      // specialty: ['', Validators.required]
    });
  }
  soloNumeros(event: KeyboardEvent): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  // Solo permitir números (0-9)
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
  nextStep() {
    if (this.isStepValid()) {
      // Paso 2: Verificación de correo
      if (this.currentStep === 2) {
        const email = this.postulationForm.get('email')?.value;
        if (email) {
          this.isLoading = true;
          this.verificacionService.verificarCorreo(email).subscribe({
            next: (res) => {
              if (res?.valido) {
                this.currentStep++;
              } else {
                this.alertTaiwilService.showTailwindAlert(res?.message || 'El correo no es válido.', 'error');
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              if (err.status === 409 && err.error?.message) {
                this.alertTaiwilService.showTailwindAlert(err.error.message, 'error');
              } else {
                this.alertTaiwilService.showTailwindAlert('El correo no es válido', 'error');
              }
            }
          });
        }

        // Paso 3: Verificación de teléfono
      } else if (this.currentStep === 3) {
        const telefono = this.postulationForm.get('phone')?.value;
        if (telefono) {
          this.isLoading = true;
          this.verificacionService.verificarTelefono(telefono).subscribe({
            next: (res) => {
              if (res?.valido) {
                this.currentStep++;
              } else {
                this.alertTaiwilService.showTailwindAlert(res?.message || 'El teléfono no es válido.', 'error');
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              if (err.status === 409 && err.error?.message) {
                this.alertTaiwilService.showTailwindAlert(err.error.message, 'error');
              } else {
                this.alertTaiwilService.showTailwindAlert('El teléfono no es válido', 'error');
              }
            }
          });
        }

        // Otros pasos normales
      } else {
        this.currentStep++;
      }

    } else {
      this.validateCurrentStepFields();
    }
  }



  // Avanza al siguiente paso si los campos del paso actual son válidos
  // nextStep() {
  //   if (this.isStepValid()) {
  //     this.currentStep++;
  //   } else {
  //     this.validateCurrentStepFields();
  //   }
  // }
  goHome() {
    this.router.navigate(['/']); // Redirige a la ruta principal
  }
  // Retrocede al paso anterior
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  cerrarYRedirigir() {
    // Oculta el modal (puedes añadir lógica si es necesario)
    this.registroCompletado = false;

    // Redirige a la página de inicio
    this.router.navigate(['/']);
  }

  // Enviar el formulario
  onSubmit() {
    if (this.postulationForm.valid) {
      const postulationData = this.postulationForm.value;
      this.isLoading = true;

      this.postulacionService.registrarUsuario(postulationData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          // alert('¡Registro enviado con éxito! Verifica tu correo electrónico.');
          this.alertTaiwilService.showTailwindAlert('¡Registro enviado con éxito! Verifica tu correo electrónico.', 'success');

          this.postulationForm.reset();
          this.currentStep = 1; // Reinicia el formulario
          this.username = postulationData.name; // Almacena el username recibido
          this.registroCompletado = true; // Muestra el estado de éxito
          this.isLoading = false;

        },
        error: (error) => {
          console.error('Error al registrar:', error);
          if (error.status === 400) {
            // Si el correo ya existe
            this.alertTaiwilService.showTailwindAlert('El correo proporcionado ya está registrado. Intenta con otro correo.', 'error');
            // alert('El correo proporcionado ya está registrado. Intenta con otro correo.');
          } else {
            this.alertTaiwilService.showTailwindAlert('Ocurrió un error al enviar el registro. Inténtalo nuevamente.', 'error');
            // alert('Ocurrió un error al enviar el registro. Inténtalo nuevamente.');
          }
          this.alertTaiwilService.showTailwindAlert('Ocurrió un error al enviar el registro. Inténtalo nuevamente.', 'error');

          // alert('Ocurrió un error al enviar el registro. Inténtalo nuevamente.');
          this.isLoading = false;
        }
      });
    } else {
      this.validateAllFields();
      alert('Por favor, completa todos los campos requeridos antes de enviar.');
    }
  }
  // Valida los campos del paso actual
  private isStepValid(): boolean {
    const controlsByStep = this.getControlsForCurrentStep();
    return controlsByStep.every(controlName => this.postulationForm.get(controlName)?.valid);
  }

  // Obtiene los nombres de los controles para el paso actual
  private getControlsForCurrentStep(): string[] {
    const stepControls: { [key: number]: string[] } = {
      // 1: ['name'],
      1: ['firstName', 'lastName1', 'lastName2'], // Campos divididos para el paso 1

      2: ['email'],
      3: ['phone'],
      4: ['specialty']
    };
    return stepControls[this.currentStep] || [];
  }

  // Marca los campos del paso actual como tocados
  private validateCurrentStepFields() {
    this.getControlsForCurrentStep().forEach(controlName => {
      const control = this.postulationForm.get(controlName);
      control?.markAsTouched();
    });
  }

  // Marca todos los campos del formulario como tocados
  private validateAllFields() {
    Object.keys(this.postulationForm.controls).forEach(field => {
      const control = this.postulationForm.get(field);
      control?.markAsTouched();
    });
  }
}
