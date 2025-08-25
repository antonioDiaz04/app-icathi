// import { Component, computed, effect, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ValidadorDocenteService } from '../../../validador/commons/services/validador-docente.service';
// import { DocenteDataService } from '../../commons/services/docente-data.service';
// import { AuthService } from '../../../../shared/services/auth.service';
// // import { PdfUploaderPreviewComponent } from '../../../../shared/components/pdf-uploader-preview/pdf-uploader-preview.component';

// import { HttpClient } from '@angular/common/http';
// import { PdfUploaderPreviewComponent } from '../../../../shared/components/pdf-uploader-preview/pdf-uploader-preview.component';

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
//     private authService: AuthService,
//   ) {
//     this.form = this.fb.group({
//       nombre: ['', [Validators.required, Validators.maxLength(100)],],
//       apellidos: ['', [Validators.required, Validators.maxLength(100)]],
//       email: ['', [Validators.required, Validators.email]],
//       telefono: [''],
//       whatsapp: [''],
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

//   // Validador sencillo de URL opcional
//   private urlOrEmptyValidator = (control: any) => {
//     const v: string = control.value;
//     if (!v) return null;
//     try {
//       // valida formato URL cuando hay algo
//       new URL(v);
//       return null;
//     } catch {
//       return { invalidUrl: true };
//     }
//   };

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

//     // Establecer la vista previa de la foto si existe
//     // if (docente.foto_url) {
//     //   this.fotoPreview.set(docente.foto_url);
//     // }
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

//     try {
//       // 2) Subida (asíncrona). Reemplaza la URL del form al terminar
//       // const remoteUrl = await this.uploadFotoFn(file);
//       // this.form.get('foto_url')?.setValue(remoteUrl);

//       // // 3) Ya que tenemos URL real, podemos limpiar el preview (opcional)
//       // //    Si prefieres mantener la preview hasta próximo cambio, comenta estas 3 líneas:
//       // if (this.previewObjectUrl) {
//       //   URL.revokeObjectURL(this.previewObjectUrl);
//       //   this.previewObjectUrl = null;
//       // }
//       // this.fotoPreview.set(null);
//     } catch (e) {
//       // console.error('Error subiendo imagen:', e);
//       // alert('No se pudo subir la imagen. Intenta de nuevo.');
//       // Conservamos la previsualización local para no “desaparecer” la foto
//       // pero si quieres limpiar: this.fotoPreview.set(null);
//     } finally {
//       // Limpia el input para poder volver a seleccionar el mismo archivo si se desea
//       input.value = '';
//     }
//   }

//   onSave() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     this.saving.set(true);

//     // Payload listo para enviar a tu API
//     // const payload = {
//     //   ...this.docente,
//     //   ...this.form.value,
//     // };

//     // TODO: Llamar a tu servicio (apiClient) y manejar respuesta/errores
//     // this.api.updateDocente(this.docente.id, payload).subscribe(...)

//     setTimeout(() => this.saving.set(false), 600); // simulación
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

// }
