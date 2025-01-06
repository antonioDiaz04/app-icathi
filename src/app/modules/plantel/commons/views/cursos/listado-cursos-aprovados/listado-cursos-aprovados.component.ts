import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService } from '../../../../../../shared/services/docente.service';
import { CursosdocentesService } from '../../../../../../shared/services/cursosdocentes.service';
import { AspiranteService } from '../../../../../../shared/services/aspirante.service';
import { PlantelService } from '../../../../../../shared/services/plantel.service';
// import { response } from 'express';

export interface Modulo {
  plantel: string;
  curso: number;
  nombre: string;
  clave?: string;
  duracion_horas: number;
  descripcion: string;
  nivel: string;
  costo?: number;
  requisitos?: string;
  isvalidado?: string;
  nombrearea: string;
  nombreespecialidad?: string;
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
  apellidos: string;
  especialidad: string;
  cedula_profesional: boolean;
  certificado_profesional: boolean;
  estatus_valor: boolean;
}

@Component({
    selector: 'app-listado-cursos-aprovados',
    templateUrl: './listado-cursos-aprovados.component.html',
    standalone: false
})
export class ListadoCursosAprovadosComponent implements OnInit {
  dateFormat = 'yyyy-MM-dd'; // Formato de fecha
  monthFormat = 'yyyy-MM'; // Formato de mes
  quarterFormat = 'yyyy-[Q]Q'; // Formato de trimestre

  modulos: Modulo[] = [];
  modulosFiltrados: Modulo[] = [];
  docentes: any[] = [];
  areas: any[] = [];
  especialidades: any[] = [];
  tiposCurso: any[] = [];
  mostrarFormulario = false;
  mostrarModal = false;
  alumnos: any = [];

  mostrarDetalleModal = false; // Nueva variable para el modal de detalles
  cursoSeleccionado: Modulo | null = null;
  cursoDetalleSeleccionado: number | null = null; // Curso seleccionado para ver detalles
  curso: any;
  cursosSolicitados: any;
  // dataCurso: any;

  cursoDetails!: any;
  abrirModalDetalles(modulo: any) {
    this.cursoSeleccionado = { ...modulo };
    this.mostrarModal = true;
  }

  // cursoForm: FormGroup;
  private apiUrl = `${environment.api}`;
  filtro: 'todos' | 'validados' | 'no-validados' = 'todos';
  @ViewChild('docenteInput') docenteInput!: ElementRef;

  constructor(
    private docenteService: DocenteService,
    private http: HttpClient,
    private aspirantesService: AspiranteService,
    private plantelService: PlantelService,
    private authService: AuthService,
    private cursoDocenteS_: CursosdocentesService,
    private fb: FormBuilder
  ) {
    // this.cursoForm = this.fb.group({
    //   plantel_curso_id: [''],
    //   plantel_id: [''],
    //   plantel_nombre: [''],
    //   curso_id: [''],
    //   curso_nombre: [''],
    //   fecha_inicio: [''],
    //   fecha_fin: [''],
    //   area_id: [''],
    //   area_nombre: [''],
    //   especialidad_id: [''],
    //   especialidad_nombre: [''],
    //   alumnos: this.fb.array([]),
    // });

  // this.cursoForm = this.fb.group({
    // area_id: ['', Validators.required],
      // especialidad_id: ['', Validators.required],
      // tipo_curso_id: ['', Validators.required],
      // nombre: ['', [Validators.required, Validators.maxLength(100)]],
      // clave: ['', Validators.required],
      // duracion_horas: ['', [Validators.required, Validators.min(1)]],
      // descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      // nivel: ['', Validators.required],
    // });
  }

      // get alumnos(): FormArray {
      //   return this.cursoForm.get('alumnos') as FormArray;
      // }

  ngOnInit(): void {
    this.cargarCursosByIdPlantel();
    // this.getInfo();
    // this.getDocentes();
    this.cargarAreas();
    // this.getAlumnos();

    this.cargarEspecialidades();
    this.cargarTiposCurso();
  }
  textoBusqueda: string = '';
  isLoading = false;
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

  openModal(idPlantelCurso: any) {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.plantelService
      .getInfoCursoPlantel(idPlantelCurso)
      .subscribe((response) => {
        this.alumnos = response.alumnos;
        this.docentes = response.docentes;
        this.curso = response.curso;

        // Acceder directamente al id del curso
        const curso = response.curso; // Cambiado de response.curso[0].id a response.curso.id
        this.curso = curso; // Asignar el idCurso a this.idCUrso

        console.log(curso); // Imprimir el id del curso
      });
  }

  closeModal() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  // getDocentes() {
  //   this.docenteService.getDocentes().subscribe((response) => {

  //   });
  // }

  cargarCursosByIdPlantel(): void {
    this.isLoading = true;
    this.authService.getIdFromToken().then((plantelId) => {
      console.log('Plantel ID:', plantelId);

      if (!plantelId) {
        console.error('No se pudo obtener el ID del plantel');
        this.isLoading = false;
        return;
      }

      this.http
        .get<Modulo[]>(
          `${this.apiUrl}/planteles-curso/byIdPlantel/${plantelId}`
        )
        .subscribe({
          next: (data) => {
            this.cursosSolicitados = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error al cargar los módulos:', err);
            this.isLoading = false;
          },
        });
    });
  }

