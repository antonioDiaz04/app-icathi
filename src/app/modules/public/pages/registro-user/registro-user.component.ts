import { Component, OnInit } from '@angular/core';
import { AreasService } from '../../../../shared/services/areas.service';
import { EspecialidadesService } from '../../../../shared/services/especialidad.service';
import { CursosService } from '../../../../shared/services/cursos.service';
import { PlantelesService } from '../../../../shared/services/planteles.service';
import { Router } from '@angular/router';
import { AspiranteService } from '../../../../shared/services/aspirante.service';
import { AlertTaiwilService } from '../../../../shared/services/alert-taiwil.service';
import { ModalTaiwilService } from '../../../../shared/services/modal-taiwil.service';

@Component({
    selector: 'app-registro-user',
    templateUrl: './registro-user.component.html',
    styleUrls: ['./registro-user.component.scss'],
    standalone: false
})
export class RegistroUserComponent implements OnInit {
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

  constructor(
    private router: Router,
    private aspiranteService: AspiranteService,
    private plantelesService: PlantelesService,
    private areasService: AreasService,
    private especialidadesService: EspecialidadesService,
    private cursosService: CursosService,
    private alertTaiwilService: AlertTaiwilService,
    private modalService: ModalTaiwilService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;

    // Cargar planteles (puedes sustituir por un servicio si es necesario)

    // Cargar áreas
    this.areasService.getAreas().subscribe({
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
    this.plantelesService.getPlanteles().subscribe({
      next: (plantele) => {
        this.planteles = plantele;
        this.isLoading = false;
      },
      error: () => {
        console.error('Error al cargar áreas');
        this.isLoading = false;
      },
    });
  }
  onPlantelSelected(event: Event): void {
    const selectedPlantelId = (event.target as HTMLSelectElement).value;

    console.log('Plantel seleccionado:', selectedPlantelId);
    // if (selectedPlantelId) {

    // this.area_id = Number(selectedAreaId);
    this.isLoading = true;

    // Buscar el nombre del área seleccionada en la lista de áreas
    const selectedPlantel = this.planteles.find(
      (plantel) => plantel.id === Number(selectedPlantelId)
    );

    if (selectedPlantel) {
      this.isLoading = false;

      console.log('Nombre del área seleccionada:', selectedPlantel.nombre);
      this.formDataNAME.plantel = selectedPlantel.nombre;
    } else {
      console.error('plantel el ID seleccionado:', selectedPlantelId);
    }
  }
  onAreaSelect(event: Event) {
    this.isLoading = true;
    const selectedAreaId = (event.target as HTMLSelectElement).value;
    console.log('ID de área seleccionada:', selectedAreaId);
    this.area_id = Number(selectedAreaId);

    // Buscar el nombre del área seleccionada en la lista de áreas
    const selectedArea = this.areas.find((area) => area.id === this.area_id);

    if (selectedArea) {
      this.isLoading = false;
      console.log('Nombre del área seleccionada:', selectedArea.nombre);
      this.formDataNAME.area = selectedArea.nombre;
    } else {
      console.error(
        'Área no encontrada para el ID seleccionado:',
        this.area_id
      );
    }

    // Filtrar las especialidades basadas en el área seleccionada
    this.especialidadesService.getEspecialidades().subscribe({
      next: (especialidad) => {
        this.especialidadesFiltradas = especialidad.filter(
          (area: any) => area.area_id === this.area_id
        );
        console.log('Especialidades filtradas:', this.especialidadesFiltradas);
        this.formData.area = this.area_id.toString();
      },
      error: () => {
        console.error('Error al cargar especialidades');
      },
    });
  }

  onEspecialidadSelect(event: Event) {
    const selectedEspecialidadId = (event.target as HTMLSelectElement).value;
    this.formData.especialidad = selectedEspecialidadId;

    console.log('ID de especialidad seleccionada:', selectedEspecialidadId);
    const selectedEspecialidad = this.especialidadesFiltradas.find(
      (especialidad) => especialidad.id === Number(selectedEspecialidadId)
    );
    console.log(selectedEspecialidad);
    if (selectedEspecialidad) {
      console.log(
        'Nombre del especialidad seleccionada:',
        selectedEspecialidad.nombre
      );
      this.formDataNAME.especialidad = selectedEspecialidad.nombre;
    } else {
      console.error(
        'especialidad para el ID seleccionado:',
        selectedEspecialidadId
      );
    }

    // Filtrar los cursos basados en la especialidad seleccionada
    this.cursosService.getCursos().subscribe({
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

    // Mostrar el primer modal indicando que se está procesando el registro
    this.modalService.showModal('Procesando su registro... Por favor, espere.');

    this.aspiranteService.registrarAspirante(this.formData).subscribe(
      (response) => {
        console.log('Registro exitoso:', response);

        // Cambiar el mensaje del modal a "Correo enviado" después de un pequeño retraso
        setTimeout(() => {
          this.modalService.showModal(
            'El registro fue exitoso. Se ha enviado un correo de confirmación.'
          );
        }, 2000); // 2 segundos de espera para cambiar el mensaje

        // Mostrar el tercer modal para informar que el usuario revise su correo
        setTimeout(() => {
          this.modalService.showModal(
            '¡Revisa tu correo para completar el registro!'
          );
        }, 4000); // Mostrar el mensaje final después de 4 segundos

        // Redirigir a la página principal después de 5 segundos
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 5000);
      },
      (error) => {
        // Obtener el mensaje del backend o usar un mensaje predeterminado
        const errorMessage =
          error?.error?.error ||
          'Error al completar el registro. Por favor, intenta nuevamente.';
        // Mostrar un mensaje de error
        this.modalService.showModal(errorMessage);
      }
    );
  }
}
