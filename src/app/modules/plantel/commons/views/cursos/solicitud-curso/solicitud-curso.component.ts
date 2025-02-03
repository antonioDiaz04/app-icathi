import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../../../shared/services/auth.service";
import { HttpClient } from "@angular/common/http";
import { CursosService } from "../../../../../../shared/services/cursos.service";
import { environment } from "../../../../../../../environments/environment.prod";
import { DocenteService } from "../../../../../../shared/services/docente.service";
// import EventEmitter from "events";

import { trigger, state, style, animate, transition } from '@angular/animations';
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

@Component({
  selector: "app-solicitud-curso",
  templateUrl: "./solicitud-curso.component.html",
  styles: ``,
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
})
export class SolicitudCursoComponent implements OnInit, OnChanges {
  selectedTab: number = 1; // Tab seleccionado por defecto

  selectTab(tabNumber: number): void {
    this.selectedTab = tabNumber;
  }

  cursoForm: FormGroup;
  cursosSolicitados: Modulo[] = [];
  filtroNombre: string = "";
  filtroNivel: string = "";
  filtroDuracion: number | null = null; // Puede ser null para indicar que no hay filtro
  especialidadesByArea: any[] = [];
  cursosByEspecialidad: any[] = [];
  docentes!: any;
  isLoading: boolean = false;

  filtroId: string = "";

  @Input() areaId!: number;
  mostrarFormulario: boolean = false;
  @Output() mostrarFormularioChange = new EventEmitter<boolean>();
  private apiUrl = `${environment.api}`;

  constructor(
    private cursosService: CursosService,
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private docenteService: DocenteService
  ) {
    // this.plantel_id = this.authService.getIdFromToken();
    this.cursoForm = this.fb.group({
      especialidad_id: ["", Validators.required], // Especialidad (obligatoria)
      curso_id: ["", Validators.required], // Curso (obligatorio)
      horario: ["", Validators.required], // Horario (obligatorio)
      cupo_maximo: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100)], // Cupo máximo (entre 1 y 100)
      ],
      requisitos_extra: [""], // Requisitos adicionales (opcional)
      fecha_inicio: ["", Validators.required], // Fecha de inicio (obligatoria)
      fecha_fin: ["", Validators.required], // Fecha de fin (obligatoria)

      // int
      num_instructores: ["uno", Validators.required], // Número de instructores (obligatorio)
      // instructor: ["", Validators.required], // Instructor(es) (obligatorio)
     instructor: [[]], // Para almacenar los IDs de los instructores seleccionados
      
      municipio: ["", Validators.required],
      localidad: ["", Validators.required],
      calle: ["", Validators.required],
      num_interior: [0, Validators.required],
      num_exterior: [0, Validators.required],
      referencia: ["", Validators.required],





      turno: ["", Validators.required], // Turno (obligatorio)
      tipo_horario: ["", Validators.required], // Tipo de Horario (obligatorio)

      // horario
      lunes_inicio: ["08:00"], // Valor predeterminado
      lunes_fin: ["13:00"], // Valor predeterminado
      martes_inicio: ["08:00"],
      martes_fin: ["13:00"],
      miercoles_inicio: ["08:00"],
      miercoles_fin: ["13:00"],
      jueves_inicio: ["08:00"],
      jueves_fin: ["13:00"],
      viernes_inicio: ["08:00"],
      viernes_fin: ["13:00"],
      sabado_inicio: ["08:00"],
      sabado_fin: ["13:00"],
      domingo_inicio: ["08:00"],
      domingo_fin: ["13:00"],

      // sector inicial
      sector: ["Productivo"], // Valor inicial

      // <!-- Rango de Edad 👍-->

      rango_edad: ["11-14"], // Valor inicial para el rango de edad

      // <!-- Cruzada contra el hambre   👍-->
      cruzada_contra_hambre: ["No"], // Valor inicial para Cruzada contra el hambre

      // <!-- Tipo de Beca 👍-->
      tipo_beca: ["Ninguna"], // Valor inicial para Tipo de Beca
      // <!-- Participantes 👍-->
      participantes: [0], // Valor inicial para Participantes

      cuota_tipo: ["Por Grupo"], // Valor inicial para Cuota de inscripción
      cuota_monto: [null],

      // <!-- pagar_al_final 👍-->

