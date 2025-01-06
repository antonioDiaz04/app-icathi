import { Component, ElementRef, ViewChild } from '@angular/core';
import { DocenteDataService } from '../../commons/services/docente-data.service';
import { EspecialidadesService } from '../../../../shared/services/especialidad.service';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { DocenteService } from '../../../../shared/services/docente.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import { SafeUrlPipe} from '@angular/router';
interface Docente {
  nombre: any;
  apellidos: any;
  email: any;
  telefono: any;
  foto_url: string;
  especialidades: number[];
  curriculum_file_url: string;
  documento_identificacion_file_url: string;
  cedula_file_url: string;
}
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent {
  especialidades: { id: number; nombre: string }[] = [];
  selectedEspecialidades: number[] = []; // Solo los IDs de las especialidades
  selectedEspecialidades_doce: number[] = []; // Solo los IDs de las especialidades
  especialidades_cargadas: any[] = []; // Lista de especialidades

  mensajeEspecialidades: string = '';

  dropdownOpen: boolean = false;
  mostrar_especialidad___: boolean = true;
  inputValue: string = '';
  filteredEspecialidades: { id: number; nombre: string }[] = [];

  isEditing = false;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('cedulaInput') cedulaInput: any;
  @ViewChild('curriculumInput') curriculumInput!: ElementRef;

  @ViewChild('documentoIdentificacionInput')
  documentoIdentificacionInput!: ElementRef;

  curriculumFileName: string = '';
  documentoIdentificacionFileName: string = '';
  cedulaFileName: string = '';
  fileName: string | null = null;

  constructor(
    private router: Router,

    private sanitizer: DomSanitizer,
    public docenteDataService: DocenteDataService,
    private fileUploadService: FileUploadService,
    private docenteService: DocenteService,
    private especialidadesService: EspecialidadesService
  ) {} // Método para disparar el evento click en el input de archivo
  triggerCurriculumFileInput(): void {
    this.curriculumInput.nativeElement.click();
  }
  get docenteData() {
    return this.docenteDataService.docenteData;
  }
  // Manejo del cambio de archivo
  onCurriculumFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.curriculumFileName = file.name;

      // Puedes enviar el archivo al servidor si es necesario
      const formData = new FormData();
      formData.append('curriculum', file);
    }
  }
  ngOnInit(): void {
    this.loadEspecialidades();
    console.log('----', this.docenteDataService.docenteData);
    if (
      this.docenteDataService.docenteData &&
      this.docenteDataService.docenteData.id
    ) {
      this.checkEspecialidades(this.docenteDataService.docenteData.id);
    } else {
      console.warn('El ID del docente es nulo o undefined.');
    }
    if (this.docenteData) {
      this.checkEspecialidades(this.docenteData.id);
    }
  }
  checkEspecialidades(docenteId: number): void {
    this.especialidadesService
      .obtenerEspecialidadesPorDocente(docenteId)
      .subscribe({
        next: (response) => {
          console.log('respuesta ', response);
          this.especialidades_cargadas = response.especialidades;
          console.log('Especialidades cargadas:', this.especialidades);
          if (response.especialidades && response.especialidades.length > 0) {
            console.log(
              `El docente con ID ${docenteId} tiene especialidades asignadas.`
            );
            this.especialidades = response.especialidades.map((esp) => ({
              id: esp.especialidad_id, // Usamos el ID de la especialidad
              nombre: esp.especialidad, // Usamos el nombre de la especialidad´
            }));
            this.selectedEspecialidades_doce = this.especialidades.map(
              (esp) => esp.id
            );
            if (this.selectedEspecialidades_doce.length > 0) {
              this.mostrar_especialidad___ = false;
              this.selectedEspecialidades = this.selectedEspecialidades_doce;
            } else {
              this.mensajeEspecialidades =
                'No hay especialidades seleccionadas por el momento.';
              // alert("no  hay especiLidades aun ")
              this.mostrar_especialidad___ = true; // O cualquier otro valor que desees
            }

            console.log('id de espe', this.selectedEspecialidades_doce);
          } else {
            console.log(
              `El docente con ID ${docenteId} no tiene especialidades asignadas.`
            );
          }
        },
        error: (err) => {
          this.mensajeEspecialidades =
            'No hay especialidades seleccionadas por el momento.';

          // alert("no  hay especiLidades aun ")
        },
      });
  }


  guardarCambios() {
    // Obtener los datos actuales del docente
    const currentDocenteData = { ...this.docenteDataService.docenteData };

    // Crear un objeto para almacenar los cambios
    const docenteDataToSave: Partial<Docente> = {};

    // Siempre incluir los campos obligatorios, aunque no hayan cambiado
    docenteDataToSave.nombre = this.docenteData.nombre;
    docenteDataToSave.apellidos = this.docenteData.apellidos;
    docenteDataToSave.email = this.docenteData.email;

    // Solo actualizar los campos que han cambiado o que son nuevos
    if (this.docenteData.nombre !== currentDocenteData.nombre) {
      docenteDataToSave.nombre = this.docenteData.nombre;
    }
    if (this.docenteData.apellidos !== currentDocenteData.apellidos) {
      docenteDataToSave.apellidos = this.docenteData.apellidos;
    }
    if (this.docenteData.email !== currentDocenteData.email) {
      docenteDataToSave.email = this.docenteData.email;
    }
    if (this.docenteData.telefono !== currentDocenteData.telefono) {
      docenteDataToSave.telefono = this.docenteData.telefono;
    }

    // Verificar si hay cambios en especialidades y actualizarlas si es necesario
    if (
      this.selectedEspecialidades.length > 0 &&
      this.selectedEspecialidades.toString() !==
        (this.docenteData.especialidades || []).toString()
    ) {
      docenteDataToSave.especialidades = this.selectedEspecialidades;
    }

    // Si solo hay cambios en los campos de texto, realizar la actualización
    if (Object.keys(docenteDataToSave).length > 0) {
      this.docenteService
        .updateDocente(this.docenteData.id, docenteDataToSave)
        .subscribe({
          next: (response) => {
            console.log('Datos del docente guardados correctamente:', response);
            this.router.navigate(['/docente/home']); // Ruta por defecto
            this.isEditing = false; // Salir del modo edición
          },
          error: (err) => {
            console.error('Error al guardar los datos del docente:', err);
          },
        });
    } else {
      console.log('No hay cambios para guardar en los campos de texto.');
    }

    // Ahora gestionamos las subidas de archivos si es necesario
    const uploads: Observable<any>[] = [];

    // Subir foto de perfil si se seleccionó un archivo
    const fotoFile = this.fileInput.nativeElement.files[0];
    if (fotoFile) {
      uploads.push(
        this.fileUploadService.uploadProfilePhoto(fotoFile).pipe(
          tap((response) => {
            docenteDataToSave.foto_url = response.image; // Se añade si se sube una nueva imagen
          })
        )
      );
    }

    // Subir currículum si se seleccionó un archivo
    const curriculumFile = this.curriculumInput.nativeElement.files[0];
    if (curriculumFile) {
      uploads.push(
        this.fileUploadService.uploadCurriculum(curriculumFile).pipe(
          tap((response) => {
            docenteDataToSave.curriculum_file_url = response.fileUrl; // Se añade si se sube un nuevo archivo
          })
        )
      );
    }

    // Subir documento de identificación si se seleccionó un archivo
    const documentoIdentificacionFile =
      this.documentoIdentificacionInput.nativeElement.files[0];
    if (documentoIdentificacionFile) {
      uploads.push(
        this.fileUploadService
          .uploadDocumentoIdentificacion(documentoIdentificacionFile)
          .pipe(
            tap((response) => {
              docenteDataToSave.documento_identificacion_file_url =
                response.fileUrl; // Se añade si se sube un nuevo archivo
            })
          )
      );
    }

    // Subir cédula si se seleccionó un archivo
    const cedulaFile = this.cedulaInput.nativeElement.files[0];
    if (cedulaFile) {
      uploads.push(
        this.fileUploadService.uploadCedula(cedulaFile).pipe(
          tap((response) => {
            docenteDataToSave.cedula_file_url = response.fileUrl; // Se añade si se sube un nuevo archivo
          })
        )
      );
    }

    // Si hay archivos para subir, esperar a que todas las subidas finalicen
    if (uploads.length > 0) {
      forkJoin(uploads).subscribe({
        next: () => {
          // Limpiar los datos vacíos o nulos
          this.limpiarDatos(docenteDataToSave);

          // Realizar la petición solo si hay archivos nuevos
          if (Object.keys(docenteDataToSave).length > 0) {
            this.docenteService
              .updateDocente(this.docenteData.id, docenteDataToSave)
              .subscribe({
                next: (response) => {
                  console.log(
                    'Datos del docente guardados correctamente:',
                    response
                  );
                },
                error: (err) => {
                  console.error('Error al guardar los datos del docente:', err);
                },
              });
          }
        },
        error: (err) => {
          console.error('Error al subir los archivos:', err);
        },
      });
    }
  }

  // Método para limpiar datos

  // Método para limpiar datos
  limpiarDatos(data: Partial<Docente>) {
    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof Docente; // Aserción de tipo
      if (!data[typedKey] && data[typedKey] !== 0) {
        // Acepta 0 como un valor válido
        delete data[typedKey];
      }
    });
  }

  // Método para cargar las especialidades desde el servicio
  loadEspecialidades(): void {
    this.especialidadesService.getEspecialidades().subscribe({
      next: (data) => {
        this.especialidades = data.map((e) => ({
          id: e.id,
          nombre: e.nombre,
        }));

        this.filteredEspecialidades = [...this.especialidades]; // Inicializar el filtro
      },
      error: (err) => {
        console.error('Error al cargar especialidades', err);
      },
    });
  }

  /**
   * Sanitiza una URL para ser usada de forma segura en un iframe.
   * @param url URL del archivo.
   */
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Verifica si un archivo puede ser previsualizado.
   * @param url URL del archivo.
   */
  isPreviewable(url: string): boolean {
    const previewableExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const fileExtension = url.split('.').pop()?.toLowerCase();
    return fileExtension
      ? previewableExtensions.includes(fileExtension)
      : false;
  }

  onSelectFile(): void {
    this.cedulaInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      // Puedes manejar la lógica para subir el archivo aquí, si lo necesitas.
      console.log(file); // Muestra el archivo seleccionado
    }
  }

  // Método para editar el perfil
  editarPerfil() {
    this.isEditing = true;
    console.log('Editar perfil');
  }

  // Método para cancelar la edición
  cancelarEdicion() {
    this.isEditing = false;
  }

  // Método para guardar los cambios del perfil

  // Manejo de la carga de una nueva foto
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.docenteData.foto_url = URL.createObjectURL(file);
    }
  }

  // Obtener el nombre de la especialidad por ID

  getEspecialidadName(id: number): string {
    const especialidad = this.especialidades.find((e) => e.id === id);
    return especialidad ? especialidad.nombre : 'Cargando...';
  }

  onSearchChange(searchTerm: string): void {
    this.filteredEspecialidades = this.especialidades.filter((especialidad) =>
      especialidad.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  toggleEspecialidad(especialidad: any): void {
    console.log('agrega<<', this.selectedEspecialidades);
    const index = this.selectedEspecialidades.indexOf(especialidad.id);
    if (index === -1) {
      this.selectedEspecialidades.push(especialidad.id);
    } else {
      this.selectedEspecialidades.splice(index, 1);
    }
  }

  removeSpecialty(especialidadId: number): void {
    const index = this.selectedEspecialidades.indexOf(especialidadId);
    if (index !== -1) {
      this.selectedEspecialidades.splice(index, 1);
    }
  }
  // Método para ver clases
  verClases() {
    console.log('Ver clases');
  }

  triggerDocumentoIdentificacionFileInput(): void {
    this.documentoIdentificacionInput.nativeElement.click();
  }
  getValidadorStatus(usuarioValidadorId: number): string {
    if (!usuarioValidadorId) {
      return 'Asignación de validador pendiente';
    }

    // Aquí podrías añadir lógica adicional si se requieren más estados.
    if (usuarioValidadorId > 0) {
      return 'El validador ya está asignado y el perfil está en proceso de revisión';
    }

    // Valor por defecto si el usuario_validador_id no encaja en los criterios anteriores
    return 'Estado desconocido';
  }

  // Manejo del cambio de archivo
  onDocumentoIdentificacionFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.documentoIdentificacionFileName = file.name;

      // Puedes enviar el archivo al servidor si es necesario
      const formData = new FormData();
      formData.append('documento_identificacion', file);

      // Ejemplo de llamada al servicio
      // this.fileUploadService.upload(formData).subscribe(...);
    }
  }
}
