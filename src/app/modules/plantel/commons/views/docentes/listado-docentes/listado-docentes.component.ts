import { Component } from '@angular/core';

@Component({
  selector: 'app-listado-docentes',
  templateUrl: './listado-docentes.component.html',
  styles: [`
    #addModal {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `],
})
export class ListadoDocentesComponent {
  // Variables de filtro
  textoBusqueda: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  // Control del modal
  esModalVisible: boolean = false;

  // Modelo para el nuevo docente
  nuevoDocente = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    especialidad: '',
    estatus: 'Activo',
  };

  // Datos de ejemplo
  docentes = [
    {
      id: '#101',
      nombre: 'Carlos',
      apellidos: 'Pérez',
      email: 'carlos.perez@example.com',
      telefono: '123456789',
      especialidad: 'Matemáticas',
      estatus: 'Activo',
    },
    {
      id: '#102',
      nombre: 'María',
      apellidos: 'López',
      email: 'maria.lopez@example.com',
      telefono: '987654321',
      especialidad: 'Ciencias',
      estatus: 'Inactivo',
    },
  ];

  // Filtrar docentes
  docentesFiltrados() {
    return this.docentes.filter(docente => {
      const coincideBusqueda =
        docente.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        docente.apellidos.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      const coincideFecha = true; // Puedes agregar filtro por fechas si lo necesitas
      return coincideBusqueda && coincideFecha;
    });
  }

  // Abrir/Cerrar modal
  abrirModal() {
    this.esModalVisible = true;
  }

  cerrarModal() {
    this.esModalVisible = false;
  }

  // Agregar docente
  agregarDocente() {
    this.docentes.push({
      ...this.nuevoDocente,
      id: `#${Math.floor(Math.random() * 10000)}`,
    });
    this.nuevoDocente = {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      especialidad: '',
      estatus: 'Activo',
    };
    this.cerrarModal();
  }
}
