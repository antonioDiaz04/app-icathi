import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  // Datos del docente
  docenteData = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    telefono: '123-456-7890'
  };

  // Método para enviar los datos
  onSubmit() {
    alert('Datos guardados correctamente');
    // Aquí iría la lógica para enviar los datos a un servicio o API
  }

  // Método para cancelar la edición
  cancelar() {
    alert('Edición cancelada');
    // Aquí podrías resetear el formulario o manejar la cancelación de forma adecuada
  }

  // Método para habilitar la edición (podrías agregar más lógica aquí si lo necesitas)
  editar() {
    alert('Editando información');
    // Aquí habilitarías el formulario o podrías hacer otras acciones
  }
}
