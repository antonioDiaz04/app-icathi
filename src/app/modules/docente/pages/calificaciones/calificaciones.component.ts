import { Component } from '@angular/core';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss']
})
export class CalificacionesComponent {
  // Datos de materias disponibles
  materias = ['Matemáticas', 'Ciencias', 'Historia', 'Lengua y Literatura'];

  // Datos de estudiantes con sus calificaciones y promedios
  estudiantes = [
    { nombre: 'Juan Pérez', calificacion: 9, promedio: 8.5 },
    { nombre: 'Ana López', calificacion: 7, promedio: 7.8 },
    { nombre: 'Carlos García', calificacion: 8, promedio: 8.3 },
    { nombre: 'María Fernández', calificacion: 9, promedio: 9.1 }
  ];

  // Materia seleccionada por el docente
  selectedMateria: string = '';

  // Método para guardar la calificación del estudiante
  guardarCalificacion(estudiante: any) {
    alert(`Calificación de ${estudiante.nombre} guardada: ${estudiante.calificacion}`);
    // Aquí agregaríamos la lógica para guardar los cambios en el servidor o base de datos
  }

  // Método para ver detalles del estudiante
  verDetalles(estudiante: any) {
    alert(`Ver detalles de ${estudiante.nombre}`);
    // Aquí mostraríamos más detalles sobre el estudiante
  }

  // Método para exportar las calificaciones a CSV
  exportarCalificaciones() {
    const csvContent = this.convertirACSV(this.estudiantes);
    this.descargarCSV(csvContent);
  }

  // Convertir los datos de estudiantes a formato CSV
  convertirACSV(estudiantes: any[]) {
    const header = ['Nombre', 'Calificación', 'Promedio'];
    const rows = estudiantes.map(estudiante => [estudiante.nombre, estudiante.calificacion, estudiante.promedio]);
    const csv = [header, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  // Descargar el archivo CSV generado
  descargarCSV(csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'calificaciones.csv';
    link.click();
  }
}
