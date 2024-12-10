import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostulacionService } from '../../../../shared/services/postulacion.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-postulacion',
  templateUrl: './postulacion.component.html',
  styleUrls: ['./postulacion.component.scss']
})
export class PostulacionComponent {
  postulationForm: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;
  username: string = ''; // Para mostrarlo tras el registro
  registroCompletado: boolean = false; // Indica si se completó el registro
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private postulacionService: PostulacionService) { // Inyecta el servicio
    this.postulationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName1: ['', [Validators.required, Validators.minLength(2)]], // Apellido paterno
      lastName2: ['', [Validators.required, Validators.minLength(2)]], // Apellido materno
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      specialty: ['', Validators.required]
    });
  }

  // Avanza al siguiente paso si los campos del paso actual son válidos
  nextStep() {
    if (this.isStepValid()) {
      this.currentStep++;
    } else {
      this.validateCurrentStepFields();
    }
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
          alert('¡Registro enviado con éxito! Verifica tu correo electrónico.');
          this.postulationForm.reset();
          this.currentStep = 1; // Reinicia el formulario
          this.username = postulationData.name; // Almacena el username recibido
          this.registroCompletado = true; // Muestra el estado de éxito
          this.isLoading = false;

        },
        error: (error) => {
          console.error('Error al registrar:', error);
          alert('Ocurrió un error al enviar el registro. Inténtalo nuevamente.');
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
