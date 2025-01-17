import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment.prod";
import { jsPDF } from "jspdf";
import { Router } from "@angular/router";

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
  selector: "app-listado-cursos",
  templateUrl: "./listado-cursos.component.html",
  styleUrls: ["./listado-cursos.component.scss"],
  standalone: false,
})
export class ListadoCursosComponent implements OnInit, OnChanges {
  cursos: any[] = [];
  filteredCursos: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  searchCurso = '';
  searchEspecialidad = '';
  private apiUrl = `${environment.api}/cursos`;

    areas: any[] = [];
    especialidades: any[] = [];
    tiposCurso: any[] = [];
    mostrarFormulario = false;
    // mostrarModal = false;
  
     mostrarModalPdf!: boolean;
    // @Input() mostrarModalPdf1!: boolean;
    selectedCourse: string = "curso1";
    mostrarOpcionesCursosTipo: boolean = false;
    mostrarDetalleModal = false;
    // cursoSeleccionado: Modulo | null = null;
    // cursoDetalleSeleccionado: Modulo | null = null;
    cursoId!: number;




  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success'; // Tipo de mensaje (éxito o error)
  isLoading: boolean = false; // Cambia según tu lógica

  constructor(private http: HttpClient , private  router: Router) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
   this.isLoading=true
    this.http.get<any[]>(`${this.apiUrl}/cursos/detallados`).subscribe({
      next: (data) => {
   this.isLoading=false
     
        this.cursos = data.map((curso) => ({
          id: curso.id,
          activo: curso.estatus,
          area: curso.area_nombre,
          especialidad: curso.especialidad_nombre,
          clave: curso.clave,
          nombre: curso.curso_nombre,
          tipo: curso.tipo_curso_nombre,
          horas: curso.horas,
          detalles: curso.detalles,
        }));
        this.filteredCursos = [...this.cursos];
        this.totalPages = Math.ceil(this.filteredCursos.length / this.itemsPerPage);
        
      },
      error: (err) => {
        console.error('Error al cargar los cursos:', err);
        this.mostrarModal('Error al cargar los cursos. Intenta más tarde.', 'error');
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarOpcionesCursosTipo = !this.mostrarOpcionesCursosTipo;


    if(!this.mostrarOpcionesCursosTipo){

      this.cargarCursos()
      
    }


  }

  filtrarCursos(): void {
    this.filteredCursos = this.cursos.filter((curso) =>
      curso.nombre.toLowerCase().includes(this.searchCurso.toLowerCase()) &&
      curso.especialidad.toLowerCase().includes(this.searchEspecialidad.toLowerCase())
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredCursos.length / this.itemsPerPage);
  }

  get paginatedCursos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCursos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  toggleEstado(curso: any) {
    const nuevoEstado = !curso.activo;

    this.http.patch(`${this.apiUrl}/${curso.id}/estatus`, { estatus: nuevoEstado }).subscribe({
      next: () => {
        curso.activo = nuevoEstado;
        this.mostrarModal(
          `El curso "${curso.nombre}" se actualizó a ${nuevoEstado ? 'Activo' : 'Inactivo'}.`,
          'success'
        );
      },
      error: (err) => {
        console.error(`Error al actualizar el estado del curso con ID ${curso.id}:`, err);
        this.mostrarModal('Error al actualizar el estado del curso. Intenta más tarde.', 'error');
      }
    });
  }

  mostrarModal(message: string, type: 'success' | 'error') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;

    // Cierra automáticamente el modal después de 3 segundos
    setTimeout(() => {
      this.showModal = false;
    }, 3000);
  }
  

 ngOnChanges(changes: SimpleChanges): void {
    this.cargarCursos()
    if (changes["mostrarModalPdf"] && changes["mostrarModalPdf"].currentValue) {
      // this.abrirModal();
      console.log(
        "Nuevo ID recibido:",
        changes["mostrarModalPdf"].currentValue
      );
      this.mostrarModalPdf = changes["mostrarModalPdf"].currentValue;
    }
  }


  
  cerrarModalPdf(event: boolean) {
    this.mostrarModalPdf = event; // Cierra el modal
  }
  // Función para generar el reporte PDF
  generarReportePDF(id: number): void {
    this.cursoId = id;
    this.mostrarModalPdf = true;
    // alert("abrio ")
  }

}
