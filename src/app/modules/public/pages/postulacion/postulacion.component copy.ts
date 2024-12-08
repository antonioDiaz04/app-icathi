// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-postulacion',
//   templateUrl: './postulacion.component.html',
//   styleUrls: ['./postulacion.component.scss']
// })
// export class PostulacionComponent {
//   postulationForm: FormGroup;
//   currentStep: number = 1;
//   totalSteps: number = 4;

//   constructor(private fb: FormBuilder) {
//     this.postulationForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
//       specialty: ['', Validators.required],
//       password: ['', [Validators.required, Validators.minLength(6)]], // Paso 4
//     });
//   }

//   // Método para avanzar entre los pasos
//   nextStep() {
//     if (this.isCurrentStepValid()) {
//       if (this.currentStep < this.totalSteps) {
//         this.currentStep++;
//       }
//     } else {
//       this.validateAllFields();
//     }
//   }

//   // Método para retroceder entre los pasos
//   prevStep() {
//     if (this.currentStep > 1) {
//       this.currentStep--;
//     }
//   }

//   // Método que maneja el envío del formulario
//   onSubmit() {
//     if (this.postulationForm.valid) {
//       const postulationData = this.postulationForm.value;
//       console.log('Datos de postulación enviados:', postulationData);
//       alert('¡Postulación enviada con éxito!');
//       this.postulationForm.reset();
//       this.currentStep = 1;
//     } else {
//       alert('Por favor, completa todos los campos requeridos antes de enviar.');
//       this.validateAllFields();
//     }
//   }

//   // Método para validar todos los campos del formulario
//   validateAllFields() {
//     Object.keys(this.postulationForm.controls).forEach(field => {
//       const control = this.postulationForm.get(field);
//       control?.markAsTouched(); // Marca el control como tocado para que se muestren los errores
//     });
//   }

//   // Método para validar los campos del paso actual
//   isCurrentStepValid(): boolean {
//     if (this.currentStep === 1) {
//       return this.postulationForm.get('name')!.valid && this.postulationForm.get('email')!.valid;
//     } else if (this.currentStep === 2) {
//       return this.postulationForm.get('phone')!.valid && this.postulationForm.get('specialty')!.valid;
//     } else if (this.currentStep === 3) {
//       return this.postulationForm.get('password')!.valid;
//     }
//     return true;
//   }
  
// }
