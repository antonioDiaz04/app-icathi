import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Modulo {
  id: number;
  nombre: string;
  duracion_horas: number;
  descripcion: string;
  nivel: string;
  clave?: string;
  costo?: number; // Agregada
  requisitos?: string; // Agregada
  area_id?: number;
  especialidad_id?: number;
  tipo_curso_id?: number;
  vigencia_inicio?: string;
  fecha_publicacion?: string;
  ultima_actualizacion?: string;
}

@Component({
  selector: 'app-listado-cursos',
  templateUrl: './listado-cursos.component.html',
  styleUrls: ['./listado-cursos.component.scss'],
})
export class ListadoCursosComponent implements OnInit {
  modulos: Modulo[] = [];
  areas: any[] = [];
  especialidades: any[] = [];
  tiposCurso: any[] = [];
  mostrarFormulario = false;
  mostrarModal = false;
  cursoSeleccionado: Modulo | null = null;

  nuevoCurso: Modulo = {
    id: 0,
    nombre: '',
    duracion_horas: 0,
    descripcion: '',
    nivel: '', // Inicializado como cadena vacía
    clave: '',
    area_id: undefined,
    especialidad_id: undefined,
    tipo_curso_id: undefined,
  };

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarModulos();
    this.cargarAreas();
    this.cargarEspecialidades();
    this.cargarTiposCurso();
  }

  cargarModulos(): void {
    this.http.get<Modulo[]>(`${this.apiUrl}/cursos`).subscribe({
      next: (data) => {
        this.modulos = data;
      },
      error: (err) => {
        console.error('Error al cargar los módulos:', err);
      },
    });
  }

  cargarAreas(): void {
    this.http.get<any[]>(`${this.apiUrl}/areas`).subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
      },
    });
  }

  cargarEspecialidades(): void {
    this.http.get<any[]>(`${this.apiUrl}/especialidades`).subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: (err) => {
        console.error('Error al cargar especialidades:', err);
      },
    });
  }

  cargarTiposCurso(): void {
    this.http.get<any[]>(`${this.apiUrl}/tiposCurso`).subscribe({
      next: (data) => {
        this.tiposCurso = data;
      },
      error: (err) => {
        console.error('Error al cargar tipos de curso:', err);
      },
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  agregarCurso(): void {
    console.log('Datos enviados al backend:', this.nuevoCurso); // Verifica el contenido
  
    this.http.post<Modulo>(`${this.apiUrl}/cursos`, this.nuevoCurso).subscribe({
      next: (cursoCreado) => {
        this.modulos.push(cursoCreado);
        this.nuevoCurso = {
          id: 0,
          nombre: '',
          duracion_horas: 0,
          descripcion: '',
          nivel: '', // Reinicia el campo después de enviar
          clave: '',
          area_id: undefined,
          especialidad_id: undefined,
          tipo_curso_id: undefined,
        };
        this.mostrarFormulario = false;
        console.log('Curso agregado correctamente');
      },
      error: (err) => {
        console.error('Error al agregar el curso:', err);
      },
    });
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

      this.http.put(`${this.apiUrl}/cursos/${this.cursoSeleccionado.id}`, this.cursoSeleccionado).subscribe({
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
    this.http.delete(`${this.apiUrl}/cursos/${id}`).subscribe({
      next: () => {
        this.modulos = this.modulos.filter((m) => m.id !== id); // Elimina el curso del array local
        console.log('Curso eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar el curso:', err); // Log del error
      },
    });
  }
}

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cursoSeleccionado = null;
  }
}