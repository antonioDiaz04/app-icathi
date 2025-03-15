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
import { PlantelCursosService } from '../../../../../../shared/services/plantel-cursos.service';
import { animate, style, transition, trigger } from '@angular/animations';
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
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
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
  getDocentes_a_asignar: any[] = [];
  id_plantel_curso_a_editar: Number = 0
  // id_plantel_a_editar:Number=0
  docentes_con_misma_especialidad: any[] = [];
  docentesDelCurso: any[] = [];  // O si tienes una estructura de datos específica, usa esa estructura



  cursoDetails!: any;
  abrirModalDetalles(modulo: any) {
    this.cursoSeleccionado = { ...modulo };
    this.mostrarModal = true;
  }
  // Tu función para normalizar los datos
  normalizeData() {
    this.docentesDelCurso.forEach((docente: { id?: number; docente_id?: number }) => {
      if (docente.id !== undefined) {
        docente.docente_id = docente.id;
        delete docente.id;
      }
    });

    this.docentes_con_misma_especialidad.forEach((docente: { docente_id?: number }) => {
      docente.docente_id = docente.docente_id; // Aseguramos que los campos coincidan
      console.log("docente")
      console.log(docente)
    });
  }




  // cursoForm: FormGroup;
  private apiUrl = `${environment.api}`;
  filtro: 'todos' | 'validados' | 'no-validados' = 'todos';
  @ViewChild('docenteInput') docenteInput!: ElementRef;


  cursoForm!: FormGroup;




  constructor(
    private plantelCursosService: PlantelCursosService,
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
      // cant_instructores: [this.curso.cant_instructores], // Asignamos el valor de 'cant_instructores'
      // cant_instructores: [''],  // Se inicializa con un valor vacío o el valor que venga
      // cant_instructores: [this.curso?.cant_instructores || ''], // Asigna el valor inicial
      // cant_instructores: ['cant_instructores'], // Valor predeterminado para seleccionar "Más de Uno"
      // cant_instructores: ['1'], // Selecciona "Uno" por defecto
      cant_instructores: [],

      // cant_instructores:  ["uno", Validators.required],
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
    // Inicializar la selección de los instructores basados en una lista de IDs de seleccionados
    // this.selectedInstructors = this.docentes.map((docente) => docente.id); // Esto es solo un ejemplo
    const docentesSeleccionados = JSON.parse(localStorage.getItem('docentesSeleccionados') || '[]');

    // Establecer `instructor.selected` en función de los IDs seleccionados
    // this.docentes_con_misma_especialidad.forEach((instructor) => {
    //   instructor.selected = this.selectedInstructors.includes(instructor.id); // Establecer si el instructor está seleccionado
    // });
    // Actualizar los estados en el FormArray
    const docentesArray = this.cursoForm.get('docentes') as FormArray;
    docentesArray.controls.forEach(group => {
      const docenteId = group.get('id')?.value;
      const seleccionado = docentesSeleccionados.some((doc: any) => doc.id === docenteId);
      group.get('selected')?.setValue(seleccionado);
    });
    // Si necesitas algo más con el formulario, continúa con la lógica que tienes.
    this.cursoForm.get('instructor')?.setValue(this.selectedInstructors);
    // Inicializar seleccionados (puedes cambiar a [] si no deben estar todos seleccionados al inicio)
    // this.selectedInstructors = this.docentes.map((docente) => docente.id); // Lista inicial de seleccionados

    // // Sincronizar selección inicial con el formulario
    // this.cursoForm.get('instructor')?.setValue(this.selectedInstructors);

    // Escuchar cambios en la selección de cantidad de instructores
    this.cursoForm.get('cant_instructores')?.valueChanges.subscribe(() => {
      this.updateSelectionMode();
    });

    // Escuchar cambios en la lista de instructores seleccionados
    this.cursoForm.get('instructor')?.valueChanges.subscribe((selectedIds) => {
      this.selectedInstructors = selectedIds;
      console.log('Instructores seleccionados:', this.selectedInstructors); // Para depuración
    });

    // Llamar a los métodos de inicialización
    this.cargarCursosByIdPlantel();
    this.cargarAreas();
    this.cargarEspecialidades();
    this.cargarTiposCurso();
    // this.markSelectedDocentes();

  }

  textoBusqueda: string = '';
  isLoading = false;
  isModalOpen = false;
  modulo: any = {};
  filtroId: string = '';
  filtroNombre: string = '';
  filtroNivel: string = '';
  filtroDuracion: number | null = null; // Puede ser null para indicar que no hay filtro
  // markSelectedDocentes() {
  //   // Recorremos cada docente de la primera tabla
  //   this.docentes_con_misma_especialidad.forEach(instructor => {
  //     // Verificamos si el docente está en la segunda tabla usando el docente_id
  //     const docenteEnSegundaTabla = this.docentes.find(docente => docente.docente_id === instructor.docente_id);

  //     // Si se encuentra en la segunda tabla, marcamos el checkbox como seleccionado
  //     if (docenteEnSegundaTabla) {
  //       instructor.selected = true;
  //     } else {
  //       instructor.selected = false;
  //     }
  //   });
  // }
  // markSelectedDocentes() {
  //   this.docentes_con_misma_especialidad.forEach(instructor => {
  //     const docenteEnCurso = this.docentes.find(docente => docente.docente_id === instructor.docente_id);
  //     if (docenteEnCurso) {
  //       instructor.selected = true;
  //     } else {
  //       instructor.selected = false;
  //     }
  //   });
  // }
  // Normalizar los datos para que todos usen 'docente_id'

  // Función para reiniciar filtros
  resetFilters() {
    this.filtroId = '';
    this.filtroNombre = '';
    this.filtroNivel = '';
    this.filtroDuracion = null;
  }
  mapRangoEdad(rango: string | undefined): string {
    if (!rango) return ''; // Devuelve una cadena vacía si no hay valor
    if (rango === '11-15' || rango === '11-14') return '11-14';
    if (rango === '15+' || rango === '15-20') return '15+';
    return ''; // Devuelve vacío si no coincide con ningún caso
  }
  mapCruzadaContraHambre(valor: boolean | undefined): string {
    if (valor === true) return 'Sí';
    if (valor === false) return 'No';
    return ''; // Devuelve vacío si no hay valor
  }
  mapSectorAtendido(valor: string | undefined): string {
    const sectoresValidos = ['Productivo', 'Público', 'Social', 'Readaptación Social'];
    if (sectoresValidos.includes(valor || '')) {
      return valor || '';
    }
    return ''; // Devuelve vacío si no hay coincidencias
  }

  mapCuotaTipo(valor: string | undefined): string {
    const tiposValidos = ['Por Grupo', 'Por Alumno'];
    if (tiposValidos.includes(valor || '')) {
      return valor || '';
    }
    return ''; // Devuelve vacío si no es un valor válido
  }
  mapPagarFinal(valor: string | undefined): string {
    if (valor === 'true') {
      return 'Sí';
    } else if (valor === 'false') {
      return 'No';
    }
    return ''; // Devuelve vacío si el valor no es válido
  }
  selectedDocentes: number[] = []; // IDs de los docentes seleccionados

  // cursosFiltrados!:Modulo;
  openModal(idPlantelCurso: any) {
    alert(idPlantelCurso);
    this.mostrarFormulario = !this.mostrarFormulario;
    this.id_plantel_curso_a_editar = idPlantelCurso

    console.log("id_plantel_curso_a_editar al abrir detalles", this.id_plantel_curso_a_editar)
    this.plantelService.getInfoCursoPlantel(idPlantelCurso).subscribe((response: any) => {
      console.log("response*", response)
      const cursoId = response.curso.curso_id;
      console.log("ID del curso:", cursoId);
      this.alumnos = response.alumnos;
      // Determina si el curso permite selección múltiple
      const numInstructores = response.curso.cant_instructores;
      this.isMultipleSelection = numInstructores === '2';
      console.log("cursoId-------::::::::::::::::", cursoId)
      this.cursoDocenteS_.obtenerDocentesPorCurso(cursoId).subscribe(
        (data: any[]) => {
          this.docentes_con_misma_especialidad = data;

          this.docentes_con_misma_especialidad.forEach(instructor => {
            const isSelected = this.docentes.some(seleccionado => seleccionado.id === instructor.docente_id);
            instructor.selected = isSelected;
            
            if (isSelected) {
              this.selectedInstructors.push(instructor.docente_id);
            }
          });
          if (!this.isMultipleSelection && this.selectedInstructors.length > 1) {
            this.selectedInstructors = [this.selectedInstructors[0]];
          }
          
          console.log(this.docentes_con_misma_especialidad)
          this.cursoForm.get('instructor')?.setValue(this.selectedInstructors);


          console.log('Docentes del curso asociados:', this.docentes_con_misma_especialidad);
        },
        (error) => {
          console.error('Error al obtener docentes:', error);
        }
      );
      this.docentes = response.docentes;
      console.log('Docentes del curso seleccionado:', this.docentes);
      this.curso = response.curso;
      const cursohorario = response.curso.horario;

      // Cargar la información del curso en el formulario
      this.cursoForm.patchValue({
        nombre: this.curso.curso_nombre,
        area_nombre: this.curso.area_nombre,
        especialidad_nombre: this.curso.especialidad_nombre,
        fecha_inicio: this.formatDate(this.curso.fecha_inicio),
        fecha_fin: this.formatDate(this.curso.fecha_fin),
        cupo_maximo: this.curso.cupo_maximo,
        requisitos_extra: this.curso.requisitos_extra,
        sector_atendido: this.mapSectorAtendido(this.curso?.sector_atendido), // Mapeo para sector_atendido

        // sector_atendido: this.curso.sector_atendido,
        rango_edad: this.mapRangoEdad(this.curso?.rango_edad),

        // rango_edad: String(this.curso?.rango_edad),
        tipo_beca: this.curso.tipo_beca,
        tipo_curso: this.curso.tipo_curso,
        convenio_numero: this.curso.convenio_numero,
        cruzada_contra_hambre: this.mapCruzadaContraHambre(this.curso?.cruzada_contra_hambre),
        cuota_tipo: this.mapCuotaTipo(this.curso?.cuota_tipo), // Mapeo para cuota_tipo

        // cruzada_contra_hambre: this.curso.cruzada_contra_hambre,
        // cuota_tipo: this.curso.cuota_tipo,
        cuota_monto: this.curso.cuota_monto,
        // pagar_final: this.curso.pagar_final,
        pagar_final: this.mapPagarFinal(this.curso?.pagar_final), // Mapeo para pagar_final

        participantes: this.curso.participantes,
        // cant_instructores: this.curso.cant_instructores,
        cant_instructores: String(this.curso?.cant_instructores), // Convierte a cadena

        // cant_instructores: this.curso.cant_instructores || '', // Asignamos el valor recibido o un valor predeterminado
        // cant_instructores: this.curso.cant_instructores || '1', // Selecciona dinámicamente o usa "Uno" como valor predeterminado
        // cant_instructores:1, // Valor inicial en "1"

        // plantel: {
        calle: this.curso.plantel_calle,
        localidad: this.curso.plantel_localidad,
        municipio: this.curso.plantel_municipio,
        num_interior: this.curso.plantel_num_interior,
        num_exterior: this.curso.plantel_num_exterior,
        // },

        lunes_inicio: this.curso.lunes_inicio,
        lunes_fin: this.curso.lunes_fin,
        martes_inicio: this.curso.martes_inicio,
        martes_fin: this.curso.martes_fin,
        miercoles_inicio: this.curso.miercoles_inicio,
        miercoles_fin: this.curso.miercoles_fin,
        jueves_inicio: this.curso.jueves_inicio,
        jueves_fin: this.curso.jueves_fin,
        viernes_inicio: this.curso.viernes_inicio,
        viernes_fin: this.curso.viernes_fin,
        sabado_inicio: this.curso.sabado_inicio,
        sabado_fin: this.curso.sabado_fin,
        domingo_inicio: this.curso.domingo_inicio,
        domingo_fin: this.curso.domingo_fin

      });



      // Limpiar los arrays de docentes y alumnos
      this.cursoForm.setControl('docentes', this.fb.array([]));
      this.cursoForm.setControl('alumnos', this.fb.array([]));
      // Obtener datos almacenados en localStorage
      const docentesSeleccionados = JSON.parse(localStorage.getItem('docentesSeleccionados') || '[]');

      // Cargar los docentes en el FormArray
      const docentesArray = this.cursoForm.get('docentes') as FormArray;
      this.docentes.forEach(docente => {
        // Verificar si este docente ya está seleccionado
        const seleccionado = docentesSeleccionados.some((d: any) => d.id === docente.id);

        docentesArray.push(this.fb.group({
          nombre: docente.nombre,
          docente_apellidos: docente.docente_apellidos,
          email: docente.email,
          telefono: docente.telefono,
          selected: [seleccionado] // Añadimos el estado de selección
        }));
      });



      // Cargar los alumnos en el FormArray
      const alumnosArray = this.cursoForm.get('alumnos') as FormArray;
      this.alumnos.forEach((alumno: any) => {
        alumnosArray.push(this.fb.group({
          nombre: alumno.nombre,
          apellidos: alumno.apellidos,
          email: alumno.email,
          telefono: alumno.telefono
        }));
      });

      console.log("cargando ...........", this.cursoForm.value); // Para verificar que los datos se han cargado correctamente
    });
  }




  onSelectionChange(): void {
    const docentesArray = this.cursoForm.get('docentes') as FormArray;




    // Filtrar los docentes seleccionados
    const docentesSeleccionados = docentesArray.controls
      .filter(group => group.get('selected')?.value)
      .map(group => ({
        id: group.get('id')?.value,
        nombre: group.get('nombre')?.value,
        docente_apellidos: group.get('docente_apellidos')?.value,
        email: group.get('email')?.value,
        telefono: group.get('telefono')?.value
      }));

    // Guardar en localStorage
    localStorage.setItem('docentesSeleccionados', JSON.stringify(docentesSeleccionados));
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Retorna solo la parte de fecha en formato YYYY-MM-DD
  }

  getDocentes__asignar() {
    this.docenteService.getDocentes().subscribe((response) => {
      this.getDocentes_a_asignar = response;
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
            console.log("-----------------------------")
            console.log("-----------------------------")
            console.log("-----------Peticon 1 trae curso por id de plantel------------------")
            console.log("-----------------------------", this.cursosSolicitados)
            console.log("-----------------------------")
            console.log("-----------------------------")
            console.log("-----------------------------")
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
      this.mostrarDetalleModal = true
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
  asignarDocentes(): void {
    if (this.selectedInstructors.length > 0) {
      // Evitar duplicados en la lista de asignación antes de enviarlo al backend
      const docentesSinDuplicados = [...new Set(this.selectedInstructors)];

      // Enviar docentes uno por uno
      docentesSinDuplicados.forEach(docenteId => {
        this.cursoDocenteS_.asignarDocenteACurso(docenteId, this.curso.id).subscribe(
          (response) => {
            console.log('Docente asignado con éxito:', response);
          },
          (error) => {
            console.error('Error al asignar docente:', error);
          }
        );
      });

      // Limpia la selección después de asignar
      this.selectedInstructors = [];
    }
  }



  // asignarDocente(): void {
  //   const cursoId = this.curso; // ID del curso

  //   // Asegurarse de que haya docentes seleccionados
  //   if (this.selectedInstructors.length > 0 && cursoId) {
  //     this.selectedInstructors.forEach(docenteId => {
  //       this.cursoDocenteS_
  //         .asignarDocenteACurso(docenteId, cursoId.id)
  //         .subscribe(
  //           (response) => {
  //             console.log('Docente asignado:', response);
  //             this.closeModal(); // Cierra el modal o lo que necesites hacer tras asignar
  //             this.cargarCursosByIdPlantel(); // Vuelve a cargar los cursos o actualiza la vista
  //           },
  //           (error) => {
  //             console.error('Error al asignar docente:', error);
  //           }
  //         );
  //     });
  //   } else {
  //     console.log('No se seleccionaron docentes');
  //   }
  // }


  // Método para verificar si el docente ya ha sido asignado
  isDocenteAsignado(docenteId: number): boolean {
    // Aquí se asume que `this.asignados` es un array con los docentes ya asignados al curso
    return this.selectedInstructors.includes(docenteId);
  }



  guardarCambios() {
    console.log("id_plantel_curso_a_editar al guardar cambios *** detalles", this.id_plantel_curso_a_editar);

    // Obtén los datos del formulario
    const formValues = this.cursoForm.value;

    // Combina el objeto curso con las demás propiedades y convierte el valor de "cruzada_contra_hambre" a booleano
    const cursoData = {
      ...formValues, // Toma todas las propiedades del formulario
      cruzada_contra_hambre: formValues.cruzada_contra_hambre === 'Sí', // Convierte 'Sí' a true y 'No' a false
      docentes: this.cursoForm.get('docentes')?.value, // Incluye los docentes del FormArray
      alumnos: this.cursoForm.get('alumnos')?.value // Incluye los alumnos del FormArray
    };

    // Llama al servicio para actualizar la solicitud
    this.plantelCursosService.updateCourseSolicitudById(Number(this.id_plantel_curso_a_editar), cursoData).subscribe({
      next: (response) => {
        console.log('Solicitud actualizada con éxito:', response);
        this.openModal(this.id_plantel_curso_a_editar);
      },
      error: (error) => {
        console.error('Error al actualizar la solicitud:', error);
      },
    });
  }










  modalVisibleInstructor: boolean = false;
  modalVisibleAlumno: boolean = false;
  tituloModal: string = '';
  tablaData: any[] = [];

  // Datos iniciales
  alumnosNuevos!: any[];

  // instructores = [
  //   { nombre: 'Ana', apellido: 'Martínez', selected: false },
  //   { nombre: 'Pedro', apellido: 'Rodríguez', selected: true },
  //   { nombre: 'Sofía', apellido: 'Torres', selected: false },
  //   { nombre: 'Luis', apellido: 'Gómez', selected: false },
  //   { nombre: 'Pepe', apellido: 'Gómez', selected: false },
  //   { nombre: 'Antonio', apellido: 'Gómez', selected: false },
  //   { nombre: 'Raúl', apellido: 'Gómez', selected: false },
  //   { nombre: 'Juan', apellido: 'Gómez', selected: false },
  //   { nombre: 'Mario', apellido: 'Gómez', selected: false },
  //   { nombre: 'María', apellido: 'Fernández', selected: false }
  // ];

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


  //    // Obtener datos paginados solo de instructores
  // get paginatedData() {
  //   const startIndex = (this.currentPage - 1) * this.rowsPerPage;
  //   return this.instructores.slice(startIndex, startIndex + this.rowsPerPage);
  // }

  // get totalPages() {
  //   return Math.ceil(this.instructores.length / this.rowsPerPage);
  // }
  toggleSelectAll(event: any): void {
    const selectAll = event.target.checked;

    // Actualizamos todos los instructores según si seleccionamos todo o no
    this.docentes_con_misma_especialidad.forEach(instructor => {
      instructor.selected = selectAll;
    });

    // Actualizamos la lista de docentes seleccionados
    if (selectAll) {
      this.selectedDocentes = this.docentes_con_misma_especialidad.map(instructor => instructor.docente_id);
    } else {
      this.selectedDocentes = [];
    }
    console.log('Docentes seleccionados:', this.selectedDocentes); // Para depuración
  }

  // toggleSelectAll(event: Event) {
  //   const checked = (event.target as HTMLInputElement).checked;
  //   this.instructores.forEach(item => (item.selected = checked));
  // }

  // get allSelected() {
  //   return this.instructores.every(item => item.selected);
  // }

  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //   }
  // }

  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //   }
  // }


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


  selectedInstructors: number[] = [];
  isMultipleSelection = false;

  updateSelectionMode() {
    const numInstructores = this.cursoForm.get('cant_instructores')?.value;
    console.log("numInstructores**_", numInstructores)
    this.isMultipleSelection = numInstructores === '2';
    if (!this.isMultipleSelection && this.selectedInstructors.length > 1) {
      // Si cambia a "Uno", conserva solo el primer seleccionado
      this.selectedInstructors = [this.selectedInstructors[0]];
      console.log("this.selectedInstructors**", this.selectedInstructors)
      this.cursoForm.get('instructor')?.setValue(this.selectedInstructors);
    }
  }



  // isSelectionDisabled(id: number): boolean {
  //   // Si es selección única y ya hay uno seleccionado, desactiva los demás
  //   return !this.isMultipleSelection && this.selectedInstructors.length >= 1 && !this.selectedInstructors.includes(id);
  // }

  isSelectionDisabled(id: number): boolean {
    // Si es selección única y ya hay uno seleccionado, desactiva los demás
    return !this.isMultipleSelection && this.selectedInstructors.length >= 1 && !this.selectedInstructors.includes(id);
  }

  // toggleSelection(event: any, docente_id: number): void {
  //   if (event.target.checked) {
  //     // Si el checkbox está marcado, agregamos el docente a la lista de seleccionados
  //     this.selectedDocentes.push(docente_id);
  //   } else {
  //     // Si el checkbox está desmarcado, eliminamos el docente de la lista de seleccionados
  //     this.selectedDocentes = this.selectedDocentes.filter(id => id !== docente_id);
  //   }
  //   console.log('Docentes seleccionados:', this.selectedDocentes); // Para depuración
  // }
  // toggleSelection(docenteId: number): void {
  //   if (this.isSelected(docenteId)) {
  //     this.selectedInstructors = this.selectedInstructors.filter(id => id !== docenteId);
  //   } else {
  //     this.selectedInstructors.push(docenteId);
  //   }
  // }
  toggleSelection(docenteId: number): void {
    const index = this.selectedInstructors.indexOf(docenteId);
    if (index === -1) {
      this.selectedInstructors.push(docenteId); // Agregar a la lista
    } else {
      this.selectedInstructors.splice(index, 1); // Eliminar de la lista
    }
  }
  // asignarODesasignarDocentes(): void {
  //   const action: 'asignar' | 'desasignar' = this.isAllSelected() ? 'desasignar' : 'asignar';

  //   this.selectedInstructors.forEach(docenteId => {
  //     this.cursoDocenteS_.asignarODesasignarDocenteACurso(docenteId, this.curso.id, action).subscribe(
  //       (response) => {
  //         console.log(`Docente ${action}ado con éxito:`, response);
  //       },
  //       (error) => {
  //         console.error(`Error al ${action}ar docente:`, error);
  //       }
  //     );
  //   });

  //   // Limpiar la selección después de la operación
  //   this.selectedInstructors = [];
  // }
  asignarODesasignarDocentes(): void {
    if (this.selectedInstructors.length === 0) {
      console.warn('No hay docentes seleccionados.');
      return;
    }

    // Enviar la lista de IDs al backend
    this.cursoDocenteS_.asignarODesasignarDocenteACurso(this.selectedInstructors, this.curso.id).subscribe(
      (response) => {
        console.log('Operación completada con éxito:', response);
        // Limpiar la selección después de la operación
        this.selectedInstructors = [];
      },
      (error) => {
        console.error('Error al realizar la operación:', error);
      }
    );
  }
  // Verifica si todos los docentes están seleccionados
  isAllSelected(): boolean {
    return this.selectedInstructors.length === this.docentes_con_misma_especialidad.length;
  }
  // Función para verificar si un docente está seleccionado
  isSelected(docenteId: number): boolean {
    console.log("isSelected{{{{{{{{{{{{{{", docenteId)
    return this.selectedInstructors.includes(docenteId);
  }



}