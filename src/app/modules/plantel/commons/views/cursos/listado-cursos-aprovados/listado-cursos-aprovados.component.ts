import { Component, ElementRef, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService } from '../../../../../../shared/services/docente.service';
import { CursosdocentesService } from '../../../../../../shared/services/cursosdocentes.service';
import { AspiranteService } from '../../../../../../shared/services/aspirante.service';
import { PlantelService } from '../../../../../../shared/services/plantel.service';
// import { response } from 'express';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

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
    standalone: false,
    providers: [{ provide: LOCALE_ID, useValue: 'es' }]
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


  cursoForm!: FormGroup;




  constructor(
    private docenteService: DocenteService,
    private http: HttpClient,
    private aspirantesService: AspiranteService,
    private plantelService: PlantelService,
    private authService: AuthService,
    private cursoDocenteS_: CursosdocentesService,
    private fb: FormBuilder,
  
  ) {
  

    this.cursoForm = this.fb.group({
      nombre: [''],
      area_nombre: [''],
      especialidad_nombre: [''],
      fecha_inicio: [''],
      fecha_fin: [''],
      cupo_maximo: [''],
      requisitos_extra: [''],
      sector_atendido: [''],
      rango_edad: [''],
      tipo_beca: [''],
      tipo_curso: [''],
      convenio_numero: [''],
      cruzada_contra_hambre: [''],
      cuota_tipo: [''],
      cuota_monto: [''],
      pagar_final: [false],
      participantes: [''],
      cant_instructores: [''],
      calle: [''],
        localidad: [''],
        municipio: [''],
        num_interior: [''],
        num_exterior: [''],
      
        lunes_inicio: [''],
        lunes_fin: [''],
        martes_inicio: [''],
        martes_fin: [''],
        miercoles_inicio: [''],
        miercoles_fin: [''],
        jueves_inicio: [''],
        jueves_fin: [''],
        viernes_inicio: [''],
        viernes_fin: [''],
        sabado_inicio: [''],
        sabado_fin: [''],
        domingo_inicio: [''],
        domingo_fin: ['']
    ,
      docentes: this.fb.array([]),
      alumnos: this.fb.array([])
    });
  }


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

  // cursosFiltrados!:Modulo;
  openModal(idPlantelCurso: any) {
    alert(idPlantelCurso);
    this.mostrarFormulario = !this.mostrarFormulario;
  
    this.plantelService.getInfoCursoPlantel(idPlantelCurso).subscribe((response:any) => {
      this.alumnos = response.alumnos;
      this.docentes = response.docentes;
      this.curso = response.curso;
      const cursohorario = response.curso.horario;
  
      // Cargar la información del curso en el formulario
      this.cursoForm.patchValue({
        nombre: this.curso.nombre,
        area_nombre: this.curso.area_nombre,
        especialidad_nombre: this.curso.especialidad_nombre,
        fecha_inicio:this.formatDate(this.curso.fecha_inicio),
        fecha_fin:   this.formatDate(this.curso.fecha_fin),
        cupo_maximo: this.curso.cupo_maximo,
        requisitos_extra: this.curso.requisitos_extra,
        sector_atendido: this.curso.sector_atendido,
        rango_edad: this.curso.rango_edad,
        tipo_beca: this.curso.tipo_beca,
        tipo_curso: this.curso.tipo_curso,
        convenio_numero: this.curso.convenio_numero,
        cruzada_contra_hambre: this.curso.cruzada_contra_hambre,
        cuota_tipo: this.curso.cuota_tipo,
        cuota_monto: this.curso.cuota_monto,
        pagar_final: this.curso.pagar_final,
        participantes: this.curso.participantes,
        cant_instructores: this.curso.cant_instructores,
        // plantel: {
          calle: this.curso.plantel.calle,
          localidad: this.curso.plantel.localidad,
          municipio: this.curso.plantel.municipio,
          num_interior: this.curso.plantel.num_interior,
          num_exterior: this.curso.plantel.num_exterior,
        // },
      
          lunes_inicio: cursohorario.lunes_inicio,
          lunes_fin: cursohorario.lunes_fin,
          martes_inicio: cursohorario.martes_inicio,
          martes_fin: cursohorario.martes_fin,
          miercoles_inicio: cursohorario.miercoles_inicio,
          miercoles_fin: cursohorario.miercoles_fin,
          jueves_inicio: cursohorario.jueves_inicio,
          jueves_fin: cursohorario.jueves_fin,
          viernes_inicio: cursohorario.viernes_inicio,
          viernes_fin: cursohorario.viernes_fin,
          sabado_inicio: cursohorario.sabado_inicio,
          sabado_fin: cursohorario.sabado_fin,
          domingo_inicio: cursohorario.domingo_inicio,
          domingo_fin: cursohorario.domingo_fin
        
      });


  
      // Limpiar los arrays de docentes y alumnos
      this.cursoForm.setControl('docentes', this.fb.array([]));
      this.cursoForm.setControl('alumnos', this.fb.array([]));
  
      // Cargar los docentes en el FormArray
      const docentesArray = this.cursoForm.get('docentes') as FormArray;
      this.docentes.forEach(docente => {
        docentesArray.push(this.fb.group({
          nombre: docente.nombre,
          docente_apellidos: docente.docente_apellidos,
          email: docente.email,
          telefono: docente.telefono
        }));
      });
  
      // Cargar los alumnos en el FormArray
      const alumnosArray = this.cursoForm.get('alumnos') as FormArray;
      this.alumnos.forEach((alumno:any) => {
        alumnosArray.push(this.fb.group({
          nombre: alumno.nombre,
          apellidos: alumno.apellidos,
          email: alumno.email,
          telefono: alumno.telefono
        }));
      });
  
      console.log(this.cursoForm.value); // Para verificar que los datos se han cargado correctamente
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Retorna solo la parte de fecha en formato YYYY-MM-DD
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


  guardarCambios() {
    // Combina todo el objeto de curso con las demás propiedades
    const cursoData = {
      ...this.cursoForm.value, // Toma todas las propiedades del formulario
      docentes: this.cursoForm.get('docentes')?.value, // Incluye los docentes del FormArray
      alumnos: this.cursoForm.get('alumnos')?.value // Incluye los alumnos del FormArray
    };
  
    // Serializa a JSON
    const jsonData = JSON.stringify(cursoData);
  
    // Muestra en consola el resultado
    console.log(jsonData);
  
    // Aquí puedes enviar jsonData a tu API o donde lo necesites
    // this.plantelService.guardarCurso(jsonData).subscribe(response => {
    //   // Manejo de la respuesta después de guardar
    //   console.log('Curso guardado con éxito:', response);
    // }, error => {
    //   // Manejo de errores
    //   console.error('Error al guardar el curso:', error);
    // });
  }
  















 modalVisibleInstructor: boolean = false;
 modalVisibleAlumno: boolean = false;
    tituloModal: string = '';
    tablaData: any[] = [];

    // Datos iniciales
    alumnosNuevos!:any[];

    instructores = [
      { nombre: 'Ana', apellido: 'Martínez', selected: false },
      { nombre: 'Pedro', apellido: 'Rodríguez', selected: true },
      { nombre: 'Sofía', apellido: 'Torres', selected: false },
      { nombre: 'Luis', apellido: 'Gómez', selected: false },
      { nombre: 'Pepe', apellido: 'Gómez', selected: false },
      { nombre: 'Antonio', apellido: 'Gómez', selected: false },
      { nombre: 'Raúl', apellido: 'Gómez', selected: false },
      { nombre: 'Juan', apellido: 'Gómez', selected: false },
      { nombre: 'Mario', apellido: 'Gómez', selected: false },
      { nombre: 'María', apellido: 'Fernández', selected: false }
    ];
    
    // Variable para manejar la visibilidad del modal
   
    
    
    // Método para abrir el modal y realizar la petición
    agregarAlumno() {
      // Mostrar el modal
      this.modalVisibleAlumno = true;
    
      // Realizar la petición para obtener los alumnos
      this.http.get(`${environment.api}/alumno`).subscribe(
        (response: any) => {
          console.log('Respuesta de la API:', response);
    
          // Procesar la respuesta y actualizar `alumnosNuevos`
          this.alumnosNuevos = response.map((alumno: any) => ({
            nombre: alumno.nombre,
            apellido: alumno.apellido,
            selected: false // Añadir la propiedad `selected` a cada alumno
          }));
    
          console.log('Lista actualizada de alumnos nuevos:', this.alumnosNuevos);
        },
        (error) => {
          console.error('Error al obtener alumnos:', error);
        }
      );
    }
    

    agregarInstructor() {
        this.modalVisibleInstructor = true;
    }

    // Método para cerrar el modal
    closeModalInstructures() {
        this.modalVisibleInstructor = false;
        this.tituloModal = '';
        this.tablaData = [];
    }
    closeModalAlumnos() {
        this.modalVisibleAlumno = false;
        this.tituloModal = '';
        this.tablaData = [];
    }
    isModalVisible = false;
    // tituloModal = 'Lista de Usuarios';
   
    rowsPerPage = 10;
    currentPage = 1;

    // Paginación
  // currentPage = 1;
  // itemsPerPage = 3;

    
     // Obtener datos paginados solo de instructores
  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    return this.instructores.slice(startIndex, startIndex + this.rowsPerPage);
  }
    
    get totalPages() {
      return Math.ceil(this.instructores.length / this.rowsPerPage);
    }
    
    toggleSelectAll(event: Event) {
      const checked = (event.target as HTMLInputElement).checked;
      this.instructores.forEach(item => (item.selected = checked));
    }
    
    get allSelected() {
      return this.instructores.every(item => item.selected);
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


 // Configuración para manejar los alumnos

// Obtener datos paginados solo de alumnos
get paginatedDataAlumno() {
  const startIndex = (this.currentPage - 1) * this.rowsPerPage;
  return this.alumnosNuevos.slice(startIndex, startIndex + this.rowsPerPage);
}

// Calcular el total de páginas para los alumnos
get totalPagesAlumnos() {
  return Math.ceil(this.alumnosNuevos.length / this.rowsPerPage);
}

// Seleccionar o deseleccionar todos los alumnos
toggleSelectAllAlumnos(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.alumnosNuevos.forEach(item => (item.selected = checked));
}

// Verificar si todos los alumnos están seleccionados
get allSelectedAlumnos() {
  return this.alumnosNuevos.every(item => item.selected);
}

// Navegar a la página anterior para alumnos
prevPageAlumnos() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

// Navegar a la página siguiente para alumnos
nextPageAlumnos() {
  if (this.currentPage < this.totalPagesAlumnos) {
    this.currentPage++;
  }
}




  
}