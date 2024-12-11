import { Component } from '@angular/core';

@Component({
  selector: 'app-registro-user',
  templateUrl: './registro-user.component.html',
  styleUrls: ['./registro-user.component.scss']
})
export class RegistroUserComponent {
  step: number = 1;
  formData = {
    plantel: '', // Añade esta propiedad
    categoria: '',
    curso: '',
    name: '',
    curp: '',
    email: '',
    telefono: ''
  };
  isModalOpen = false;


  availableOptions: string[] = [];
  // Acción de "Corregir" (redirigir a la edición)
  editData() {
    this.closeModal();
    // Aquí podrías redirigir o permitir editar los datos
    console.log('Corregir información');
  }

  // Abre el modal
  openModal() {
    console.log("click")
    this.isModalOpen = true;
  }

  // Cierra el modal
  closeModal() {
    this.isModalOpen = false;
  }

  proceed() {
    this.closeModal();
    // Procede con el siguiente paso, por ejemplo, enviar el formulario
    console.log('Datos confirmados, proceder');
    // Cambiar el paso en el formulario
    this.step = 1;  // Por ejemplo, pasar al paso 4
  }
  submitForm() {
    console.log('Datos enviados:', this.formData);
    alert('Registro completado con éxito');
  }
}
