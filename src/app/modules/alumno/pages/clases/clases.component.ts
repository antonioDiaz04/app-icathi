import { Component } from '@angular/core';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss']
})
export class ClasesComponent {
  cursos = [
    {
      id: 1,
      nombre: 'Curso de Panadería Básica',
      descripcion: 'Aprende las bases de la panadería y horneado.',
      progreso: 75,
      estado: 'En progreso',
      detalles: 'Detalles del curso sobre técnicas básicas de panadería.',
    },
    {
      id: 2,
      nombre: 'Curso de Pastelería Avanzada',
      descripcion: 'Domina técnicas avanzadas para pastelería de alta gama.',
      progreso: 45,
      estado: 'En progreso',
      detalles: 'Incluye técnicas de decoración y fondant.',
    },
    {
      id: 3,
      nombre: 'Curso de Gelatinas Artísticas',
      descripcion: 'Crea gelatinas decorativas para eventos especiales.',
      progreso: 100,
      estado: 'Completado',
      detalles: 'Incluye técnicas de gelatina en 3D.',
    },
  ];

  verDetalles(cursoId: number) {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      alert(`Detalles del curso: ${curso.detalles}`);
    }
  }
}
