import { Component, Input, OnInit } from '@angular/core';
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
    standalone: false
})
export class ListadoCursosComponent implements OnInit {
  // cursosByEspecialidad: any[] = [];
  cursosSolicitados: Modulo[] = [];
  // especialidadesByArea: any[] = [];
  modulosF: Modulo[] = [];
  modulosFiltrados: Modulo[] = [];
  docentes: Docente[] = [];
  // docente;
  areas: any[] = [];
  tiposCurso: any[] = [];
  // mostrarFormulario = false;
  mostrarModal = false;
  mostrarDetalleModal = false; // Nueva variable para el modal de detalles
  cursoSeleccionado: Modulo | null = null;
  cursoDetalleSeleccionado: Modulo | null = null; // Curso seleccionado para ver detalles
  idCUrso: any;
  areaSelccionado: any;
  curso_id!: number;
  // cursoForm: FormGroup;
  private apiUrl = `${environment.api}`;
  details:any;
  isLoading: boolean = false;
  isUploading: boolean = false; // Estado para saber si está cargando
  // progressPercent: number = 0;  // Porcentaje del progreso
  //
  // progressText: string = '0 of 100 done';  // Texto que muestra el progreso

  // private fakeProgress: any; // Variable para manejar el intervalo
  onFormularioCerrado(nuevoEstado: boolean): void {
    this.mostrarFormulario = nuevoEstado; 
    console.log('Nuevo estado:', nuevoEstado);
  }
  constructor(
    private docenteService: DocenteService,
    private http: HttpClient,
    private authService: AuthService,
    private cursosService: CursosService,
    private fb: FormBuilder
  ) {
   
  }

  ngOnInit(): void {
    this.cargarAreas();
  }

  isModalOpen = false;
  modulo: any = {};
 mostrarFormulario!: boolean; // o el tipo que necesites
areaId!: number; // o el tipo que necesites
  // filtroNombre: string = '';
  // filtroNivel: string = '';
  // filtroDuracion: number | null = null; // Puede ser null para indicar que no hay filtro
  // this.filtroDocente = docenteId;

  // Función para reiniciar filtros
  // resetFilters() {
  //   // this.filtroId = '';
  //   this.filtroNombre = '';
  //   this.filtroNivel = '';
  //   this.filtroDuracion = null;
  // }

  openModal(idCurso: any) {
    this.idCUrso = idCurso;
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  // filtrarModulos(): void {
  //   this.cursosSolicitados = this.cursosSolicitados.filter((modulo) => {
  //     const matchesId = this.filtroId
  //       ? modulo.id.toString().includes(this.filtroId)
  //       : true;
  //     const matchesNombre = this.filtroNombre
  //       ? modulo.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
  //       : true;
  //     const matchesNivel = this.filtroNivel
  //       ? modulo.nivel.toLowerCase().includes(this.filtroNivel.toLowerCase())
  //       : true;
  //     const matchesDuracion =
  //       this.filtroDuracion !== null
  //         ? modulo.duracion_horas === this.filtroDuracion
  //         : true;

  //     return matchesId && matchesNombre && matchesNivel && matchesDuracion;
  //   });
  // }

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

  // toggleFormulario(): void {
  //   this.mostrarFormulario = !this.mostrarFormulario;
  // }

  // en la tabla,solicitamos el curso seleccionando el area
  solicitarCurso(areaId: number): void {
    this.areaId = areaId;
    this.mostrarFormulario=true;
    // this.getEspecialidadesByAreaId(areaId);
  }

  // onFormularioCerrado(nuevoEstado: any): void {
  //   console.log('Formulario cerrado, nuevo valor:', nuevoEstado);
  //   this.mostrarFormulario = nuevoEstado; // Actualiza el valor
  // }

  // en el modal obtenemos las especialidades por el area seleccionado
  // "http://localhost:3000/especialidades/byAreaId/{areaId}"
  // getEspecialidadesByAreaId(areaId: number) {
  //   this.cursosService.getEspecialidadesByAreaId(areaId).subscribe(
  //     (especialidades) => {
  //       this.especialidadesByArea = especialidades;
  //     },
  //     (error) => {
  //       console.error('Error al obtener las especialidades:', error);
  //     }
  //   );
  // }

  // carga nuevamente los cursos al cambiar de especialidad

  // obtiene los cursos por especialidad seleccionado
  // http://localhost:3000/cursos/byEspecialidadId/{especialidadId}
  // getCursosByEspecialidadId(especialidadId: number): void {
  //   this.authService.getIdFromToken().then((plantelId) => {
  //     if (!plantelId) {
  //       console.error('No se pudo obtener el ID del plantel');
  //       return;
  //     }

  //     this.cursosService
  //       .getCursosByEspecialidadId(especialidadId, plantelId)
  //       .subscribe(
  //         (cursos) => {
  //           this.cursosByEspecialidad = cursos; // Actualizar los cursos disponibles
  //         },
  //         (error) => {
  //           console.error('Error al obtener los cursos:', error);
  //         }
  //       );
  //   });
  // }


  cancelarSolicitud(adi: any) {}

  // Métodos para ver detalles
  verDetalles(curso: Modulo): void {
    this.mostrarDetalleModal = true;
    this.cursoDetalleSeleccionado = curso;
    this.http.get<any>(`${environment.api}/areas/deatilsById/${curso}`).subscribe(response=>{
      this.details=response;
    })
  }



  cerrarDetalleModal(): void {
    this.mostrarDetalleModal = false;
    this.cursoDetalleSeleccionado = null;
  }

  //*************************FILE */}
  // selectedFile: File | any = null;
  // isUploading = false;
  // fileExtension: string = '';

  // Evento cuando se selecciona un archivo

  // Subir el archivo
  // uploadFile(file: File): void {
  //   console.log(file);
  // }

  // Eliminar archivo
  // removeFile(): void {
  //   this.url = '';
  //   // this.selectedFile = null;
  //   this.fileExtension = '';
  // }

  // Obtener la extensión del archivo
  // getFileExtension(fileName: string): string {
  //   const ext = fileName.split('.').pop()?.toLowerCase() || '';
  //   return ext;
  // }

  // Manejar eventos de arrastre
  // onDragOver(event: DragEvent): void {
  //   event.preventDefault();
  // }

  // onDrop(event: DragEvent): void {
  //   event.preventDefault();
  //   const file = event.dataTransfer?.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.fileExtension = this.getFileExtension(file.name);
  //     // this.uploadFile(file);
  //   }
  // }

  // onDragLeave(event: DragEvent): void {
  //   // Se puede agregar algún efecto visual para cuando el archivo sale del área
  // }
  url: any = '';

  // onFileSelect(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // this.selectedFile = file;
  //     this.fileExtension = this.getFileExtension(file.name);

  //     // For PDF files, load the file into the viewer
  //     if (this.fileExtension === 'pdf') {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.url = reader.result as string; // This will hold the base64 string of the PDF
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

  page: number = 1;
  totalPages!: number;
  isLoaded: boolean = false;

  // callbackFn(pdf: PDFDocumentProxy) {
  //   this.totalPages = pdf.numPages;
  //   this.isLoaded = true;
  // }

  // nextTep() {
  //   this.page++;
  // }
  // prevTep() {
  //   this.page--;
  // }

  // }
}
