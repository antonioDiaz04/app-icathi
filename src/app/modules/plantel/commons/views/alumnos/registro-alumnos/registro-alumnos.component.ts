import { Component, OnInit } from '@angular/core';
import { AreasService } from '../../../../../../shared/services/areas.service';
import { EspecialidadesService } from '../../../../../../shared/services/especialidad.service';
import { CursosService } from '../../../../../../shared/services/cursos.service';
import { PlantelesService } from '../../../../../../shared/services/planteles.service';
import { Router } from '@angular/router';
import { AspiranteService } from '../../../../../../shared/services/aspirante.service';
import { AuthService } from '../../../../../../shared/services/auth.service';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
})
export class RegistroAlumnosComponent implements OnInit {
  step: number = 1;
  area_id: number = 0;
  isLoading: boolean = false;
  isModalOpen = false;

  formData = {
    plantel: '',
    area: '',
    especialidad: '',
    curso: '',
    name: '',
    curp: '',
    email: '',
    telefono: '',
  };
  formDataNAME = {
    plantel: '',
    area: '',
    especialidad: '',
    curso: '',
  };

  planteles: any[] = [];
  areas: any[] = [];
  especialidades: any[] = [];
  especialidadesFiltradas: any[] = [];
  cursosFiltrados: any[] = [];
  idPlantel: any;
  constructor(
    private router: Router,
    private aspiranteService: AspiranteService,
    private plantelesService: PlantelesService,
    private areasService: AreasService,
    private especialidadesService: EspecialidadesService,
    private cursosService: CursosService,
    private autService_: AuthService
  ) {}

  async ngOnInit() {
    try {
      const plantelId = await this.autService_.getIdFromToken();
      this.formData.plantel = plantelId !== null ? plantelId.toString() : '';;

      alert(this.formData.plantel);

      // Carga los datos iniciales después de asignar el plantel
      this.loadInitialData();
    } catch (error) {
      alert('Error obteniendo el plantel ID:'+error);
    }
  }


  loadInitialData() {
    this.isLoading = true;

    // Cargar planteles (puedes sustituir por un servicio si es necesario)

    // Cargar áreas


this.autService_.getIdFromToken().then((idPlantel)=>{


    this.areasService.getAreasByIdPlantel(idPlantel).subscribe({
      next: (areas) => {
        this.areas = areas;
        this.isLoading = false;
      },
      error: () => {
        console.error('Error al cargar áreas');
        this.isLoading = false;
      },
    });
    // Cargar áreas
  })
    // this.plantelesService.getPlanteles().subscribe({
    //   next: (plantele) => {
    //     this.planteles = plantele;
    //     this.isLoading = false;
    //   },
    //   error: () => {
    //     console.error('Error al cargar áreas');
    //     this.isLoading = false;
    //   },
    // });
  }

  onAreaSelect(event: Event) {
    this.isLoading = true;
    const selectedAreaId = (event.target as HTMLSelectElement).value;
    console.log('ID de área seleccionada:', selectedAreaId);
    this.area_id = Number(selectedAreaId);

    // Buscar el nombre del área seleccionada en la lista de áreas
    const selectedArea = this.areas.find((area) => area.area_id === this.area_id);

    if (selectedArea) {
      this.isLoading = false;
      console.log('Nombre del área seleccionada:', selectedArea.area_nombre);
      this.formDataNAME.area = selectedArea.area_nombre;
    } else {
      console.error(
        'Área no encontrada para el ID seleccionado:',
        this.area_id
      );
    }

    this.autService_.getIdFromToken().then((idPlantel)=>{

    // Filtrar las especialidades basadas en el área seleccionada
    this.especialidadesService.getEspecialidadesByIdPlantel(idPlantel).subscribe({
      next: (response) => {
        if (response && Object.values(response).length > 0) {
          // Combinar todos los subarreglos en un solo arreglo plano
          this.especialidadesFiltradas = Object.values(response).flat();
    
          console.log('Especialidades filtradas:', this.especialidadesFiltradas);
    
          // Si necesitas asignar algo al formulario
          this.formData.area = this.area_id.toString();
        } else {
          // Mostrar un mensaje o realizar alguna acción cuando no hay especialidades
          console.log('No hay especialidades disponibles para este plantel');
        }
      },
      error: () => {
        console.error('Error al cargar especialidades');
      },
    });
    
    
    
    });
  }

