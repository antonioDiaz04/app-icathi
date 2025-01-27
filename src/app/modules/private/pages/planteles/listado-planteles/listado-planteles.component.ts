import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlantelesService } from '../../../../../shared/services/planteles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CursosService } from '../../../../../shared/services/cursos.service';
import { AlumnoPlantelCursoService } from '../../../../../shared/services/alumno-plantel-curso.service';

declare var $: any;

@Component({
    selector: 'app-listado-planteles',
    templateUrl: './listado-planteles.component.html',
    styleUrls: ['./listado-planteles.component.scss'],
    standalone: false
})
export class ListadoPlantelesComponent implements OnInit {
  planteles: any; // Lista de planteles
  idPlantel!: any; // ID del plantel seleccionado
  dataPlantel!: any; // Datos del plantel seleccionado
  editForm!: FormGroup; // Formulario reactivo para edición
  plantelDetails: any;
  cursos: any[] = [];
  isModalOpen: boolean = false;
  isModalOpenverDetalleCursos: boolean = false;
  isModalAlumnosOpen: boolean = false;
  alumnos: any[] = [];
  id_pplantel:  number=0
  @ViewChild('confirmModal') confirmModal!: ElementRef; // Referencia al modal de confirmación

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private router: Router,
    private alumnoPlantelCursoService: AlumnoPlantelCursoService,
    private plantelService_: PlantelesService
  ) {
    // Inicialización del formulario
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.maxLength(15)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      director: ['', [Validators.required, Validators.maxLength(100)]],
      capacidad_alumnos: ['', Validators.required],
      estatus: [true],
      usuario_gestor_id: ['', Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(50)]],
      municipio: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  verDetalleCursos(plantelId: number): void {
    this.plantelService_.getCursosByPlantelId(plantelId).subscribe(
      (data) => {
        this.cursos = data;
        console.log("datos cursos ",this.cursos)
        this.isModalOpenverDetalleCursos = true; // Abrir el modal
        this.id_pplantel=plantelId
      },
      (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    );
  }
  verAlumnosCurso(idPlantel: number,cursoId: number): void {
    this.alumnoPlantelCursoService.obtenerAlumnosPorPlantelYCurso(idPlantel, cursoId).subscribe(

    // this.cursosService.getAlumnosCurso(idPlantel, cursoId).subscribe(
      (data) => {
        this.alumnos = data;
        this.isModalAlumnosOpen = true;
      },
      (error) => {
        console.error('Error al cargar los alumnos:', error);
      }
    );
  }
  cerrarModal(): void {
    this.isModalOpenverDetalleCursos = false; // Cerrar el modal
  }

  cerrarModalAlumnos(): void {
    this.isModalAlumnosOpen = false;
  }
  ngOnInit(): void {
    this.getPlanteles(); // Cargar la lista de planteles al inicializar
  }
 getPlantelDetails(plantelId: number): void {
    this.plantelService_.getPlantelDetails(plantelId).subscribe({
      next: (data) => {
        this.plantelDetails = data;
        console.log('Detalles del plantel:', data);
      },
      error: (error) => {
        console.error('Error al obtener los detalles del plantel:', error);
      }
    });
  }
  getPlanteles(): void {
    // Obtener la lista de planteles
    this.plantelService_.getPlanteles().subscribe({
      next: async (planteles) => {
        this.planteles = planteles;

        // Obtener detalles para cada plantel
        for (const plantel of this.planteles) {
          const details = await this.plantelService_
            .getPlantelDetails(plantel.id)
            .toPromise();
          plantel.total_cursos = details.total_cursos;
          
          plantel.total_alumnos = details.total_alumnos;
          console.log("-------DATA PLANTEL",plantel)
        }
      },
      error: (error) => {
        console.error('Error al obtener la lista de planteles:', error);
      }
    });
  }
  // getPlanteles() {
  //   this.plantelService_.getPlanteles().subscribe((response) => {
  //     this.planteles = response;
  //   });
  // }

  // Navegación
  navigateTo(action: string): void {
    if (action === 'frm-plantel') {
      this.router.navigate(['/privado/', action]); // Redirige a edición
    } else if (action === 'eliminar') {
      this.router.navigate(['/eliminar']); // Redirige a eliminación
    }
  }

  // Mostrar modal de confirmación
  mostrarModal(id: any): void {
    this.idPlantel = id;
    $(this.confirmModal.nativeElement)
      .modal({
        closable: false, // No permite cerrar haciendo clic fuera
        onApprove: () => {
          this.eliminarElemento();
        },
        onDeny: () => {
          console.log('Eliminación cancelada');
        },
      })
      .modal('show');
  }

  // Abrir modal de edición
  openModal(id: any) {
    this.idPlantel = id;
    this.getPlantelById(); // Cargar los datos del plantel seleccionado
    this.isModalOpen = true;
  }

  // Cerrar modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Obtener datos del plantel por ID
  getPlantelById() {
    this.plantelService_.getPlantelById(this.idPlantel).subscribe({
      next: (response) => {
        this.dataPlantel = response;
        this.editForm.patchValue(this.dataPlantel); // Cargar datos en el formulario
      },
    });
  }

  // Enviar datos del formulario
  onSubmit() {
    if (this.editForm.valid) {
      // Obtener los datos del formulario
      // const formData = this.editForm.value;
      const formData = {
        nombre: this.editForm.get('nombre')?.value,
        direccion: this.editForm.get('direccion')?.value,
        telefono: this.editForm.get('telefono')?.value,
        email: this.editForm.get('email')?.value,
        director: this.editForm.get('director')?.value,
        capacidad_alumnos: this.editForm.get('capacidad_alumnos')?.value,
        estatus: this.editForm.get('estatus')?.value,
        usuario_gestor_id: this.editForm.get('usuario_gestor_id')?.value,
        estado: this.editForm.get('estado')?.value,
        municipio: this.editForm.get('municipio')?.value,
      };

      // Llamar al servicio para actualizar el plantel
    console.log("data=>",formData)

      this.plantelService_.updatePlantel(this.idPlantel, formData).subscribe({
        next: (response) => {
          console.log('Plantel actualizado con éxito:', response);
          // Cerrar el modal
          this.closeModal();
          // Actualizar la lista de planteles
          this.getPlanteles();
        },
        error: (error) => {
          console.error('Error al actualizar el plantel:', error);
          const mensajeError =
            error.error?.message ||
            'Ocurrió un error al intentar actualizar el plantel.';
          // Puedes agregar aquí una notificación o mensaje al usuario
          alert(mensajeError);
        },
      });
    } else {
      console.log('Formulario inválido');
      // Opcional: puedes mostrar mensajes de error específicos en el formulario
      // this.editForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores

    }
  }

  // Eliminar un elemento
  eliminarElemento(): void {
    this.plantelService_.deletePlantel(this.idPlantel).subscribe({
      next: (response) => {
        console.log('Elemento eliminado con éxito:', response);
        this.getPlanteles(); // Actualizar lista de planteles
      },
      error: (error) => {
        console.error('Error al eliminar el elemento:', error);
      },
    });
  }
}
