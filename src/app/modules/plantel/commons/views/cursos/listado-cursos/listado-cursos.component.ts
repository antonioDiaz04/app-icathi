import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService } from '../../../../../../shared/services/docente.service';
import { response } from 'express';
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
  // Otros campos que necesites
}

@Component({
  selector: 'app-listado-cursos',
  templateUrl: './listado-cursos.component.html',
})
export class ListadoCursosComponent implements OnInit {
  modulos: Modulo[] = [];
  docentes: Docente[] = [];
  // docente;
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
    // this.plantel_id = this.authService.getIdFromToken();
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
            this.modulos = data;
          },
          error: (err) => {
            console.error('Error al cargar los módulos:', err);
          },
        });
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

        // Crear un objeto con los datos necesarios para el backend
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
          plantel_id: plantelId, // Asignar el plantel ID al curso
        };

        console.log('Datos enviados al backend:', cursoData);

        // Enviar el objeto al servicio
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
    const cursoId = this.idCUrso; // Asumiendo que el ID del curso está en el objeto modulo
    console.log('docente=>', docenteId);
    console.log('curso=>', cursoId);
    if (docenteId && cursoId) {
      this.cursoDocenteS_.asignarDocenteACurso(docenteId, cursoId).subscribe(
        (response) => {
          console.log('Docente asignado:', response);
          this.closeModal();
        },
        (error) => {
          console.error('Error al asignar el docente:', error);
        }
      );
    } else {
      alert('Por favor, seleccione un docente.');
    }
  }
}