  onEspecialidadSelect(event: Event) {
    const selectedEspecialidadId = (event.target as HTMLSelectElement).value;
    this.formData.especialidad = selectedEspecialidadId;

    console.log('ID de especialidad seleccionada:', selectedEspecialidadId);
    const selectedEspecialidad = this.especialidadesFiltradas.find(
      (especialidad) => especialidad.especialidad_id === Number(selectedEspecialidadId)
    );
    console.log(selectedEspecialidad);
    if (selectedEspecialidad) {
      console.log(
        'Nombre del especialidad seleccionada:',
        selectedEspecialidad.especialidad_nombre
      );
      this.formDataNAME.especialidad = selectedEspecialidad.especialidad_nombre;
    } else {
      console.error(
        'especialidad para el ID seleccionado:',
        selectedEspecialidadId
      );
    }
this.autService_.getIdFromToken().then((idPlatel)=>{

  // Filtrar los cursos basados en la especialidad seleccionada
  this.cursosService.getCursosByIdPlatel(idPlatel).subscribe({
    next: (cursos) => {
        // console.log("cursos",cursos)
        this.cursosFiltrados = cursos.filter(
          (curso: any) =>
            curso.especialidad_id === Number(selectedEspecialidadId)
        );
        // console.log('Cursos filtrados:', this.cursosFiltrados);
      },
      error: () => {
        console.error('Error al cargar los cursos');
      },
    });
      })
  }
  onCursoSelect(event: Event) {
    const selectedCursoId = (event.target as HTMLSelectElement).value;

    console.log('Curso seleccionado:', selectedCursoId);
    // console.log('ID de curso seleccionada:', selectedEspecialidadId);
    const selectedCurso = this.cursosFiltrados.find(
      (curso) => curso.id === Number(selectedCursoId)
    );
    //   console.log(selectedCurso)
    if (selectedCurso) {
      console.log(
        'Nombre del especialidad seleccionada:',
        selectedCurso.nombre
      );
      this.formDataNAME.curso = selectedCurso.nombre;
    } else {
      console.error('especialidad para el ID seleccionado:', selectedCursoId);
    }
    // Actualizar formData con el curso seleccionado
    this.formData.curso = selectedCursoId;
  }

  proceed() {
    this.closeModal();
    // Procede con el siguiente paso, por ejemplo, enviar el formulario
    console.log('Datos confirmados, proceder');
    // Cambiar el paso en el formulario
    this.step = 1; // Por ejemplo, pasar al paso 4
    this.submitForm();
  }
  // Abre el modal
  openModal() {
    console.log('click');
    this.isModalOpen = true;
  }

  // Cierra el modal
  closeModal() {
    this.isModalOpen = false;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  nextStep() {
    if (this.step < 3) this.step++;
  }
  goHome() {
    this.router.navigate(['/']); // Redirige a la ruta principal
  }
  submitForm() {
    console.log('Datos enviados:', this.formData);

    this.aspiranteService.registrarAspiranteByPllantel(this.formData).subscribe(
      (response) => {
        console.log('Registro exitoso:', response);
        alert('Registro completado con éxito');
        this.router.navigate(['/plantel/listado-alumnos']); // Redirige a la ruta principal
      },
      (error) => {
        console.error('Error al registrar aspirante:', error);
        alert('Error al completar el registro. Por favor, intenta nuevamente.');
      }
    );
  }
}