  get cursosFiltrados() {
    if (this.filtro === 'validados') {
      return this.cursosSolicitados.filter(
        (curso: any) => curso.curso_validado
      );
    } else if (this.filtro === 'no-validados') {
      return this.cursosSolicitados.filter(
        (curso: any) => !curso.curso_validado
      );
    }
    return this.cursosSolicitados;
  }

  filtrarCursos(tipo: 'todos' | 'validados' | 'no-validados') {
    this.filtro = tipo;
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

  // agregarCurso(): void {
  //   this.authService
  //     .getIdFromToken()
  //     .then((plantelId) => {
  //       console.log('Plantel ID:', plantelId);

  //       if (!plantelId) {
  //         console.error('No se pudo obtener el ID del plantel');
  //         return;
  //       }

  //       const cursoData = {
  //         id: 0,
  //         nombre: this.cursoForm.get('nombre')?.value,
  //         duracion_horas: this.cursoForm.get('duracion_horas')?.value,
  //         descripcion: this.cursoForm.get('descripcion')?.value,
  //         nivel: this.cursoForm.get('nivel')?.value,
  //         clave: this.cursoForm.get('clave')?.value,
  //         area_id: this.cursoForm.get('area_id')?.value,
  //         especialidad_id: this.cursoForm.get('especialidad_id')?.value,
  //         tipo_curso_id: this.cursoForm.get('tipo_curso_id')?.value,
  //         plantel_id: plantelId,
  //       };

  //       console.log('Datos enviados al backend:', cursoData);

  //       this.http.post<Modulo>(`${this.apiUrl}/cursos`, cursoData).subscribe({
  //         next: (cursoCreado) => {
  //           this.modulos.push(cursoCreado);
  //           this.mostrarFormulario = false;
  //           console.log('Curso agregado correctamente');
  //         },
  //         error: (err) => {
  //           console.error('Error al agregar el curso:', err);
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error al obtener el ID del plantel:', error);
  //     });
  // }

  editarCurso(curso: Modulo): void {
    this.cursoSeleccionado = { ...curso };
    this.mostrarModal = true;
  }

  eliminarSolicitudCurso(idPlantelCurso: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.http
        .delete(`${this.apiUrl}/planteles-curso/byIdPlantel/${idPlantelCurso}`)
        .subscribe(
          (response) => {
            this.cargarCursosByIdPlantel();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  // Filtrar docentes
  docentesFiltrados() {
    return this.docentes.filter((docente) => {
      const coincideBusqueda =
        docente.nombre
          .toLowerCase()
          .includes(this.textoBusqueda.toLowerCase()) ||
        docente.apellidos
          .toLowerCase()
          .includes(this.textoBusqueda.toLowerCase());
      const coincideFecha = true; // Puedes agregar filtro por fechas si lo necesitas
      return coincideBusqueda && coincideFecha;
    });
  }

  cerrarModal(): void {
    this.mostrarDetalleModal = false;
    this.cursoSeleccionado = null;
  }
  verDetalles(plantelCurso: any): void {
    this.plantelService.getInfoCursoPlantelByiD(plantelCurso).subscribe((detalles) => {
      // if (detalles && detalles.curso && detalles.curso.length > 0) {
        this.cursoDetails = detalles;
        this.mostrarDetalleModal=true
      // }
    });
  }

  // verDetalles(plantelCurso: any): void {
  //   this.cursoDetalleSeleccionado = plantelCurso;

  //   // this.authService.getIdFromToken().then((idPlantelCurso) => {
  //     this.plantelService
  //       .getInfoCursoPlantelByiD(plantelCurso)
  //       .subscribe((detalails) => {
  //         this.cursoDetails = detalails;
  //         const mappedDetails = {
  //           curso_id: this.cursoDetails.id,
  //           curso_nombre: this.cursoDetails.nombre,
  //           docente_asignado: this.cursoDetails.docente
  //         };
  //         this.cursoForm.patchValue(mappedDetails);
  //       });
  //   // });

  // }
  actualizarCurso() {
    const index = this.cursosFiltrados.findIndex(
      (curso: any) => curso.id === this.cursoSeleccionado?.curso
    );
    if (index !== -1) {
      this.cursosFiltrados[index] = { ...this.cursoSeleccionado };
    }
    this.cerrarModal();
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

  asignarDocente() {
    // const docenteId = Number(modulo.id);
    const cursoId = this.curso;

    const selectedDocenteId = this.docenteInput.nativeElement.value;
    // Aquí puedes hacer lo que necesites con el ID del docente seleccionado
    console.log('Docente seleccionado:', selectedDocenteId);

    console.log('docente=>', selectedDocenteId);
    console.log('curso=>', cursoId.id);
    if (selectedDocenteId && cursoId) {
      this.cursoDocenteS_
        .asignarDocenteACurso(selectedDocenteId, cursoId.id)
        .subscribe(
          (response) => {
            console.log('Docente asignado:', response);
            this.closeModal();
            this.cargarCursosByIdPlantel();
          },
          (error) => {
            console.error('Error al asignar docente:', error);
          }
        );
    }
  }
}
