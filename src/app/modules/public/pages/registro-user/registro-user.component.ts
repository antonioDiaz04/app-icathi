import { Component } from '@angular/core';

@Component({
  selector: 'app-registro-user',
  templateUrl: './registro-user.component.html',
  styleUrl: './registro-user.component.scss'
})
export class RegistroUserComponent {
  step: number = 1; // Controla el paso actual
  formData = {
    userType: '', // Tipo de usuario (alumno o docente)
    selection: '', // Selección del área o curso
  };

  // Opciones de selección
  availableOptions: string[] = [];

  // Avanzar al siguiente paso
  nextStep() {
    if (this.step === 1) {
      this.updateOptions();
    }
    this.step++;
  }

  // Retroceder al paso anterior
  previousStep() {
    this.step--;
  }

  // Actualizar las opciones disponibles según el tipo de usuario
  updateOptions() {
    if (this.formData.userType === 'alumno') {
      this.availableOptions = ['Matemáticas', 'Ciencias', 'Historia'];
    } else if (this.formData.userType === 'docente') {
      this.availableOptions = ['Docencia General', 'Investigación', 'Capacitación'];
    }
  }

  // Manejar el envío del formulario
  submitForm() {
    console.log('Formulario enviado:', this.formData);
    alert(`Formulario enviado: ${JSON.stringify(this.formData, null, 2)}`);
  }
}
