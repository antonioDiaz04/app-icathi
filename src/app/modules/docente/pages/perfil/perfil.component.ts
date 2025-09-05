import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ValidadorDocenteService } from '../../../validador/commons/services/validador-docente.service';
import { DocenteDataService } from '../../commons/services/docente-data.service';
import { AuthService } from '../../../../shared/services/auth.service';

import { HttpClient } from '@angular/common/http';
import { PdfUploaderPreviewComponent } from '../../../../shared/components/pdf-uploader-preview/pdf-uploader-preview.component';
import { DocenteService } from '../../../../shared/services/docente.service';
// import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { checkPrime } from 'crypto';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { AlertTaiwilService } from '../../../../shared/services/alert-taiwil.service';
import { SolicitudCursoApi, SolicitudesCursosService } from '../../../../shared/services/solicitudes-cursos.service';
import { Curso, CursosService } from '../../../../shared/services/cursos.service';
import { RouterModule } from '@angular/router';

type TabKey = 'personal' | 'documentacion' | 'configuracion' | 'seguridad';
// Reglas de contraseña fuerte
// Reglas de contraseña fuerte
const STRONG_PWD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

// Validador de coincidencia new/confirm
function matchPassword(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('newPassword')?.value ?? '';
  const confirm = group.get('confirmPassword')?.value ?? '';
  return pass && confirm && pass !== confirm ? { mismatch: true } : null;
}



export interface Docente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  especialidad: string | null;
  certificado_profesional: boolean;
  cedula_profesional: string | null;
  documento_identificacion: string | null;
  num_documento_identificacion: string | null;
  curriculum_url: string | null;
  estatus_tipo: string | null;
  estatus_valor: string | null;
  created_at: string;
  updated_at: string;
  usuario_validador_id: number | null;
  fecha_validacion: string | null;
  foto_url: string | null;
  validador_nombre: string | null;
  validador_apellidos: string | null;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PdfUploaderPreviewComponent,RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',

  providers: [FileUploadService] // ← AÑADE ESTA LÍNEA

})
export class PerfilComponent {
  // --- Tabs ---
  tabs: { key: TabKey; label: string }[] = [
    { key: 'personal', label: 'Información Personal' },
    { key: 'documentacion', label: 'Documentación' },
    // { key: 'configuracion', label: 'Configuración' },
    { key: 'seguridad', label: 'Seguridad' },
  ];
  private fotoFile: File | null = null;
  private curriculumFile: File | null = null;
  private documentoIdentificacionFile: File | null = null;
  private cedulaFile: File | null = null;
  activeTab = signal<TabKey>('personal');
  setTab(t: TabKey) { this.activeTab.set(t); }
  isActive = (t: TabKey) => computed(() => this.activeTab() === t);

  // --- Estado/UI ---
  saving = signal(false);
  fotoPreview = signal<string | null>(null);
  private previewObjectUrl: string | null = null;
  // private uploadFotoFn = (file: File) => this.uploadToServer(file, 'fotos_docentes');
  curriculumFileName = signal<string>('');
  documentoIdentificacionFileName = signal<string>('');
  cedulaFileName = signal<string>('');
  correodocente = signal<string>('');
  // --- Formulario ---
  form: FormGroup;
  docenteData = signal<any>(null)
  id = signal<number | null>(null)
  // form: FormGroup;
  passwordForm!: FormGroup;
  show = { current: false, new: false, confirm: false };
  changingPassword = false;

