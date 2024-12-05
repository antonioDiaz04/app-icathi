import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Modulo {
  id: number;
  nombre: string;
  duracion_horas: number;
  descripcion: string;
  nivel: string; // Incluye el campo nivel
}

@Component({
  selector: 'app-listado-cursos',
  templateUrl: './listado-cursos.component.html',
  styleUrls: ['./listado-cursos.component.scss'],
})
export class ListadoCursosComponent implements OnInit {
  modulos: Modulo[] = [];
  mostrarFormulario = false;
  mostrarModal = false;
  cursoSeleccionado: Modulo | null = null;
  private apiUrl = 'http://localhost:3000/cursos'; // Cambia esta URL por la de tu backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarModulos();
  }

  cargarModulos(): void {
    this.http.get<Modulo[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.modulos = data.map((curso) => ({
          id: curso.id,
          nombre: curso.nombre,
          duracion_horas: curso.duracion_horas,
          descripcion: curso.descripcion,
          nivel: curso.nivel, // Asegúrate de mapear este campo
        }));
      },
      error: (err) => {
        console.error('Error al cargar los módulos:', err);
      },
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  agregarCurso(): void {
    console.log('Curso agregado');
  }

  editarCurso(curso: Modulo): void {
    this.cursoSeleccionado = { ...curso };
    this.mostrarModal = true;
  }

  guardarEdicion(): void {
    if (this.cursoSeleccionado) {
      const index = this.modulos.findIndex((m) => m.id === this.cursoSeleccionado!.id);
      if (index !== -1) {
        this.modulos[index] = { ...this.cursoSeleccionado };
      }

      this.http.put(`${this.apiUrl}/${this.cursoSeleccionado.id}`, this.cursoSeleccionado).subscribe({
        next: () => {
          console.log('Curso actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar el curso:', err);
        },
      });

      this.cerrarModal();
    }
  }

  eliminarCurso(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.modulos = this.modulos.filter((m) => m.id !== id);

      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          console.log('Curso eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar el curso:', err);
        },
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cursoSeleccionado = null;
  }
}