import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ValidadorDocenteService } from '../../../../commons/services/validador-docente.service';
import { Especialidad_docente, EspecialidadesService } from '../../../../../../shared/services/especialidad.service';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { EspecialidadesDocentesService } from '../../../../../../shared/services/especialidades-docentes.service';
// Importante: no necesitas nada extra, solo pega esto en tu componente.
type Prioridad = 'Alta' | 'Media' | 'Baja';
type Estado = 'Pendiente' | 'Aprobado' | 'Rechazado';

interface Solicitud {
  titulo: string;
  origen: string;          // ICATHI / Modalidad Escuela / etc.
  fecha: string;           // ISO para formatear
  prioridad: Prioridad;
  estado: Estado;
  justificacion: string;
  comentarioValidador?: string;
}

@Component({
    selector: 'app-perfiles',
    templateUrl: './perfiles.component.html',
    styleUrls: ['./perfiles.component.scss'],
    standalone: false
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
  selectedTab: 'general' | 'solicitudes' | 'documentos' | 'contacto' = 'general';

setTab(tab: 'general' | 'solicitudes' | 'documentos' | 'contacto') {
  this.selectedTab = tab;
}

isTab(tab: 'general' | 'solicitudes' | 'documentos' | 'contacto') {
  return this.selectedTab === tab;
}

  solicitudes: Solicitud[] = [
    {
      titulo: 'Plomería Básica',
      origen: 'ICATHI',
      fecha: '2024-01-14',
      prioridad: 'Alta',
      estado: 'Pendiente',
      justificacion:
        'Necesito ampliar mis conocimientos en oficios prácticos para diversificar mi enseñanza.'
    },
    {
      titulo: 'Repostería Avanzada',
      origen: 'Modalidad Escuela',
      fecha: '2024-01-09',
      prioridad: 'Media',
      estado: 'Aprobado',
      justificacion:
        'Curso complementario para el programa de gastronomía',
      comentarioValidador: 'Aprobado por relevancia curricular'
    }
  ];
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

  // Colores homologados para chips de estatus (mismos de la tabla)
estatusChipClass(status?: string) {
  switch (status) {
    case 'Pendiente de validación':
      return 'bg-orange-500 text-white';
    case 'Activo':
      return 'bg-green-500 text-white';
    case 'Inactivo':
      return 'bg-yellow-500 text-white';
    case 'Suspendido':
      return 'bg-red-500 text-white';
    default:
      return 'bg-neutral-200 text-neutral-800';
  }
}

// Chips para estatus de especialidad
especialidadChipClass(est?: string) {
  switch ((est || '').toLowerCase()) {
    case 'aprobado':
      return 'bg-green-500 text-white';
    case 'pendiente':
      return 'bg-yellow-500 text-white';
    case 'rechazado':
      return 'bg-red-500 text-white';
    default:
      return 'bg-neutral-200 text-neutral-800';
  }
}

// Tabs con color primario de la tabla
tabClass(tab: 'general'|'solicitudes'|'documentos'|'contacto') {
  const base = 'whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2';
  const active = 'border-[#44509D] text-[#44509D]';
  const inactive = 'border-transparent text-neutral-500 hover:text-[#44509D] hover:border-[#44509D]/70';
  return `${base} ${this.selectedTab === tab ? active : inactive}`;
}




  prioridadClasses(p: Prioridad): string {
    switch (p) {
      case 'Alta':
        return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      case 'Media':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    }
  }

  estadoClasses(e: Estado): string {
    switch (e) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprobado':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-rose-100 text-rose-800';
    }
  }

  // Iconos en texto (opcional) por accesibilidad
  estadoIcon(e: Estado): string {
    return e === 'Aprobado' ? '✅' : e === 'Pendiente' ? '🟡' : '❌';
  }
}
