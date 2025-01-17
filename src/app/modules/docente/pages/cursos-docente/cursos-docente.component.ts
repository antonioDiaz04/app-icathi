import { Component, OnInit } from '@angular/core';
import { CursosdocentesService } from '../../../../shared/services/cursosdocentes.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DocenteService } from '../../../../shared/services/docente.service';

@Component({
  selector: 'app-cursos-docente',
  templateUrl: './cursos-docente.component.html',
  styleUrls: ['./cursos-docente.component.scss'],
})
export class CursosDocenteComponent implements OnInit {
  cursosAsignados: any[] = []; // Cursos asignados al docente
  docenteData: any = {}; // Datos del docente
  filtro: string = ''; // Texto de búsqueda para filtrar cursos
  selectedCurso: any = null; // Curso seleccionado para mostrar detalles
  showModal: boolean = false; // Estado del modal

  constructor(
    private docenteService: DocenteService,
    private http: HttpClient,
    private cursosDocentesService: CursosdocentesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosDocenteYCursos(); // Llamada inicial para obtener datos
  }

  async obtenerDatosDocenteYCursos(): Promise<void> {
    try {
      const userId = await this.authService.getIdFromToken(); // Obtener ID desde el token
      this.docenteService.getDocenteById(Number(userId)).subscribe({
        next: (docenteResponse) => {
          this.docenteData =
            Array.isArray(docenteResponse) && docenteResponse.length > 0
              ? docenteResponse[0]
              : docenteResponse;

          if (this.docenteData?.id) {
            console.log('ID del docente:', this.docenteData.id);
            this.obtenerCursosAsignados(this.docenteData.id);
          } else {
            console.error("El campo 'id' no está definido en los datos del docente.");
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos del docente:', error);
        },
      });
    } catch (error) {
      console.error('Error al obtener ID del token:', error);
    }
  }

  obtenerCursosAsignados(docenteId: number): void {
    this.cursosDocentesService.obtenerCursosAsignados(Number(docenteId)).subscribe({
      next: (cursosResponse: any) => {  // Usamos "any" para no restringir el tipo
        if (Array.isArray(cursosResponse)) {
          this.cursosAsignados = cursosResponse;
          console.log('Cursos asignados:', this.cursosAsignados);
        } else {
          console.error('La respuesta no es un arreglo de cursos:', cursosResponse);
        }
      },
      error: (error) => {
        console.error('Error al obtener los cursos asignados:', error);
      }
    });
  
  }

  // Método para abrir el modal y mostrar los detalles del curso seleccionado
  verDetalles(curso: any): void {
    this.selectedCurso = curso;
    this.showModal = true;
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.showModal = false;
    this.selectedCurso = null;
  }

  // Filtro dinámico para buscar cursos
  get cursosFiltrados(): any[] {
    if (!this.filtro.trim()) {
      return this.cursosAsignados;
    }
    const filtroLower = this.filtro.toLowerCase();
    return this.cursosAsignados.filter(
      (curso) =>
        curso.curso_nombre.toLowerCase().includes(filtroLower) ||
        curso.curso_clave.toLowerCase().includes(filtroLower) ||
        curso.area_nombre.toLowerCase().includes(filtroLower) ||
        curso.especialidad_nombre.toLowerCase().includes(filtroLower)
    );
  }
}
