// import { Component, computed, effect, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ValidadorDocenteService } from '../../../validador/commons/services/validador-docente.service';
// import { DocenteDataService } from '../../commons/services/docente-data.service';
// import { AuthService } from '../../../../shared/services/auth.service';
// // import { PdfUploaderPreviewComponent } from '../../../../shared/components/pdf-uploader-preview/pdf-uploader-preview.component';

// import { HttpClient } from '@angular/common/http';
// import { PdfUploaderPreviewComponent } from '../../../../shared/components/pdf-uploader-preview/pdf-uploader-preview.component';
// import { DocenteService } from '../../../../shared/services/docente.service';

// type TabKey = 'personal' | 'documentacion' | 'configuracion' | 'seguridad';


// export interface Docente {
//   id: number;
//   nombre: string;
//   apellidos: string;
//   email: string;
//   telefono: string | null;
//   especialidad: string | null;
//   certificado_profesional: boolean;
//   cedula_profesional: string | null;
//   documento_identificacion: string | null;
//   num_documento_identificacion: string | null;
//   curriculum_url: string | null;
//   estatus_tipo: string | null;
//   estatus_valor: string | null;
//   created_at: string;
//   updated_at: string;
//   usuario_validador_id: number | null;
//   fecha_validacion: string | null;
//   foto_url: string | null;
//   validador_nombre: string | null;
//   validador_apellidos: string | null;
// }

// @Component({
//   selector: 'app-perfil',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, PdfUploaderPreviewComponent],
//   templateUrl: './perfil.component.html',
//   styleUrl: './perfil.component.scss',
// })
// export class PerfilComponent {
//   // --- Tabs ---
//   tabs: { key: TabKey; label: string }[] = [
//     { key: 'personal', label: 'Información Personal' },
//     { key: 'documentacion', label: 'Documentación' },
//     { key: 'configuracion', label: 'Configuración' },
//     { key: 'seguridad', label: 'Seguridad' },
//   ];
//   activeTab = signal<TabKey>('personal');
//   setTab(t: TabKey) { this.activeTab.set(t); }
//   isActive = (t: TabKey) => computed(() => this.activeTab() === t);

//   // --- Estado/UI ---
//   saving = signal(false);
//   fotoPreview = signal<string | null>(null);
//   private previewObjectUrl: string | null = null;
//   private uploadFotoFn = (file: File) => this.uploadToServer(file, 'fotos_docentes');

//   // --- Formulario ---
//   form: FormGroup;
//   docenteData = signal<any>(null)
//   id = signal<number | null>(null)

//   chipColor = computed(() => {
//     const docente = this.docenteData();
//     if (!docente || !docente.estatus_valor) return 'chip';

//     const v = docente.estatus_valor.toLowerCase();
//     if (v.includes('verific') || v.includes('validado')) return 'chip--ok';
//     if (v.includes('pendiente')) return 'chip--warn';
//     return 'chip';
//   });
//   // private fb = inject(FormBuilder);
//   private http = inject(HttpClient);
//   constructor(private fb: FormBuilder
//     , private validadorDocenteService: ValidadorDocenteService,
//     private docenteDataService: DocenteDataService,
//     private docenteService: DocenteService,
//     private authService: AuthService,
//   ) {
//     this.form = this.fb.group({
//       nombre: ['', [Validators.required, Validators.maxLength(100)],],
//       apellidos: ['', [Validators.required, Validators.maxLength(100)]],
//       email: ['', [Validators.required, Validators.email]],
//       telefono: [''],
//       // whatsapp: [''],
//       direccion: [''],

//       // documentacion
//       especialidad: [''],
//       certificado_profesional: [false],
//       num_documento_identificacion: [''],
//       cedula_profesional: [''],
//       documento_identificacion: [''],
//       curriculum_url: [''],
//       foto_url: [''],
//     });


//     effect(() => {
//       const data = this.docenteData();
//       if (data) {
//         this.patchFromDocente(data);
//       }
//     });
//   }
//   // === Implementación genérica de subida ===
//   private async uploadToServer(file: File, folder: string): Promise<string> {
//     const fd = new FormData();
//     fd.append('file', file);
//     fd.append('folder', folder);

//     // Espera que tu backend responda con { url: 'https://...' }
//     const resp = await this.http.post<{ url: string }>("API_UPLOAD", fd).toPromise();
//     if (!resp?.url) throw new Error('El backend no devolvió la URL del archivo.');
//     return resp.url;
//   }


//   // === UploadFns que pasamos al hijo ===
//   uploadIdentificacionFn = (file: File) =>
//     this.uploadToServer(file, 'documentos_identificacion_docentes');

//   uploadCedulaFn = (file: File) =>
//     this.uploadToServer(file, 'cedulas_docentes');

