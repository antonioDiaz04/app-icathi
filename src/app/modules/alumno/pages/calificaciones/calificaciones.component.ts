import { Component } from '@angular/core';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss']
})
export class CalificacionesComponent {
  // Datos de materias disponibles
  materias = ['Matemáticas', 'Ciencias', 'Historia', 'Lengua y Literatura'];

  // Datos de calificaciones por materia
  calificaciones = [
    { nombre: 'Matemáticas', calificacion: 9, fechaExamen: '2024-05-20' },
    { nombre: 'Ciencias', calificacion: 7, fechaExamen: '2024-05-22' },
    { nombre: 'Historia', calificacion: 8, fechaExamen: '2024-05-24' },
    { nombre: 'Lengua y Literatura', calificacion: 9, fechaExamen: '2024-05-26' }
  ];

  // Materia seleccionada por el alumno
  selectedMateria: string = '';

  // Método para guardar la calificación del alumno
  guardarCalificacion(materia: any) {
    alert(`Calificación de ${materia.nombre} guardada: ${materia.calificacion}`);
    // Aquí agregaríamos la lógica para guardar los cambios en el servidor o base de datos
  }

  // Método para ver detalles de la calificación
  verDetalles(materia: any) {
    alert(`Ver detalles de ${materia.nombre}`);
    // Aquí podrías mostrar un modal o expandir más detalles sobre la materia
  }

  // Método para exportar las calificaciones a CSV
  exportarCalificaciones() {
    const csvContent = this.convertirACSV(this.calificaciones);
    this.descargarCSV(csvContent);
  }

  // Convertir las calificaciones a formato CSV
  convertirACSV(calificaciones: any[]) {
    const header = ['Materia', 'Calificación', 'Fecha de Examen'];
    const rows = calificaciones.map(materia => [materia.nombre, materia.calificacion, materia.fechaExamen]);
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
