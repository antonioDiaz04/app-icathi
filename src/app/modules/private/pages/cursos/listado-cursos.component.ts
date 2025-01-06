import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';

export interface Modulo {
  id: number;
  nombre: string;
  clave?: string;
  duracion_horas: number;
  descripcion: string;
  nivel: string;
  costo?: number;
  requisitos?: string;
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
    standalone: false
})
export class ListadoCursosComponent implements OnInit {
  modulos: Modulo[] = [];
  areas: any[] = [];
  especialidades: any[] = [];
  tiposCurso: any[] = [];
  mostrarFormulario = false;
  mostrarModal = false;
  mostrarDetalleModal = false; // Nueva variable para el modal de detalles
  cursoSeleccionado: Modulo | null = null;
  cursoDetalleSeleccionado: Modulo | null = null; // Curso seleccionado para ver detalles

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
  // `${environment.api}/user`;
  private apiUrl =  `${environment.api}`;

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

  // Métodos para ver detalles
  verDetalles(curso: Modulo): void {
    this.cursoDetalleSeleccionado = curso;
    this.mostrarDetalleModal = true;
  }

  cerrarDetalleModal(): void {
    this.mostrarDetalleModal = false;
    this.cursoDetalleSeleccionado = null;
  }

  // Métodos para obtener nombres a partir de IDs
  obtenerNombreArea(areaId: number | undefined): string {
    const area = this.areas.find(a => a.id === areaId);
    return area ? area.nombre : 'N/A';
  }

  obtenerNombreEspecialidad(especialidadId: number | undefined): string {
    const especialidad = this.especialidades.find(e => e.id === especialidadId);
    return especialidad ? especialidad.nombre : 'N/A';
  }

  obtenerNombreTipoCurso(tipoCursoId: number | undefined): string {
    const tipoCurso = this.tiposCurso.find(t => t.id === tipoCursoId);
    return tipoCurso ? tipoCurso.nombre : 'N/A';
  }
  // M


  
}