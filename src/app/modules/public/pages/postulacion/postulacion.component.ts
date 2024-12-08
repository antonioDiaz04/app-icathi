import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-postulacion',
  templateUrl: './postulacion.component.html',
  styleUrls: ['./postulacion.component.scss']
})
export class PostulacionComponent {
  postulationForm: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;

  constructor(private fb: FormBuilder) {
    this.postulationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
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

  // Enviar el formulario
  onSubmit() {
    if (this.postulationForm.valid) {
      const postulationData = this.postulationForm.value;
      console.log('Datos de postulación enviados:', postulationData);
      alert('¡Postulación enviada con éxito!');
      this.postulationForm.reset();
      this.currentStep = 1; // Reinicia el formulario
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
      1: ['name'],
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
