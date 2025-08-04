// import { Component, ElementRef, signal, ViewChild, computed, effect } from '@angular/core';
// import { DocenteDataService } from '../../commons/services/docente-data.service';
// import { EspecialidadesService } from '../../../../shared/services/especialidad.service';
// import { FileUploadService } from '../../../../shared/services/file-upload.service';
// import { forkJoin, Observable, tap } from 'rxjs';
// import { DocenteService } from '../../../../shared/services/docente.service';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { Router } from '@angular/router';
// import { PendingAlertService } from '../../../../shared/services/pending-alert.service';
// import { AlertTaiwilService } from '../../../../shared/services/alert-taiwil.service';
// import { DocenteComponent } from '../../docente.component';
// import { ValidadorDocenteService } from '../../../validador/commons/services/validador-docente.service';
// import { AuthService } from '../../../../shared/services/auth.service';

// interface Docente {
//   nombre: any;
//   apellidos: any;
//   email: any;
//   telefono: any;
//   foto_url: string;
//   especialidades: number[];
//   curriculum_file_url: string;
//   documento_identificacion_file_url: string;
//   cedula_file_url: string;
// }

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss'],
//   standalone: false
// })
// export class ProfileComponent {
//   especialidades = signal<{ id: number; nombre: string }[]>([]);
//   selectedEspecialidades = signal<number[]>([]);
//   selectedEspecialidades_doce = signal<number[]>([]);
//   especialidades_cargadas = signal<any[]>([]);

//   mensajeEspecialidades = signal<string>('');
//   dropdownOpen = signal<boolean>(false);
//   inputValue = signal<string>('');
//   // dropdownOpen = signal<boolean>(false);
//   mostrar_especialidad___ = signal<boolean>(true);
//   // inputValue = signal<string>('');
//   filteredEspecialidades = signal<{ id: number; nombre: string }[]>([]);
//   isSaving = signal<boolean>(false);
//   isEditing = signal<boolean>(false);

//   @ViewChild('fileInput') fileInput: any;
//   @ViewChild('cedulaInput') cedulaInput: any;
//   @ViewChild('curriculumInput') curriculumInput!: ElementRef;
//   @ViewChild('documentoIdentificacionInput') documentoIdentificacionInput!: ElementRef;

//   curriculumFileName = signal<string>('');
//   documentoIdentificacionFileName = signal<string>('');
//   cedulaFileName = signal<string>('');
//   fileName = signal<string | null>(null);
//   id = signal<number | null>(null); // ID del usuario

//   // docenteData = computed(() => this.docenteDataService.docenteData);
//   // docenteData = computed(() => this.docenteDataService.docenteData()); // ✅ esto devuelve el valor, no la signal
//   docenteData = signal<any>(null); // Datos del docente

//   constructor(
//     private authService: AuthService,

//     private router: Router,
//     private pendingAlertService: PendingAlertService,
//     private sanitizer: DomSanitizer,
//     private alertTaiwilService: AlertTaiwilService,
//     public docenteDataService: DocenteDataService,
//     private fileUploadService: FileUploadService,
//     private docenteService: DocenteService,
//     private especialidadesService: EspecialidadesService,
//     private validadorDocenteService: ValidadorDocenteService

//   ) {
//     effect(() => {
//       this.updatePendingAlerts();
//     }, { allowSignalWrites: true }); // ✅ necesario solo si usas .set()

//   }

//   triggerCurriculumFileInput(): void {
//     this.curriculumInput.nativeElement.click();
//   }

//   updatePendingAlerts() {
//     try {
//       const alerts: string[] = [];
//       const data = this.docenteData();

//       if (!data) return;

//       if (!data.cedula_profesional) alerts.push('Cédula profesional pendiente');
//       if (!data.curriculum_url) alerts.push('Curriculum pendiente');
//       if (!data.documento_identificacion) alerts.push('Documento de identificación pendiente');
//       if (!this.selectedEspecialidades_doce().length) alerts.push('Especialidad pendiente');
//       if (!data.estatus_id) alerts.push('Validación pendiente');
//       if (!data.usuario_validador_id) alerts.push('Asignación de validador pendiente');

//       this.pendingAlertService.update(alerts); // ✅ nuevo método
//     } catch (err) {
//       console.warn('Error al evaluar alertas pendientes:', err);
//     }
//   }


//   onCurriculumFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
//       this.curriculumFileName.set(file.name);

//       const formData = new FormData();
//       formData.append('curriculum', file);
//     }
//   }

//   ngOnInit(): void {
//     this.updatePendingAlerts();
//     this.loadEspecialidades();

// this.loadUserDetails()  


//   }
//     private async loadUserDetails(): Promise<void> {
//     this.updatePendingAlerts();

//     try {
//       // Verificar autenticación
//       // this.isAuthenticated.set(await this.authService.isAuthenticated());

//       // if (this.isAuthenticated()) {
//         // Obtener el ID del token
//         const id = await this.authService.getIdFromToken();
//         this.id.set(id);
//         console.log('ID del usuario:', this.id());

