import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService } from '../../../../../../shared/services/docente.service';
import { response } from 'express';
import { CursosdocentesService } from '../../../../../../shared/services/cursosdocentes.service';
import { CursosService } from '../../../../../../shared/services/cursos.service';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
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

declare var $: any;
@Component({
  selector: 'app-listado-cursos',
  templateUrl: './listado-cursos.component.html',
  styles: `textarea{
    field-sizing:content;
  }

  `,
})
export class ListadoCursosComponent implements OnInit {
  cursosByEspecialidad: any[] = [];
  cursosSolicitados: Modulo[] = [];
  especialidadesByArea: any[] = [];
  modulosF: Modulo[] = [];
  modulosFiltrados: Modulo[] = [];
  docentes: Docente[] = [];
  // docente;
  areas: any[] = [];
  tiposCurso: any[] = [];
  mostrarFormulario = false;
  mostrarModal = false;
  mostrarDetalleModal = false; // Nueva variable para el modal de detalles
  cursoSeleccionado: Modulo | null = null;
  cursoDetalleSeleccionado: Modulo | null = null; // Curso seleccionado para ver detalles
  idCUrso: any;
  areaSelccionado: any;
  curso_id!: number;
  cursoForm: FormGroup;
  private apiUrl = `${environment.api}`;

  isLoading: boolean = false;
  isUploading: boolean = false; // Estado para saber si está cargando
  // progressPercent: number = 0;  // Porcentaje del progreso
  //
  // progressText: string = '0 of 100 done';  // Texto que muestra el progreso

  // private fakeProgress: any; // Variable para manejar el intervalo