//   uploadCvFn = (file: File) =>
//     this.uploadToServer(file, 'cv_docentes');
//   private setPreviewFromFile(file: File) {
//     // Revoca el previo si existe
//     if (this.previewObjectUrl) {
//       URL.revokeObjectURL(this.previewObjectUrl);
//       this.previewObjectUrl = null;
//     }
//     const url = URL.createObjectURL(file);
//     this.previewObjectUrl = url;
//     this.fotoPreview.set(url);
//   }

//   ngOnDestroy(): void {
//     if (this.previewObjectUrl) {
//       URL.revokeObjectURL(this.previewObjectUrl);
//       this.previewObjectUrl = null;
//     }
//   }

//   ngOnInit(): void {

//     this.loadUserDetails()
//   }
//   private async loadUserDetails(): Promise<void> {
//     try {

//       const id = await this.authService.getIdFromToken()
//       this.id.set(id)

//       if (this.id() !== null) {
//         await this.getDocenteData(this.id()!)
//       }

//     } catch (error) {
//       console.error("Error al cargar los detalles del usuario:", error)
//     }
//   }
//   private getDocenteData(id: number): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.validadorDocenteService.getDocentesByUserId(id.toString()).subscribe({
//         next: (data) => {
//           if (Array.isArray(data) && data.length > 0) {
//             this.docenteData.set(data[0])
//             console.log("#W", this.docenteData())
//             this.docenteDataService.docenteData.set(data[0])
//           } else {
//             this.docenteData.set(null)
//           }
//           resolve()
//         },
//         error: (error) => {
//           console.error("Error al obtener los datos del docente:", error)
//           reject(error)
//         },
//       })
//     })
//   }
//   private patchFromDocente(docente: Docente): void {
//     this.form.patchValue({
//       nombre: docente.nombre,
//       apellidos: docente.apellidos,
//       email: docente.email,
//       telefono: docente.telefono,
//       especialidad: docente.especialidad,
//       certificado_profesional: docente.certificado_profesional,
//       num_documento_identificacion: docente.num_documento_identificacion,
//       cedula_profesional: docente.cedula_profesional,
//       documento_identificacion: docente.documento_identificacion,
//       curriculum_url: docente.curriculum_url,
//       foto_url: docente.foto_url,
//     });


//   }

//   // --- Handler de cambio de foto con validaciones, preview inmediato y subida
//   async onChangePhoto(event: Event) {
//     const input = event.target as HTMLInputElement;
//     const file = input?.files?.[0];
//     if (!file) return;

//     // Validaciones básicas
//     const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//     if (!validTypes.includes(file.type)) {
//       alert('Formato inválido. Usa JPG, PNG, GIF o WebP.');
//       input.value = '';
//       return;
//     }
//     const maxBytes = 2 * 1024 * 1024; // 2MB
//     if (file.size > maxBytes) {
//       alert('La imagen excede 2MB.');
//       input.value = '';
//       return;
//     }

//     // 1) Preview inmediato
//     this.setPreviewFromFile(file);

//   }



//   async onSave() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     this.saving.set(true);

//     try {
//       // Subir archivos primero si es necesario
//       // const uploadedUrls = await this.handleFileUploads();
//       // console.log("#uploadedUrls", uploadedUrls)
//       const currentDocenteData = this.docenteData();
//       if (!currentDocenteData) {
//         throw new Error('No hay datos de docente disponibles');
//       }

//       const formData = this.form.value;
//       console.log("#F", formData)
//       console.log("#currentDocenteData", currentDocenteData)
//       const docenteDataToSave: Partial<Docente> = { ...formData };
//       console.log("#docenteDataToSave", this.fotoFile, docenteDataToSave)
      
//     if (fotoFile) {
//       uploads.push(this.fileUploadService.uploadProfilePhoto(fotoFile).pipe(
//         tap((res) => docenteDataToSave.foto_url = res.image)
//       ));
//     }
//       // Object.keys(formData).forEach(key => {
//       //   if (JSON.stringify(formData[key]) !== JSON.stringify(currentDocenteData[key])) {
//       //     docenteDataToSave[key as keyof Docente] = formData[key];
//       //   }
//       // });

//       if (Object.keys(docenteDataToSave).length === 0) {
//         console.log('No hay cambios para guardar');
//         this.saving.set(false);
//         return;
//       }

//       // this.docenteService.updateDocente(currentDocenteData.id, docenteDataToSave)
//       //   .subscribe({
//       //     next: (response) => {
//       //       console.log('Datos guardados correctamente:', response);
//       //       const updatedData = { ...currentDocenteData, ...docenteDataToSave };
//       //       this.docenteData.set(updatedData);
//       //       this.docenteDataService.docenteData.set(updatedData);
//       //       this.saving.set(false);
//       //       this.editMode = false;
//       //     },
//       //     error: (error) => {
//       //       console.error('Error al guardar los datos:', error);
//       //       this.saving.set(false);
//       //     }
//       //   });

