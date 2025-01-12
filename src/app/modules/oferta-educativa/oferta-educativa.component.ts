import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment.prod';
import { Router } from '@angular/router';


@Component({
  selector: 'app-oferta-educativa',
  templateUrl: './oferta-educativa.component.html',
  styleUrls: ['./oferta-educativa.component.scss']
})
export class OfertaEducativaComponent implements OnInit {
  cursos: any[] = [];
  filteredCursos: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  selectedCourse: string = ''; // Variable para el curso seleccionado
  showOfertaEducativa = false; // Cambia a true para mostrar la sección
  isAddingCourse: boolean = false;
  


  searchCurso = '';
  searchEspecialidad = '';

  private apiUrl = `${environment.api}/cursos`;

  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success'; // Tipo de mensaje (éxito o error)

  constructor(private http: HttpClient , private  router: Router) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.http.get<any[]>(`${this.apiUrl}/cursos/detallados`).subscribe({
      next: (data) => {
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
  logout(): void {
    const request = indexedDB.open('authDB'); // Nombre de la base de datos

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('tokens', 'readwrite'); // Nombre de la tabla/almacén
      const store = transaction.objectStore('tokens');

      // Eliminar el token
      const deleteRequest = store.delete('authToken'); // Clave del token

      deleteRequest.onsuccess = () => {
        console.log('Token eliminado correctamente.');
        this.router.navigate(['/']); // Redirige al login
      };

      deleteRequest.onerror = (error) => {
        console.error('Error al eliminar el token:', error);
      };
    };

    request.onerror = (error) => {
      console.error('Error al abrir la base de datos:', error);
    };
  }

  verOfertaEducativa(): void {
    this.isAddingCourse = true;
  }
  
  toggleAddCourse() {
    this.showOfertaEducativa = !this.showOfertaEducativa;
    console.log('Vista activada:', this.showOfertaEducativa);
  }
  
  
  cancelAddingCourse(): void {
    this.isAddingCourse = false;
  }
  toggleAddingCourse(): void {
    this.isAddingCourse = !this.isAddingCourse;
  }
  
  regresar(): void {
    this.isAddingCourse = false;
  }
  
  

}
