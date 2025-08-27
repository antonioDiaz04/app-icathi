import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface Curso {
  id: number;
  titulo: string;
  modalidad: string;     // ICATHI, Modalidad SEP, etc.
  horas: number;
  inicioISO: string;     // YYYY-MM-DD
}

@Component({
  selector: 'app-solicitar-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-curso.component.html',
  styleUrl: './solicitar-curso.component.scss'
})
export class SolicitarCursoComponent {
// Opciones de ejemplo (conéctalo luego a tu API)
  cursos: Curso[] = [
    { id: 1, titulo: 'Plomería Básica', modalidad: 'ICATHI', horas: 40, inicioISO: '2024-02-15' },
    { id: 2, titulo: 'Repostería Avanzada', modalidad: 'Modalidad SEP', horas: 60, inicioISO: '2024-02-20' },
    { id: 3, titulo: 'Electricidad Residencial', modalidad: 'Educación Virtual', horas: 50, inicioISO: '2024-02-25' },
  ];

  prioridades = [
    'Baja - Conveniente',
    'Media - Importante',
    'Alta - Urgente'
  ];

  // Estado del formulario (ngModel)
  formData = {
    cursoId: 1,
    prioridad: this.prioridades[1],
    justificacion: ''
  };

  // Utils
  get cursoSeleccionado(): Curso | undefined {
    return this.cursos.find(c => c.id === +this.formData.cursoId);
  }
  fechaCorta(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  // Envío (conecta aquí tu servicio)
  onSubmit(f: NgForm) {
    if (f.invalid) return;
    const payload = {
      ...this.formData,
      curso: this.cursoSeleccionado
    };
    console.log('Enviando solicitud:', payload);
    alert('¡Solicitud enviada con éxito!');
    f.resetForm({
      cursoId: this.cursos[0].id,
      prioridad: this.prioridades[1],
      justificacion: ''
    });
  }

  verCursos() {
    // RouterLink programático si lo deseas
    alert('Navegar a listado de cursos');
  }
}