//     } catch (error) {
//       console.error('Error en el proceso de guardado:', error);
//       this.saving.set(false);
//     }
//   }


//   onCancel(): void {
//     // Restaurar valores originales
//     const docente = this.docenteData();
//     if (docente) {
//       this.patchFromDocente(docente);
//     }
//   }
//   statusClass(v: Number) {
//     // console.log("estatus_id", v);

//     if (v == 4) { // Activo
//       return ['bg-emerald-100', 'text-emerald-800'];
//     }
//     if (v == 5) { // Inactivo
//       return ['bg-gray-100', 'text-gray-800'];
//     }
//     if (v == 6) { // Pendiente de validación
//       // return ['bg-emerald-100', 'text-emerald-800'];
//       return ['bg-yellow-200', 'text-yellow-800'];
//     }
//     if (v == 7) { // Suspendido
//       return ['bg-red-100', 'text-red-800'];
//     }

//     // Estado por defecto para valores no reconocidos
//     return ['bg-gray-200', 'text-gray-900'];
//   }
//   editMode = false;

//   toggleEdit() {
//     this.editMode = !this.editMode;
//   }



//   // ******MANEJO DE ARCNHIVOS******
//   // ====== En tu clase PerfilComponent ======

//   // --- Archivos pendientes por subir (memoria temporal) ---
//   private fotoFile: File | null = null;
//   private docIdentFile: File | null = null;
//   private cedulaFile: File | null = null;
//   private cvFile: File | null = null;

//   /** (Opcional) Validación simple de archivos */
//   private validateFile(
//     file: File,
//     acceptMimes: string[] = [],
//     maxMb = 10
//   ): void {
//     if (acceptMimes.length && !acceptMimes.includes(file.type)) {
//       throw new Error(`Formato inválido: ${file.type}`);
//     }
//     const maxBytes = maxMb * 1024 * 1024;
//     if (file.size > maxBytes) {
//       throw new Error(`El archivo excede ${maxMb}MB`);
//     }
//   }

//   // --- Setters para enlazar desde el template o componentes hijos ---
//   setFotoFile(file: File) {
//     // Ej.: ['image/jpeg','image/png','image/webp','image/gif']
//     this.validateFile(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 2);
//     this.fotoFile = file;
//     // preview inmediato (opcional, ya tienes onChangePhoto)
//     this.setPreviewFromFile(file);
//   }

//   setDocumentoIdentificacionFile(file: File) {
//     // Acepta imágenes o PDF
//     this.validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5);
//     this.docIdentFile = file;
//   }

//   setCedulaFile(file: File) {
//     this.validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5);
//     this.cedulaFile = file;
//   }

//   setCurriculumFile(file: File) {
//     this.validateFile(file, ['application/pdf'], 10);
//     this.cvFile = file;
//   }


//   // ====== Método auxiliar para manejar subida de archivos ======
//   private async handleFileUploads(): Promise<{ [key: string]: string }> {
//     const uploadedUrls: { [key: string]: string } = {};

//     // Prepara tareas en paralelo sólo para los archivos presentes
//     const tasks: Array<Promise<void>> = [];

//     if (this.fotoFile) {
//       tasks.push(
//         this.uploadFotoFn(this.fotoFile)
//           .then((url) => {
//             uploadedUrls['foto_url'] = url;
//             // Si quieres que el diff del onSave también vea el cambio dentro del form:
//             this.form.patchValue({ foto_url: url });
//           })
//       );
//     }

//     if (this.docIdentFile) {
//       tasks.push(
//         this.uploadIdentificacionFn(this.docIdentFile)
//           .then((url) => {
//             // Campo que guardas en BD para documento de identificación
//             uploadedUrls['documento_identificacion'] = url;
//             this.form.patchValue({ documento_identificacion: url });
//           })
//       );
//     }

//     if (this.cedulaFile) {
//       tasks.push(
//         this.uploadCedulaFn(this.cedulaFile)
//           .then((url) => {
//             uploadedUrls['cedula_profesional'] = url;
//             this.form.patchValue({ cedula_profesional: url });
//           })
//       );
//     }

//     if (this.cvFile) {
//       tasks.push(
//         this.uploadCvFn(this.cvFile)
//           .then((url) => {
//             uploadedUrls['curriculum_url'] = url;
//             this.form.patchValue({ curriculum_url: url });
//           })
//       );
//     }

//     // Si no hay nada que subir, regresa vacío
//     if (tasks.length === 0) return uploadedUrls;

//     // Sube todo en paralelo; si quieres que NO falle todo cuando uno falla,
//     // cambia Promise.all por Promise.allSettled y maneja resultados individuales.
//     await Promise.all(tasks);

//     // Limpia memoria temporal (ya subidos)
//     this.fotoFile = null;
//     this.docIdentFile = null;
//     this.cedulaFile = null;
//     this.cvFile = null;

//     return uploadedUrls;
//   }

// }