//         // Obtener los datos del docente
//         if (this.id() !== null) {
//           this.getDocenteData(this.id()!);
//         }
//       // } else {
//       //   console.warn('Usuario no autenticado');
//       // }
//     } catch (error) {
//       console.error('Error al cargar los detalles del usuario:', error);
//     }
//   }


//   private getDocenteData(id: number): void {
//     this.validadorDocenteService.getDocentesByUserId(id.toString()).subscribe({
//       next: (data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           this.docenteData.set(data[0]); // Obtén el primer elemento



//               // const data = this.docenteData();
//     // console.log('----', data);

//     if (this.docenteData() && this.docenteData().id) {
//       this.getDocenteData(this.docenteData().id);
//       this.checkEspecialidades(this.docenteData().id);
//     } else {
//       console.warn('El ID del docente es nulo o undefined.');
//     }




//         } else {
//           this.docenteData.set(null); // Maneja el caso en que no hay datos
//         }
//         console.log('Datos del docente:', this.docenteData());
//         // this.docenteDataService.docenteData = this.docenteData();
//         this.docenteDataService.docenteData.set(this.docenteData());

//         this.updatePendingAlerts();
//       },
//       error: (error) => {
//         console.error('Error al obtener los datos del docente:', error);
//       },
//     });
//   }


//   checkEspecialidades(docenteId: number): void {
//     this.especialidadesService.obtenerEspecialidadesPorDocente(docenteId).subscribe({
//       next: (response) => {
//         console.log('respuesta ', response);
//         this.especialidades_cargadas.set(response.especialidades);

//         if (response.especialidades && response.especialidades.length > 0) {
//           console.log(`El docente con ID ${docenteId} tiene especialidades asignadas.`);

//           const newEspecialidades = response.especialidades.map((esp) => ({
//             id: esp.especialidad_id,
//             nombre: esp.especialidad,
//           }));

//           this.especialidades.set(newEspecialidades);
//           this.selectedEspecialidades_doce.set(newEspecialidades.map(esp => esp.id));

//           if (this.selectedEspecialidades_doce().length > 0) {
//             this.mostrar_especialidad___.set(false);
//             this.selectedEspecialidades.set(this.selectedEspecialidades_doce());
//           } else {
//             this.mensajeEspecialidades.set('No hay especialidades seleccionadas por el momento.');
//             this.mostrar_especialidad___.set(true);
//           }

//           console.log('id de espe', this.selectedEspecialidades_doce());
//         } else {
//           console.log(`El docente con ID ${docenteId} no tiene especialidades asignadas.`);
//         }
//       },
//       error: (err) => {
//         this.mensajeEspecialidades.set('No hay especialidades seleccionadas por el momento.');
//       },
//     });
//   }

//   guardarCambios() {
//     this.isSaving.set(true);

//     const currentDocenteData = { ...this.docenteData() };
//     const docenteDataToSave: Partial<Docente> = {
//       nombre: currentDocenteData.nombre,
//       apellidos: currentDocenteData.apellidos,
//       email: currentDocenteData.email,
//     };

//     if (currentDocenteData.nombre !== currentDocenteData.nombre)
//       docenteDataToSave.nombre = currentDocenteData.nombre;
//     if (currentDocenteData.apellidos !== currentDocenteData.apellidos)
//       docenteDataToSave.apellidos = currentDocenteData.apellidos;
//     if (currentDocenteData.email !== currentDocenteData.email)
//       docenteDataToSave.email = currentDocenteData.email;
//     if (currentDocenteData.telefono !== currentDocenteData.telefono)
//       docenteDataToSave.telefono = currentDocenteData.telefono;

//     if (
//       this.selectedEspecialidades().length > 0 &&
//       this.selectedEspecialidades().toString() !==
//       (currentDocenteData.especialidades || []).toString()
//     ) {
//       docenteDataToSave.especialidades = this.selectedEspecialidades();
//     }

//     const uploads: Observable<any>[] = [];
//     const fotoFile = this.fileInput.nativeElement.files[0];
//     const curriculumFile = this.curriculumInput.nativeElement.files[0];
//     const documentoIdentificacionFile = this.documentoIdentificacionInput.nativeElement.files[0];
//     const cedulaFile = this.cedulaInput.nativeElement.files[0];

//     if (fotoFile) {
//       uploads.push(this.fileUploadService.uploadProfilePhoto(fotoFile).pipe(
//         tap((res) => docenteDataToSave.foto_url = res.image)
//       ));
//     }

//     if (curriculumFile) {
//       uploads.push(this.fileUploadService.uploadCurriculum(curriculumFile).pipe(
//         tap((res) => docenteDataToSave.curriculum_file_url = res.fileUrl)
//       ));
//     }

//     if (documentoIdentificacionFile) {
//       uploads.push(this.fileUploadService.uploadDocumentoIdentificacion(documentoIdentificacionFile).pipe(
//         tap((res) => docenteDataToSave.documento_identificacion_file_url = res.fileUrl)
//       ));
//     }

