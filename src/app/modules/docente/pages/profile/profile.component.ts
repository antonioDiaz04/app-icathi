import { Component } from '@angular/core';
import { DocenteDataService } from '../../commons/services/docente-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  // docenteData = {
  //   nombre: '',
  //   apellidos: '',
  //   telefono: '',
  //   foto_url: ''
  // };
  isEditing = false;

  // editarPerfil() {
  //   this.isEditing = true;
  // }

  cancelarEdicion() {
    this.isEditing = false;
    // Restablecer los datos al estado original si es necesario
  }

  guardarCambios() {
    // Lógica para guardar los cambios del docente
    console.log('Datos guardados:', this.docenteData);
    this.isEditing = false;
  }

  onFileSelected(event: any) {
    // Manejar la carga de una nueva foto
    const file = event.target.files[0];
    if (file) {
      this.docenteData.foto_url = URL.createObjectURL(file);
    }
  }
  constructor(public docenteDataService: DocenteDataService) {}

  // Si necesitas usar los datos del docente en alguna función adicional
  get docenteData() {
    return this.docenteDataService.docenteData;
  }

  // Métodos para manejar la acción de editar y ver clases
  editarPerfil() {
    this.isEditing=true
    console.log("Editar perfil");
    // Aquí puedes implementar la lógica para editar el perfil del docente
  }

  verClases() {
    console.log("Ver clases");
    // Aquí puedes implementar la lógica para ver las clases del docente
  }
}
