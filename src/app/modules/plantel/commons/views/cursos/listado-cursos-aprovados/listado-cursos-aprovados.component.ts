import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService } from '../../../../../../shared/services/docente.service';
import { CursosdocentesService } from '../../../../../../shared/services/cursosdocentes.service';

export interface Modulo {
  id: number;
  nombre: string;
  clave?: string;
  duracion_horas: number;
  descripcion: string;
  nivel: string;
  costo?: number;
  requisitos?: string;
  estatus?: string;
  area_id?: number;
  especialidad_id?: number;
  tipo_curso_id?: number;
  vigencia_inicio?: string;
  fecha_publicacion?: string;
  ultima_actualizacion?: string;
  plantel_id: number;
  docente_asignado: string;
}

interface Docente {
  id: number;
  nombre: string;
  estatus: boolean;
}

@Component({
  selector: 'app-listado-cursos-aprovados',
  templateUrl: './listado-cursos-aprovados.component.html',
})
export class ListadoCursosAprovadosComponent implements OnInit {
  modulos: Modulo[] = [];
  modulosFiltrados: Modulo[] = [];
  docentes: Docente[] = [];
  areas: any[] = [];
  especialidades: any[] = [];
  tiposCurso: any[] = [];
  mostrarFormulario = false;
  mostrarModal = false;
  mostrarDetalleModal = false; // Nueva variable para el modal de detalles
  cursoSeleccionado: Modulo | null = null;
  cursoDetalleSeleccionado: Modulo | null = null; // Curso seleccionado para ver detalles
  idCUrso: any;
  cursoForm: FormGroup;
  private apiUrl = `${environment.api}`;