  chipColor = computed(() => {
    const docente = this.docenteData();
    if (!docente || !docente.estatus_valor) return 'chip';

    const v = docente.estatus_valor.toLowerCase();
    if (v.includes('verific') || v.includes('validado')) return 'chip--ok';
    if (v.includes('pendiente')) return 'chip--warn';
    return 'chip';
  });
  // private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private fileUploadService = inject(FileUploadService);
  private alertTaiwilService = inject(AlertTaiwilService);
  // private alertTaiwilService: AlertTaiwilService,
  isSaving = signal(false);
  constructor(private fb: FormBuilder
    , private validadorDocenteService: ValidadorDocenteService,
    private docenteDataService: DocenteDataService,
    private docenteService: DocenteService,
    private authService: AuthService,
    private svc: SolicitudesCursosService, private cursosService: CursosService
    // private fileUploadService: FileUploadService,

  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)],],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      // whatsapp: [''],
      direccion: [''],

      // documentacion
      especialidad: [''],
      certificado_profesional: [false],
      num_documento_identificacion: [''],
      cedula_profesional: [''],
      documento_identificacion: [''],
      curriculum_url: [''],
      foto_url: [''],
    });
    // Form seguridad
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.pattern(STRONG_PWD)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: matchPassword }
    );

    effect(() => {
      const data = this.docenteData();
      if (data) {
        this.patchFromDocente(data);
      }
    });
   
  }

  private extractUrl(resp: any): string {
    return (
      resp?.url ??
      resp?.fileUrl ??
      resp?.image ??
      resp?.location ??
      ''
    );
  }
  // Fuerza de contraseña (para la barra)
  // strength = computed(() => {
  //   const v: string = this.passwordForm?.get('newPassword')?.value || '';
  //   let score = 0;
  //   if (v.length >= 8) score += 25;
  //   if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score += 25;
  //   if (/\d/.test(v)) score += 25;
  //   if (/[^\w\s]/.test(v)) score += 25;

  //   const label = score < 50 ? 'Débil' : score < 75 ? 'Media' : 'Fuerte';
  //   const barClass = score < 50 ? 'bg-red-500' : score < 75 ? 'bg-amber-500' : 'bg-emerald-500';
  //   return { value: score, label, barClass };
  // });

  toggleShow(which: 'current' | 'new' | 'confirm') {
    this.show[which] = !this.show[which];
  }
  async onChangePassword() {
    this.isSaving.set(true);
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.changingPassword = true;
    try {
      const payload = this.passwordForm.value;
      console.log('Payload para cambiar contraseña:', payload);
      console.log('Payload this.id:', this.id());
      // Ejemplo:
      this.docenteService.cambiarPassword(this.id()!, payload).subscribe({
        next: (response) => {
            this.isSaving.set(true);
          const email = this.docenteData()?.email || '';
          if ('credentials' in navigator && email && payload.newPassword) {
            // Algunos navegadores actualizarán la guardada
            const cred = new (window as any).PasswordCredential({
              id: email, // username/email
              password: payload.newPassword,
              name: email
            });
            (navigator as any).credentials.store(cred);
          }
          console.log('Contraseña cambiada correctamente:', response);
          this.alertTaiwilService.showTailwindAlert('Contraseña actualizada', 'success');
          this.passwordForm.reset();
            this.isSaving.set(false);
            
          },
          error: (error) => {
            console.error('Error al cambiar la contraseña:', error.mensaje);
            this.alertTaiwilService.showTailwindAlert(error.error.mensaje, 'error');
            this.isSaving.set(false);
          }
        });
        // await this.authService.changePassword(payload).toPromise();
        // this.alertTaiwilService.showTailwindAlert('Contraseña actualizada', 'success');
        // this.passwordForm.reset();
      } catch (e) {
      // this.isSaving.set(false);
      console.error("e");
      console.error(e);
      this.alertTaiwilService.showTailwindAlert('No se pudo cambiar la contraseña', 'error');
    } finally {
      // this.isSaving.set(false);
      this.changingPassword = false;
    }
  }
  // SEGURIDAD
  // SEGURIDAD
  // SEGURIDAD
  // SEGURIDAD
  // SEGURIDAD
  //   // --- Asignar contraseña manual (o usar resetPassword como fallback) ---
  // asignarPassword() {
  //   console.log("this.detalle", this.detalle?.email)
  //   if (!this.detalle?.usuario_id) {
  //     if (this.selectedId) this.showActionResponse(this.selectedId, { success: false, type: 'warning', message: 'Sin usuario asociado.' })
  //     return
  //   }
  //   if (!this.newPassword || this.newPassword.length < 8) {
  //     this.showActionResponse(this.selectedId!, { success: false, type: 'warning', message: 'La contraseña debe tener al menos 8 caracteres.' })
  //     return
  //   }
  //   this.setLoading(this.selectedId!, true)
  //   console.log("this.detalle.usuario_id, this.newPassword", this.detalle?.email, this.newPassword)

  //   // Requiere endpoint en backend. Ver método en el service más abajo.
  //   // Requiere endpoint en backend. Ver método en el service más abajo.
  //   this.authService.crearContraseñaADMIN(this.detalle?.email, this.newPassword).subscribe({
  //     next: () => {
  //       this.showActionResponse(this.selectedId!, {
  //         success: true,
  //         type: 'success',
  //         message: 'Contraseña asignada.'
  //       });
  //       this.newPassword = '';
  //       this.setLoading(this.selectedId!, false);
  //       console.log("Contraseña asignada:", this.newPassword);
  //       this.editandoPass = false; // cerrar edición
  //       console.log("this.detalle*******++", this.detalle);
  //             this.recargarDetalle();

  //       // this.verDetalles(this.detalle!); // recargar detalle para ver cambios
  //       // this.volverAlListado()
  //     },
  //     error: (err) => {
  //       console.error('Error al asignar contraseña:', err);
  //       // Fallback: si no existe el endpoint, avisa usar resetPassword
  //       this.showActionResponse(this.selectedId!, {
  //         success: false,
  //         type: 'error',
  //         message: 'No se pudo asignar. Verifica el endpoint o usa "Reset pass".'
  //       });
  //       this.setLoading(this.selectedId!, false);
  //     }
  //   });



  // }


  private get newPassword(): string {
    return (this.passwordForm?.get('newPassword')?.value ?? '') as string;
  }
  passwordStrength(): 0 | 1 | 2 | 3 | 4 {
    const p = this.newPassword || '';
    let score = 0 as 0 | 1 | 2 | 3 | 4;

    if (p.length >= 8) score = (score + 1) as 0 | 1 | 2 | 3 | 4;
    if (/[A-Z]/.test(p)) score = (score + 1) as 0 | 1 | 2 | 3 | 4;
    if (/[a-z]/.test(p)) score = (score + 1) as 0 | 1 | 2 | 3 | 4;
    if (/\d/.test(p)) score = (score + 1) as 0 | 1 | 2 | 3 | 4;
    if (/[^A-Za-z0-9]/.test(p)) score = (score + 1) as 0 | 1 | 2 | 3 | 4;

    // cap a 4
    return (score > 4 ? 4 : score) as 0 | 1 | 2 | 3 | 4;
  }

  strengthLabel(): string {
    const s = this.passwordStrength();
    return ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'][s];
  }
  strengthBarClass() {
    const s = this.passwordStrength();
    return {
      'bg-red-400': s <= 1,
      'bg-yellow-400': s === 2,
      'bg-blue-400': s === 3,
      'bg-green-500': s === 4,
    };
  }
  // === UploadFns que pasamos al hijo ===
  uploadIdentificacionFn = async (file: File): Promise<string> => {
    const resp = await this.fileUploadService.uploadDocumentoIdentificacion(file).toPromise();
    const url = this.extractUrl(resp);
    if (!url) throw new Error('Invalid response format from server (Identificación)');
    this.documentoIdentificacionFileName.set(file.name); // opcional
    return url;
  };

  uploadCedulaFn = async (file: File): Promise<string> => {
    const resp = await this.fileUploadService.uploadCedula(file).toPromise();
    const url = this.extractUrl(resp);
    if (!url) throw new Error('Invalid response format from server (Cédula)');
    this.cedulaFileName.set(file.name); // opcional
    return url;
  };

  uploadCurriculumFn = async (file: File): Promise<string> => {
    const resp = await this.fileUploadService.uploadCurriculum(file).toPromise();
    const url =
      (resp as any)?.url ||
      (resp as any)?.fileUrl ||
      (resp as any)?.image ||
      (resp as any)?.location ||
      '';
    if (!url) throw new Error('Invalid response format from server');
    this.curriculumFileName.set(file.name);
    return url;
  };

  // In your parent component
  async onCurriculumFileChange(file: File): Promise<string> {
    const formData = new FormData();

    // Add null check for the service
    if (!this.fileUploadService || !this.fileUploadService.uploadCurriculum) {
      console.error('FileUploadService or uploadCurriculum method is not available');
      throw new Error('Upload service not available');
    }

    try {
      const response = await this.fileUploadService.uploadCurriculum(file).toPromise();
      console.log("response", response);

      // Make sure response has the expected structure
      if (response && response.url) {
        this.curriculumFileName.set(file.name);
        return response.url;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error uploading curriculum:', error);
      throw new Error('Error uploading curriculum');
    }
  }
  private setPreviewFromFile(file: File) {
    // Revoca el previo si existe
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }
    const url = URL.createObjectURL(file);
    this.previewObjectUrl = url;
    this.fotoPreview.set(url);
  }

  ngOnDestroy(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }
  }

  ngOnInit(): void {

    this.loadUserDetails()
     
  }
  private async loadUserDetails(): Promise<void> {
    try {

      const id = await this.authService.getIdFromToken()
      this.id.set(id)

      if (this.id() !== null) {
        await this.getDocenteData(this.id()!)
      }

    } catch (error) {
      console.error("Error al cargar los detalles del usuario:", error)
    }
  }
  private getDocenteData(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.validadorDocenteService.getDocentesByUserId(id.toString()).subscribe({
        next: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            this.docenteData.set(data[0])
            console.log("#W", this.docenteData())
            this.docenteDataService.docenteData.set(data[0])
            this.cargar()
          } else {
            this.docenteData.set(null)
          }
          resolve()
        },
        error: (error) => {
          console.error("Error al obtener los datos del docente:", error)
          reject(error)
        },
      })
    })
  }
  private patchFromDocente(docente: Docente): void {
    // this.correodocente.set(docente.email);

    this.form.patchValue({
      nombre: docente.nombre,
      apellidos: docente.apellidos,
      email: docente.email,
      telefono: docente.telefono,
      especialidad: docente.especialidad,
      certificado_profesional: docente.certificado_profesional,
      num_documento_identificacion: docente.num_documento_identificacion,
      cedula_profesional: docente.cedula_profesional,
      documento_identificacion: docente.documento_identificacion,
      curriculum_url: docente.curriculum_url,
      foto_url: docente.foto_url,
    });


  }

  // --- Handler de cambio de foto con validaciones, preview inmediato y subida
  onChangePhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Formato inválido. Usa JPG, PNG, GIF o WebP.');
      input.value = '';
      return;
    }
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxBytes) {
      alert('La imagen excede 2MB.');
      input.value = '';
      return;
    }

    this.fotoFile = file;
    this.setPreviewFromFile(file); // ya lo tienes
  }

  async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
   this.isSaving.set(true);
    try {
      const currentDocenteData = this.docenteData();
      if (!currentDocenteData) {
        this.alertTaiwilService.showTailwindAlert("No hay datos de docente disponibles", "error");

        throw new Error('No hay datos de docente disponibles');
      }


      // 1) Obtener datos del formulario
      const formData = this.form.value;
      let docenteDataToSave: Partial<Docente> = { ...formData };
      // console.log('Datos a guardar desde formulario:', docenteDataToSave);

      // 2) Subidas en paralelo (si hay archivos)

      const uploadedUrls = await this.uploadFilesIfNeeded();

      // 3) Combinar datos del formulario con URLs de archivos subidos
      docenteDataToSave = { ...docenteDataToSave, ...uploadedUrls };



      // 3) Si no hay nada que actualizar, corta
      if (Object.keys(docenteDataToSave).length === 0) {
        console.log('No hay cambios para guardar');
        this.alertTaiwilService.showTailwindAlert("No hay cambios para guardar", "error");
        this.saving.set(false);
        return;
      }

      // 4) Llamada a API
      this.docenteService.updateDocente(currentDocenteData.id, docenteDataToSave)
        .pipe(finalize(() => this.saving.set(false)
        ))
        .subscribe({
          next: (response) => {
            // 5) Refresca estado local con lo nuevo
            const updatedData = { ...currentDocenteData, ...docenteDataToSave };
            this.docenteData.set(updatedData);
            this.docenteDataService.docenteData.set(updatedData);

            // limpia archivos ya subidos (opcional)
            this.fotoFile = null;
            this.curriculumFile = null;
            this.documentoIdentificacionFile = null;
            this.cedulaFile = null;
            this.alertTaiwilService.showTailwindAlert("Datos del docente guardados correctamente", "success");
            this.editMode = false
               this.isSaving.set(false);
               // console.log('Datos guardados correctamente:', response);
              },
              error: (error) => {
            this.isSaving.set(false);
            console.error('Error al guardar los datos del docente:', error);

            console.error('Error al guardar los datos:', error);
          }
        });

    } catch (error) {
      console.error('Error en el proceso de guardado:', error);
      this.saving.set(false);
      this.editMode = false;
    }
  }
  private uploadFilesIfNeeded(): Promise<Partial<Docente>> {
    const tasks: any[] = [];

    // foto
    if (this.fotoFile) {
      tasks.push(
        this.fileUploadService.uploadProfilePhoto(this.fotoFile).pipe(
          map((res: any) => ({ foto_url: res.image as string })),
          catchError((err) => {
            console.error('Error subiendo foto:', err);
            return of<Partial<Docente>>({});
          })
        )
      );
    }




    if (tasks.length === 0) {
      return Promise.resolve({});
    }

    return new Promise((resolve) => {
      forkJoin(tasks)
        .pipe(
          map((partials) =>
            partials.reduce((acc, curr) => ({ ...acc, ...curr }), {} as Partial<Docente>)
          )
        )
        .subscribe({
          next: (merged) => resolve(merged),
          error: (e) => {
            console.error('Error en forkJoin de cargas:', e);
            resolve({});
          },
        });
    });
  }

  onCancel(): void {
    // Restaurar valores originales
    const docente = this.docenteData();
    if (docente) {
      this.patchFromDocente(docente);
    }
  }
  statusClass(v: Number) {
    // console.log("estatus_id", v);

    if (v == 4) { // Activo
      return ['bg-emerald-100', 'text-emerald-800'];
    }
    if (v == 5) { // Inactivo
      return ['bg-gray-100', 'text-gray-800'];
    }
    if (v == 6) { // Pendiente de validación
      // return ['bg-emerald-100', 'text-emerald-800'];
      return ['bg-yellow-200', 'text-yellow-800'];
    }
    if (v == 7) { // Suspendido
      return ['bg-red-100', 'text-red-800'];
    }

    // Estado por defecto para valores no reconocidos
    return ['bg-gray-200', 'text-gray-900'];
  }
  editMode = false;

  toggleEdit() {
    this.editMode = !this.editMode;
  }



  // ******MANEJO DE ARCNHIVOS******
  // ====== En tu clase PerfilComponent ======


  // // --- Setters para enlazar desde el template o componentes hijos ---
  // setFotoFile(file: File) {
  //   // Ej.: ['image/jpeg','image/png','image/webp','image/gif']
  //   this.validateFile(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 2);
  //   this.fotoFile = file;
  //   // preview inmediato (opcional, ya tienes onChangePhoto)
  //   this.setPreviewFromFile(file);
  // }

  // setDocumentoIdentificacionFile(file: File) {
  //   // Acepta imágenes o PDF
  //   this.validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5);
  //   this.docIdentFile = file;
  // }

  // setCedulaFile(file: File) {
  //   this.validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5);
  //   this.cedulaFile = file;
  // }

  // setCurriculumFile(file: File) {
  //   this.validateFile(file, ['application/pdf'], 10);
  //   this.cvFile = file;
  // }

  // onChangeCurriculum(ev: Event) {
  //   const f = (ev.target as HTMLInputElement)?.files?.[0] || null;
  //   this.curriculumFile = f;
  // }
  // onChangeDocumentoIdentificacion(ev: Event) {
  //   const f = (ev.target as HTMLInputElement)?.files?.[0] || null;
  //   this.documentoIdentificacionFile = f;
  // }
  // onChangeCedula(ev: Event) {
  //   const f = (ev.target as HTMLInputElement)?.files?.[0] || null;
  //   this.cedulaFile = f;
  // }

  // private buildDiff(formValue: any, current: Docente): Partial<Docente> {
  //   const diff: Partial<Docente> = {};
  //   Object.keys(formValue).forEach((key) => {
  //     const k = key as keyof Docente;
  //     const nextVal = formValue[k] as any;
  //     const currVal = (current as any)[k];
  //     if (JSON.stringify(nextVal) !== JSON.stringify(currVal)) {
  //       (diff as any)[k] = nextVal;
  //     }
  //   });
  //   return diff;
  // }
