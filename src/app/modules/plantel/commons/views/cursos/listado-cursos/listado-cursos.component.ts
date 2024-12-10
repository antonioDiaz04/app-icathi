import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-listado-cursos',
  templateUrl: './listado-cursos.component.html',
  // styleUrls: ['./listado-cursos.component.css'], // O usa SCSS si prefieres
})
export class ListadoCursosComponent {
  // Variables de filtro
  textoBusqueda: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  // Control del modal
  esModalVisible: boolean = false;

  // Curso seleccionado
  cursoSeleccionado: any = null;

  // Modelo para el nuevo curso
  nuevoCurso = {
    nombreCurso: '',
    nombreProfesor: '',
    estado: 'Activo',
  };

  // Datos de ejemplo
  cursosProfesores = [
    { id: '#20132', nombreCurso: 'Matemáticas', nombreProfesor: 'John Doe', fechaAsignacion: '2024-05-01', estado: 'Activo' },
    { id: '#20133', nombreCurso: 'Ciencia', nombreProfesor: 'Alice Smith', fechaAsignacion: '2024-06-15', estado: 'Inactivo' },
    { id: '#20134', nombreCurso: 'Historia', nombreProfesor: 'Mark Johnson', fechaAsignacion: '2024-07-20', estado: 'Activo' },
    { id: '#20135', nombreCurso: 'Geografía', nombreProfesor: 'Emma White', fechaAsignacion: '2024-08-05', estado: 'Inactivo' },
  ];

  // Filtros dinámicos
  cursosProfesoresFiltrados() {
    return this.cursosProfesores.filter(cursoProfesor => {
      const coincideBusqueda = cursoProfesor.nombreProfesor.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
                               cursoProfesor.nombreCurso.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      const coincideFechaInicio = this.fechaInicio ? new Date(cursoProfesor.fechaAsignacion) >= new Date(this.fechaInicio) : true;
      const coincideFechaFin = this.fechaFin ? new Date(cursoProfesor.fechaAsignacion) <= new Date(this.fechaFin) : true;
      return coincideBusqueda && coincideFechaInicio && coincideFechaFin;
    });
  }

  // Función para abrir/cerrar el modal
  abrirModal() {
    this.esModalVisible = true;
  }

  cerrarModal() {
    this.esModalVisible = false;
  }

  // Función para agregar un curso
  agregarCurso() {
    this.cursosProfesores.push({
      id: `#20${Math.floor(Math.random() * 10000)}`, // Genera un ID aleatorio
      nombreCurso: this.nuevoCurso.nombreCurso,
      nombreProfesor: this.nuevoCurso.nombreProfesor,
      fechaAsignacion: new Date().toISOString().split('T')[0], // Fecha actual
      estado: this.nuevoCurso.estado,
    });
    this.cerrarModal(); // Cierra el modal
  }

  // Función para alternar el menú de acciones
  abrirMenuAccion(cursoProfesor: any) {
    this.cursoSeleccionado = this.cursoSeleccionado === cursoProfesor ? null : cursoProfesor;
  }
}