  constructor(
    private docenteService: DocenteService,
    private http: HttpClient,
    private authService: AuthService,
    private cursoDocenteS_: CursosdocentesService,
    private fb: FormBuilder
  ) {
    this.cursoForm = this.fb.group({
      area_id: ['', Validators.required],
      especialidad_id: ['', Validators.required],
      tipo_curso_id: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      clave: ['', Validators.required],
      duracion_horas: ['', [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      nivel: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarCursosByIdPlantel();
    this.getDocentes();
    this.cargarAreas();
    this.cargarEspecialidades();
    this.cargarTiposCurso();
  }

  isModalOpen = false;
  modulo: any = {};
  filtroId: string = '';
  filtroNombre: string = '';
  filtroNivel: string = '';
  filtroDuracion: number | null = null; // Puede ser null para indicar que no hay filtro
  
  // Función para reiniciar filtros
  resetFilters() {
    this.filtroId = '';
    this.filtroNombre = '';
    this.filtroNivel = '';
    this.filtroDuracion = null;
  }

  openModal(idCurso: any) {
    this.idCUrso = idCurso;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getDocentes() {
    this.docenteService.getDocentes().subscribe(
      (response) => {
        this.docentes = response.filter(
          (docente: Docente) => docente.estatus === true
        );
      },
      (error) => {
        alert('Ocurrió un error en la consulta:');
      }
    );
  }

  cargarCursosByIdPlantel(): void {
    this.authService.getIdFromToken().then((plantelId) => {
      console.log('Plantel ID:', plantelId);
  
      if (!plantelId) {
        console.error('No se pudo obtener el ID del plantel');
        return;
      }
  
      this.http
        .get<Modulo[]>(`${this.apiUrl}/planteles-curso/byIdPlantel/${plantelId}`)
        .subscribe({
          next: (data) => {
            // Filtrar solo los módulos con estatus verdadero y con docente asignado
            this.modulos = data.filter(modulo => modulo.estatus && modulo.docente_asignado !== '0');
            this.modulosFiltrados = [...this.modulos]; // Asignar los módulos filtrados
            this.filtrarModulos(); // Llama a la función de filtrado si es necesario
          },
          error: (err) => {
            console.error('Error al cargar los módulos:', err);
          },
        });
    });
  }
  
  

  filtrarModulos(): void {
    this.modulos = this.modulos.filter(modulo => {
      const matchesId = this.filtroId ? modulo.id.toString().includes(this.filtroId) : true;
      const matchesNombre = this.filtroNombre ? modulo.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) : true;
      const matchesNivel = this.filtroNivel ? modulo.nivel.toLowerCase().includes(this.filtroNivel.toLowerCase()) : true;
      const matchesDuracion = this.filtroDuracion !== null ? modulo.duracion_horas === this.filtroDuracion : true;

      return matchesId && matchesNombre && matchesNivel && matchesDuracion;
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
    this.authService
      .getIdFromToken()
      .then((plantelId) => {
        console.log('Plantel ID:', plantelId);

        if (!plantelId) {
          console.error('No se pudo obtener el ID del plantel');
          return;
        }

        const cursoData = {
          id: 0,
          nombre: this.cursoForm.get('nombre')?.value,
          duracion_horas: this.cursoForm.get('duracion_horas')?.value,
          descripcion: this.cursoForm.get('descripcion')?.value,
          nivel: this.cursoForm.get('nivel')?.value,
          clave: this.cursoForm.get('clave')?.value,
          area_id: this.cursoForm.get('area_id')?.value,
          especialidad_id: this.cursoForm.get('especialidad_id')?.value,
          tipo_curso_id: this.cursoForm.get('tipo_curso_id')?.value,
          plantel_id: plantelId,
        };

        console.log('Datos enviados al backend:', cursoData);

        this.http.post<Modulo>(`${this.apiUrl}/cursos`, cursoData).subscribe({
          next: (cursoCreado) => {
            this.modulos.push(cursoCreado);
            this.mostrarFormulario = false;
            console.log('Curso agregado correctamente');
          },
          error: (err) => {
            console.error('Error al agregar el curso:', err);
          },
        });
      })
      .catch((error) => {
        console.error('Error al obtener el ID del plantel:', error);
      });
  }

  editarCurso(curso: Modulo): void {
    this.cursoSeleccionado = { ...curso };
    this.mostrarModal = true;
  }

  guardarEdicion(): void {
    if (this.cursoSeleccionado) {
      const index = this.modulos.findIndex(
        (m) => m.id === this.cursoSeleccionado!.id
      );
      if (index !== -1) {
        this.modulos[index] = { ...this.cursoSeleccionado };
      }

      this.http
        .put(
          `${this.apiUrl}/cursos/${this.cursoSeleccionado.id}`,
          this.cursoSeleccionado
        )
        .subscribe({
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
          this.modulos = this.modulos.filter((m) => m.id !== id);
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

  verDetalles(curso: Modulo): void {
    this.cursoDetalleSeleccionado = curso;
    this.mostrarDetalleModal = true;
  }

  cerrarDetalleModal(): void {
    this.mostrarDetalleModal = false;
    this.cursoDetalleSeleccionado = null;
  }

  obtenerNombreArea(areaId: number | undefined): string {
    const area = this.areas.find((a) => a.id === areaId);
    return area ? area.nombre : 'N/A';
  }

  obtenerNombreEspecialidad(especialidadId: number | undefined): string {
    const especialidad = this.especialidades.find(
      (e) => e.id === especialidadId
    );
    return especialidad ? especialidad.nombre : 'N/A';
  }

  obtenerNombreTipoCurso(tipoCursoId: number | undefined): string {
    const tipoCurso = this.tiposCurso.find((t) => t.id === tipoCursoId);
    return tipoCurso ? tipoCurso.nombre : 'N/A';
  }

  asignarDocente(modulo: any) {
    const docenteId = Number(modulo.docenteSeleccionado);
    const cursoId = this.idCUrso; 
    console.log('docente=>', docenteId);
    console.log('curso=>', cursoId);
    if (docenteId && cursoId) {
      this.cursoDocenteS_.asignarDocenteACurso(docenteId, cursoId).subscribe(
        (response) => {
          console.log('Docente asignado:', response);
          this.closeModal();
        },
        (error) => {
          console.error('Error al asignar docente:', error);
        }
      );
    }
  }
}
