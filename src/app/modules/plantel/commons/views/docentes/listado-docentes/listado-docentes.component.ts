import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../../shared/services/auth.service';

@Component({
  selector: 'app-listado-docentes',
  templateUrl: './listado-docentes.component.html',
  styles: [
    `
      #addModal {
        animation: fadeIn 0.3s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class ListadoDocentesComponent implements OnInit{
  // Variables de filtro
  textoBusqueda: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  // Control del modal
  esModalVisible: boolean = false;

  // Modelo para el nuevo docente
  nuevoDocente = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    especialidad: '',
    estatus: 'Activo',
  };

  // Datos de ejemplo
  docentes: any[] = []; // Lista de docentes obtenida del servidor
// textoBusqueda!: string = ''; // Texto de búsqueda


  constructor(private https: HttpClient, private authS_: AuthService) {}


  ngOnInit(): void {
    // Cargar los datos de docentes al iniciar el componente
    this.authS_.getIdFromToken().then((idPlantel) => {
      this.https
        .get<any>(
          `${environment.api}/curso-docente/byIdPlantel/${idPlantel?.toString()}/docentes`
        )
        .subscribe((response) => {
          // Extraer el array 'data' de la respuesta
          this.docentes = response.data || []; // Asegúrate de que siempre sea un array
        });
    });
  }

  // Método para filtrar los docentes
  docentesFiltrados(): any[] {
    if (!this.textoBusqueda) {
      return this.docentes; // Si no hay búsqueda, devuelve la lista completa
    }

    return this.docentes.filter((docente: any) => {
      const coincideBusqueda =
        docente.docente_nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        docente.apellidos.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      return coincideBusqueda;
    });
  }
   // Abrir/Cerrar modal
  abrirModal() {
    this.esModalVisible = true;
  }

  cerrarModal() {
    this.esModalVisible = false;
  }

  // Agregar docente
  agregarDocente() {
    this.docentes.push({
      ...this.nuevoDocente,
      id: `#${Math.floor(Math.random() * 10000)}`,
    });
    this.nuevoDocente = {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      especialidad: '',
      estatus: 'Activo',
    };
    this.cerrarModal();
  }
}