// imports sugeridos:
// import { computed, signal } from '@angular/core';
  cursosMap = signal<Map<number, Curso>>(new Map());
  solicitudes = signal<SolicitudCursoApi[]>([]);
aprobados = computed(() =>
  (this.solicitudes?.() ?? []).filter(s => s.estado === 'Aprobado')
);

topAprobados = computed(() => this.aprobados().slice(0, 3));

aprobadosCount = computed(() => this.aprobados().length);

  cargar(): void {
    // this.loading = true;
    // this.errorMsg=null;
   const currentDocenteData = this.docenteData();
   console.log()
    this.svc.listarSolicitudes({
      docenteId: Number(currentDocenteData.id),
      // estado: this.activo() === 'ALL' ? undefined : this.activo(),
      // page: this.page(),
      // pageSize: this.pageSize(),
    })
      .pipe(
        switchMap((res) => {
          const solicitudes = res.solicitudes as SolicitudCursoApi[];
          this.solicitudes.set(solicitudes);
          // this.total.set(res.total ?? solicitudes.length);

          // IDs de curso únicos
          const uniqueIds = Array.from(
            new Set(
              solicitudes
                .map(s => s.cursoId)
                .filter((id): id is number => typeof id === 'number')
            )
          );

          if (uniqueIds.length === 0) {
            // No hay cursos, vaciamos el mapa y seguimos
            this.cursosMap.set(new Map());
            return of(null);
          }

          // Pedimos todos los cursos en paralelo
          const peticiones = uniqueIds.map(id => this.cursosService.getCursoById(id));

          return forkJoin(peticiones).pipe(
            map((cursos: Curso[]) => {
              const mapa = new Map<number, Curso>(cursos.map(c => [c.id, c]));
              this.cursosMap.set(mapa);
              return null;
            })
          );
        }),
        catchError(err => {
          console.error('Error al cargar:', err);
          // this.errorMsg.set('No se pudieron cargar las solicitudes o los cursos.');
          // en caso de error, mantenemos datos previos
          return of(null);
        })
        // finali
      )
      .subscribe(() => {
        // listo
        console.log('Solicitudes:', this.solicitudes());
        // console.log('CursosMap:', this.cursosMap());
      });
  }
}