//     if (cedulaFile) {
//       uploads.push(this.fileUploadService.uploadCedula(cedulaFile).pipe(
//         tap((res) => docenteDataToSave.cedula_file_url = res.fileUrl)
//       ));
//     }

//     const subirCambios = () => {
//       this.limpiarDatos(docenteDataToSave);
//       if (Object.keys(docenteDataToSave).length === 0) {
//         this.isSaving.set(false);
//         console.log('No hay cambios para guardar.');
//         return;
//       }

//       this.docenteService.updateDocente(currentDocenteData.id, docenteDataToSave).subscribe({
//         next: (response) => {
//           this.alertTaiwilService.showTailwindAlert("Datos del docente guardados correctamente", "success");
//           console.log('Datos del docente guardados correctamente:', response);
//           this.docenteDataService.docenteData.set({ ...this.docenteData(), ...docenteDataToSave });
//           this.updatePendingAlerts(); // ✅ actualiza alertas si cambió algo

//           // this.router.navigate(['/docente/home']);
//           this.isEditing.set(false);
//           this.isSaving.set(false);
//         },
//         error: (err) => {
//           console.error('Error al guardar los datos del docente:', err);
//           this.alertTaiwilService.showTailwindAlert("Error al guardar los datos del docente", "error");
//           this.isSaving.set(false);
//         }
//       });
//     };

//     if (uploads.length > 0) {
//       forkJoin(uploads).subscribe({
//         next: () => subirCambios(),
//         error: (err) => {
//           console.error('Error al subir archivos:', err);
//           this.alertTaiwilService.showTailwindAlert("Error al subir archivos", "error");
//           this.isSaving.set(false);
//         }
//       });
//     } else {
//       subirCambios();
//     }

//   }

//   limpiarDatos(data: Partial<Docente>) {
//     Object.keys(data).forEach((key) => {
//       const typedKey = key as keyof Docente;
//       if (!data[typedKey] && data[typedKey] !== 0) {
//         delete data[typedKey];
//       }
//     });
//   }

//   loadEspecialidades(): void {
//     this.especialidadesService.getEspecialidades().subscribe({
//       next: (data) => {
//         const newEspecialidades = data.map((e) => ({
//           id: e.id,
//           nombre: e.nombre,
//         }));
//         this.especialidades.set(newEspecialidades);
//         this.filteredEspecialidades.set([...newEspecialidades]);
//       },
//       error: (err) => {
//         console.error('Error al cargar especialidades', err);
//       },
//     });
//   }

//   getSafeUrl(url: string): SafeResourceUrl {
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }

//   isPreviewable(url: string): boolean {
//     const previewableExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
//     const fileExtension = url.split('.').pop()?.toLowerCase();
//     return fileExtension ? previewableExtensions.includes(fileExtension) : false;
//   }

//   onSelectFile(): void {
//     this.cedulaInput.nativeElement.click();
//   }

//   onFileChange(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.fileName.set(file.name);
//       console.log(file);
//     }
//   }

//   editarPerfil() {
//     this.loadUserDetails()  
//     this.isEditing.set(true);
//     console.log('Editar perfil');
//   }

//   cancelarEdicion() {
//     this.isEditing.set(false);
//   }

//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       const data = this.docenteData();
//       data.foto_url = URL.createObjectURL(file);
//     }
//   }

//   getEspecialidadName(id: number): string {
//     const especialidad = this.especialidades().find((e) => e.id === id);
//     return especialidad ? especialidad.nombre : 'Cargando...';
//   }

//   onSearchChange(searchTerm: string): void {
//     this.filteredEspecialidades.set(
//       this.especialidades().filter((especialidad) =>
//         especialidad.nombre.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }

//   toggleEspecialidad(especialidad: any): void {
//     console.log('agrega<<', this.selectedEspecialidades());
//     const currentEspecialidades = this.selectedEspecialidades();
//     const index = currentEspecialidades.indexOf(especialidad.id);

//     if (index === -1) {
//       this.selectedEspecialidades.set([...currentEspecialidades, especialidad.id]);
//     } else {
//       this.selectedEspecialidades.set(currentEspecialidades.filter(id => id !== especialidad.id));
//     }
//   }

//   removeSpecialty(especialidadId: number): void {
//     this.selectedEspecialidades.set(
//       this.selectedEspecialidades().filter(id => id !== especialidadId)
//     );
//   }

//   verClases() {
//     console.log('Ver clases');
//   }

//   triggerDocumentoIdentificacionFileInput(): void {
//     this.documentoIdentificacionInput.nativeElement.click();
//   }

//   getValidadorStatus(usuarioValidadorId: number): string {
//     if (!usuarioValidadorId) {
//       return 'Asignación de validador pendiente';
//     }

//     if (usuarioValidadorId > 0) {
//       return 'El validador ya está asignado y el perfil está en proceso de revisión';
//     }

//     return 'Estado desconocido';
//   }

//   onDocumentoIdentificacionFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
//       this.documentoIdentificacionFileName.set(file.name);

//       const formData = new FormData();
//       formData.append('documento_identificacion', file);
//     }
//   }
// }