  constructor(
    private docenteService: DocenteService,
    private http: HttpClient,
    private authService: AuthService,
    private cursosService: CursosService,
    private fb: FormBuilder
  ) {
    // this.plantel_id = this.authService.getIdFromToken();
    this.cursoForm = this.fb.group({
      especialidad_id: ['', Validators.required], // Especialidad (obligatoria)
      curso_id: ['', Validators.required], // Curso (obligatorio)
      horario: ['', Validators.required], // Horario (obligatorio)
      cupo_maximo: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)], // Cupo máximo (entre 1 y 100)
      ],
      requisitos_extra: [''], // Requisitos adicionales (opcional)
      fecha_inicio: ['', Validators.required], // Fecha de inicio (obligatoria)
      fecha_fin: ['', Validators.required], // Fecha de fin (obligatoria)
    });
  }

  ngOnInit(): void {
    this.cargarAreas();
  }

  isModalOpen = false;
  modulo: any = {};
  filtroId: string = '';
  filtroNombre: string = '';
  filtroNivel: string = '';
  filtroDuracion: number | null = null; // Puede ser null para indicar que no hay filtro
  // this.filtroDocente = docenteId;

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

  filtrarModulos(): void {
    this.cursosSolicitados = this.cursosSolicitados.filter((modulo) => {
      const matchesId = this.filtroId
        ? modulo.id.toString().includes(this.filtroId)
        : true;
      const matchesNombre = this.filtroNombre
        ? modulo.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        : true;
      const matchesNivel = this.filtroNivel
        ? modulo.nivel.toLowerCase().includes(this.filtroNivel.toLowerCase())
        : true;
      const matchesDuracion =
        this.filtroDuracion !== null
          ? modulo.duracion_horas === this.filtroDuracion
          : true;

      return matchesId && matchesNombre && matchesNivel && matchesDuracion;
    });
  }

  cargarAreas(): void {
    this.isLoading=true
    this.http.get<any[]>(`${this.apiUrl}/areas`).subscribe({
      next: (data) => {
        this.areas = data;
        this.isLoading=false
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
      },
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  // en la tabla,solicitamos el curso seleccionando el area
  solicitarCurso(areaId: number): void {
    this.mostrarFormulario = true;
    this.getEspecialidadesByAreaId(areaId);
  }
  // en el modal obtenemos las especialidades por el area seleccionado
  // "http://localhost:3000/especialidades/byAreaId/{areaId}"
  getEspecialidadesByAreaId(areaId: number) {
    this.cursosService.getEspecialidadesByAreaId(areaId).subscribe(
      (especialidades) => {
        this.especialidadesByArea = especialidades;
      },
      (error) => {
        console.error('Error al obtener las especialidades:', error);
      }
    );
  }

  // carga nuevamente los cursos al cambiar de especialidad
  onEspecialidadChange(event: Event): void {
    const especialidadId = Number((event.target as HTMLSelectElement).value); // Obtener el ID de la especialidad seleccionada
    if (!isNaN(especialidadId)) {
      this.getCursosByEspecialidadId(especialidadId); // Cargar cursos relacionados
    } else {
      console.warn('Especialidad no válida seleccionada.');
    }
  }

  // obtiene los cursos por especialidad seleccionado
  // http://localhost:3000/cursos/byEspecialidadId/{especialidadId}
  getCursosByEspecialidadId(especialidadId: number): void {
    this.authService.getIdFromToken().then((plantelId) => {
      if (!plantelId) {
        console.error('No se pudo obtener el ID del plantel');
        return;
      }

      this.cursosService
        .getCursosByEspecialidadId(especialidadId, plantelId)
        .subscribe(
          (cursos) => {
            this.cursosByEspecialidad = cursos; // Actualizar los cursos disponibles
          },
          (error) => {
            console.error('Error al obtener los cursos:', error);
          }
        );
    });
  }

  enviarSolicitud(): void {
    console.log('Inicio de la solicitud');
    this.isLoading = true;
    if (!this.cursoForm.valid) {
      this.isLoading = false;
      console.error('El formulario contiene errores o campos vacíos');
      return;
    }

    this.authService
      .getIdFromToken()
      .then((plantelId) => {
        if (!plantelId) {
          console.error('No se pudo obtener el ID del plantel');
          return;
        }

        const formData = new FormData();
        formData.append(
          'especialidad_id',
          this.cursoForm.value.especialidad_id
        );
        formData.append('plantelId', plantelId.toString());
        formData.append('curso_id', this.cursoForm.value.curso_id);
        formData.append('horario', this.cursoForm.value.horario);
        formData.append('cupo_maximo', this.cursoForm.value.cupo_maximo);
        formData.append(
          'requisitos_extra',
          this.cursoForm.value.requisitos_extra
        );
        formData.append('fecha_inicio', this.cursoForm.value.fecha_inicio);
        formData.append('temario', this.selectedFile);
        formData.append('fecha_fin', this.cursoForm.value.fecha_fin);
        console.log('Datos enviados al backend:', formData);

        // Enviar el objeto al servicio
        this.http
          .post<Modulo>(`${this.apiUrl}/planteles-curso`, formData)
          .subscribe({
            next: (cursoCreado) => {
              this.cursosSolicitados.push(cursoCreado);
              this.mostrarFormulario = false;
              this.isLoading = false;
              this.cursoForm.reset();
              console.log('Curso agregado correctamente:', cursoCreado);
            },
            error: (err) => {
              console.error('Error al agregar el curso:', err);
              this.isLoading = false;
            },
          });
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('Error al obtener el ID del plantel:', error);
      });
  }

  cancelarSolicitud(adi: any) {}

  // Métodos para ver detalles
  verDetalles(curso: Modulo): void {
    this.cursoDetalleSeleccionado = curso;
    this.mostrarDetalleModal = true;
  }

  cerrarDetalleModal(): void {
    this.mostrarDetalleModal = false;
    this.cursoDetalleSeleccionado = null;
  }

  //*************************FILE */}
  selectedFile: File | any = null;
  // isUploading = false;
  fileExtension: string = '';

  // Evento cuando se selecciona un archivo

  // Subir el archivo
  // uploadFile(file: File): void {
  //   console.log(file);
  // }

  // Eliminar archivo
  removeFile(): void {
    this.url = '';
    this.selectedFile = null;
    this.fileExtension = '';
  }

  // Obtener la extensión del archivo
  getFileExtension(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ext;
  }

  // Manejar eventos de arrastre
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileExtension = this.getFileExtension(file.name);
      // this.uploadFile(file);
    }
  }

  onDragLeave(event: DragEvent): void {
    // Se puede agregar algún efecto visual para cuando el archivo sale del área
  }
  url: any = '';

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileExtension = this.getFileExtension(file.name);

      // For PDF files, load the file into the viewer
      if (this.fileExtension === 'pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          this.url = reader.result as string; // This will hold the base64 string of the PDF
        };
        reader.readAsDataURL(file);
      }
    }
  }

  page: number = 1;
  totalPages!: number;
  isLoaded: boolean = false;

  callbackFn(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
    this.isLoaded = true;
  }

  nextTep() {
    this.page++;
  }
  prevTep() {
    this.page--;
  }

  // }
}
