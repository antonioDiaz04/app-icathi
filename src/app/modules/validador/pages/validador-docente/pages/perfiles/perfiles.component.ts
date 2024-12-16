import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ValidadorDocenteService } from '../../../../commons/services/validador-docente.service';
import { Especialidad_docente, EspecialidadesService } from '../../../../../../shared/services/especialidad.service';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { EspecialidadesDocentesService } from '../../../../../../shared/services/especialidades-docentes.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent implements OnInit {
  docenteId: string = ''; // ID del docente obtenido de la URL
  docente: any = null;
  loading: boolean = true;
  error: string | null = null;
  especialidades: Especialidad_docente[] = []; // Lista de especialidades del docente
  mostrarModal: boolean = false;
  mostrarModal_especialidad = false;
  especialidadSeleccionada: any = null;
  userId: number | null = null; // ID del usuario desde el token

  constructor(
    private route: ActivatedRoute,
    private location: Location,
        private router: Router,
    private authService:AuthService,
    private especialidadesService: EspecialidadesService,
    private validadorDocenteService: ValidadorDocenteService,
    private especialidadesDocentesService: EspecialidadesDocentesService
  ) {}

  ngOnInit(): void {
     // Obtén el ID del usuario desde el token (si es necesario)
     this.authService.getIdFromToken().then(id => {
      this.userId = id; // Asigna el ID del usuario al componente
      console.log('ID del usuario desde el token:', this.userId);
    });
    // Obtén el ID del docente desde la URL
    this.route.paramMap.subscribe((params) => {
      this.docenteId = params.get('id') || ''; // Parámetro "id"
      if (this.docenteId) {
        this.obtenerDocente(this.docenteId);
        this.obtenerEspecialidades();

      } else {
        this.loading = false;
        this.error = 'No se encontró el ID del docente en la URL.';
      }
    });
  }
   /**
   * Obtiene los datos del docente.
   * @param id ID del docente
   */
   obtenerDocente(id: string): void {
    this.validadorDocenteService.getDocenteById(id).subscribe({
      next: (docente) => {
        this.docente = docente;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al obtener el docente: ${err.message}`;
        this.loading = false;
      }
    });
  }
  obtenerEspecialidades(): void {
    const docenteId = Number(this.docenteId); // Convertir a número
    this.especialidadesService.obtenerEspecialidadesPorDocente(docenteId).subscribe({
      next: (response) => {
        this.especialidades = response.especialidades;
        console.log("this.especialidades del docente",this.especialidades)
      },
      error: (err) => {
        this.error = `Error al obtener las especialidades: ${err.message}`;
      }
    });
  }
  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
  abrirModal_especialidad(especialidad: any) {
    this.especialidadSeleccionada = { ...especialidad };
    this.mostrarModal_especialidad = true;
  }


  guardarCambios_especialidad() {
    // Mapeo de los valores de estado a los valores numéricos correspondientes
    const estadoMap: { [key: string]: number } = {
      'pendiente': 1,
      'aprobado': 2,
      'rechazado': 3
    };
  
    // Asignamos el valor numérico al campo 'estatus' de la especialidad
    if (estadoMap[this.especialidadSeleccionada.estatus]) {
      this.especialidadSeleccionada.estatus_id = estadoMap[this.especialidadSeleccionada.estatus];
    }
  
    // Extraer datos necesarios para la solicitud
    const docenteId = Number(this.docenteId); // Convertir a número
    const especialidadId = this.especialidadSeleccionada.especialidad_id;
    const nuevoEstatusId = this.especialidadSeleccionada.estatus_id;
    const usuarioValidadorId = Number(this.userId);
  
    // Realizar la actualización mediante el servicio
    this.especialidadesDocentesService
      .actualizarEstatus(docenteId, especialidadId, nuevoEstatusId, usuarioValidadorId)
      .subscribe({
        next: (response) => {
          console.log('Estatus actualizado exitosamente:', response);
  
          // Actualizar la lista local de especialidades
          const index = this.especialidades.findIndex(
            (esp) => esp.especialidad === this.especialidadSeleccionada.especialidad
          );
  
          if (index !== -1) {
            this.especialidades[index] = { ...this.especialidadSeleccionada };
          }
  
          // Cerrar el modal
          this.cerrarModal_especialidad();
        },
        error: (err) => {
          console.error('Error al actualizar el estatus:', err);
        }
      });
  }
  
  cerrarModal_especialidad() {
    this.mostrarModal_especialidad = false;
    this.especialidadSeleccionada = null;
  }


  estatusMap: { [key: string]: number } = {
    Activo: 4,
    Inactivo: 5,
    'Pendiente de validación': 6,
    Suspendido: 7
  };
  actualizarEstatus() {
    const valorNumerico = this.estatusMap[this.docente.estatus_valor];
    console.log('Estatus actualizado:', valorNumerico);
    const usuarioValidadorId = Number(this.userId);
  
    // Aquí envías al backend el valor numérico
    alert(`Estatus cambiado Exitosamente ..`);
    
        this.validadorDocenteService.updateDocenteStatus(usuarioValidadorId,this.docenteId, valorNumerico)
    .subscribe(
      () => {
        this.cerrarModal()
        this.router.navigate(['/validador/docente/perfil/', this.docenteId]);

      },
      (error) => {
        alert('Error al cambiar el estado del docente.')
        // this.errorMessage = 'Error al cambiar el estado del docente.';
        console.error('Error al cambiar el estado:', error);
      }
    );
  }
  obtenerDescripcionEstatus(valor: number): string {
    const descripciones: { [key: number]: string } = {
      4: 'Activo',
      5: 'Inactivo',
      6: 'Pendiente de validación',
      7: 'Suspendido'
    };
    return descripciones[valor] || 'Desconocido';
  }
  regresar(): void {
    this.location.back();
  }
}