      pagar_final: [null], // Valor inicial para Monto
      // <!-- Número de Convenio u Oficio 👍-->
      convenio: [""],
      convenio_numero: [""], // Valor inicial para Número de Convenio u Oficio
      // tipo_curso
      // Modificado campo de tipo_curso
      tipo_curso: [0, Validators.required], // 0 = Presencial, 1 = En Línea
    });
  }

  ngOnInit(): void {
    this.getDocentes();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["areaId"]) {
      const newAreaId = changes["areaId"].currentValue;
      console.log("areaId cambió a:", newAreaId);
      this.getEspecialidadesByAreaId(newAreaId); // Llamar a la función con el nuevo id
    }

    // Aquí puedes agregar lógica adicional si es necesario
  }

  getDocentes() {
    this.docenteService.getDocentes().subscribe((response) => {
      this.docentes = response;
    });
  }

  close(): void {
    this.mostrarFormularioChange.emit(false); // Emitir el valor booleano
  }






    selectedInstructors: number[] = [];
    isMultipleSelection = false;
  
    // constructor(private fb: FormBuilder) {
    //   this.form = this.fb.group({
    //     num_instructores: [''],
    //     instructor: [[]], // Para almacenar los IDs de los instructores seleccionados
    //   });
    // }
  
    updateSelectionMode() {
      const numInstructores = this.cursoForm.get('num_instructores')?.value;
      this.isMultipleSelection = numInstructores === '2';
      if (!this.isMultipleSelection && this.selectedInstructors.length > 1) {
        // Si cambia a "Uno", conserva solo el primer seleccionado
        this.selectedInstructors = [this.selectedInstructors[0]];
        this.cursoForm.get('instructor')?.setValue(this.selectedInstructors);
      }
    }
  
    toggleSelection(event: Event, id: number) {
      const checked = (event.target as HTMLInputElement).checked;
      if (checked) {
        if (!this.isMultipleSelection && this.selectedInstructors.length >= 1) {
          // Si es selección única, reemplaza el seleccionado
          this.selectedInstructors = [id];
        } else {
          // Agregar a la selección
          this.selectedInstructors.push(id);
        }
      } else {
        // Remover de la selección
        this.selectedInstructors = this.selectedInstructors.filter((instructorId) => instructorId !== id);
      }
      this.cursoForm.get('instructor')?.setValue(this.selectedInstructors);
    }
  
    isSelected(id: number): boolean {
      return this.selectedInstructors.includes(id);
    }
  
    isSelectionDisabled(id: number): boolean {
      // Si es selección única y ya hay uno seleccionado, desactiva los demás
      return !this.isMultipleSelection && this.selectedInstructors.length >= 1 && !this.selectedInstructors.includes(id);
    }
  




    semanaInicio: string = '';
    semanaFin: string = '';

    calcularSemana() {
      const fechaInicio = this.cursoForm.get('fecha_inicio')?.value;
      const fechaFin = this.cursoForm.get('fecha_fin')?.value;
    
      if (fechaInicio && fechaFin) {
        // Crear los objetos Date desde las fechas ingresadas
        const inicio = new Date(`${fechaInicio}T00:00:00`); // Aseguramos formato ISO
        const fin = new Date(`${fechaFin}T00:00:00`); // Aseguramos formato ISO
    
        // Formatear las fechas para evitar ajustes de zona horaria
        const opciones: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
    
        // Formatear las fechas seleccionadas
        this.semanaInicio = inicio.toLocaleDateString('es-ES', opciones);
        this.semanaFin = fin.toLocaleDateString('es-ES', opciones);
      } else {
        // Limpiar las variables si no hay fechas
        this.semanaInicio = '';
        this.semanaFin = '';
      }
    }
    
    



  resetFilters() {
    // this.filtroId = '';
    this.filtroNombre = "";
    this.filtroNivel = "";
    this.filtroDuracion = null;
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
  enviarSolicitud(): void {
    console.log("Inicio de la solicitud");
    this.isLoading = true;
    // if (!this.cursoForm.valid) {
    //   this.isLoading = false;
    //   console.error("El formulario contiene errores o campos vacíos");
    //   return;
    // }

    this.authService
      .getIdFromToken()
      .then((plantelId) => {
        if (!plantelId) {
          console.error("No se pudo obtener el ID del plantel");
          return;
        }

        const requestBody = {
          especialidad_id: this.cursoForm.value.especialidad_id,
          plantelId: plantelId.toString(),
          curso_id: this.cursoForm.value.curso_id,
          horario: this.cursoForm.value.horario,
          cupo_maximo: this.cursoForm.value.cupo_maximo,
          requisitos_extra: this.cursoForm.value.requisitos_extra,
          fecha_inicio: this.cursoForm.value.fecha_inicio,
          fecha_fin: this.cursoForm.value.fecha_fin,

          // Campos adicionales
          num_instructores: this.cursoForm.value.num_instructores,
          instructor: this.cursoForm.value.instructor,
          turno: this.cursoForm.value.turno,
          tipo_horario: this.cursoForm.value.tipo_horario,

          // Dirección
          municipio: this.cursoForm.value.municipio,
          localidad: this.cursoForm.value.localidad,
          calle: this.cursoForm.value.calle,
          num_interior: this.cursoForm.value.num_interior,
          num_exterior: this.cursoForm.value.num_exterior,
          referencia: this.cursoForm.value.referencia,

          // Horarios diarios
          lunes_inicio: this.cursoForm.value.lunes_inicio,
          lunes_fin: this.cursoForm.value.lunes_fin,
          martes_inicio: this.cursoForm.value.martes_inicio,
          martes_fin: this.cursoForm.value.martes_fin,
          miercoles_inicio: this.cursoForm.value.miercoles_inicio,
          miercoles_fin: this.cursoForm.value.miercoles_fin,
          jueves_inicio: this.cursoForm.value.jueves_inicio,
          jueves_fin: this.cursoForm.value.jueves_fin,
          viernes_inicio: this.cursoForm.value.viernes_inicio,
          viernes_fin: this.cursoForm.value.viernes_fin,
          sabado_inicio: this.cursoForm.value.sabado_inicio,
          sabado_fin: this.cursoForm.value.sabado_fin,
          domingo_inicio: this.cursoForm.value.domingo_inicio,
          domingo_fin: this.cursoForm.value.domingo_fin,

          // Otros campos
          sector: this.cursoForm.value.sector,
          rango_edad: this.cursoForm.value.rango_edad,
          cruzada_contra_hambre: this.cursoForm.value.cruzada_contra_hambre,
          tipo_beca: this.cursoForm.value.tipo_beca,
          participantes: this.cursoForm.value.participantes,
          cuota_tipo: this.cursoForm.value.cuota_tipo,
          cuota_monto: this.cursoForm.value.cuota_monto || null,
          pagar_final: this.cursoForm.value.pagar_final || null,
          convenio_numero: this.cursoForm.value.convenio_numero,
          tipo_curso: this.cursoForm.value.tipo_curso,
        };

        console.log("Datos enviados al backend:", requestBody);

        // Enviar el objeto al servicio
        this.http
          .post<Modulo>(`${this.apiUrl}/planteles-curso`, requestBody)
          .subscribe({
            next: (cursoCreado) => {
              this.cursosSolicitados.push(cursoCreado);
              this.mostrarFormulario = false;
              this.isLoading = false;
              this.cursoForm.reset();

              this.mostrarFormularioChange.emit(false); // Emitir el valor booleano
              alert("Datos enviados exitosamente al backend"); // Mostrar alerta de éxito
              console.log("Curso agregado correctamente:", cursoCreado);
            },
            error: (err) => {
              console.error("Error al agregar el curso:", err);
              this.isLoading = false;
            },
          });
      })
      .catch((error) => {
        this.isLoading = false;
        console.error("Error al obtener el ID del plantel:", error);
      });
  }

  
  onEspecialidadChange(event: Event): void {
    const especialidadId = Number((event.target as HTMLSelectElement).value); // Obtener el ID de la especialidad seleccionada
    console.log("especialidadId******",especialidadId)
    if (!isNaN(especialidadId)) {
      this.getCursosByEspecialidadId(especialidadId); // Cargar cursos relacionados
    } else {
      console.warn("Especialidad no válida seleccionada.");
    }
  }

  getCursosByEspecialidadId(especialidadId: number): void {
    this.authService.getIdFromToken().then((plantelId) => {
      if (!plantelId) {
        console.error("No se pudo obtener el ID del plantel");
        return;
      }
      console.log("aqui se esta haciendo pa peticion para obtener los cursos de acuerdo ala especialidad",especialidadId, plantelId)
      this.cursosService
        .getCursosByEspecialidadId(especialidadId, plantelId)
        .subscribe(
          (cursos) => {
            this.cursosByEspecialidad = cursos; // Actualizar los cursos disponibles
                      console.log("this.cursosByEspecialidad",this.cursosByEspecialidad)

          },
          (error) => {
            console.error("Error al obtener los cursos:", error);
          }
        );
    });
  }

  getEspecialidadesByAreaId(areaId: number) {
    this.cursosService.getEspecialidadesByAreaId(areaId).subscribe(
      (especialidades) => {
        this.especialidadesByArea = especialidades;
        console.log("this.especialidadesByArea",this.especialidadesByArea)
      },
      (error) => {
        console.error("Error al obtener las especialidades:", error);
      }
    );
  }
}
