import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidadorDocenteService } from '../../../validador/commons/services/validador-docente.service';
import { DocenteDataService } from '../../commons/services/docente-data.service';
import { AuthService } from '../../../../shared/services/auth.service';

type TabKey = 'personal' | 'documentacion' | 'configuracion' | 'seguridad';


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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
  // --- Tabs ---
  tabs: { key: TabKey; label: string }[] = [
    { key: 'personal', label: 'Información Personal' },
    { key: 'documentacion', label: 'Documentación' },
    { key: 'configuracion', label: 'Configuración' },
    { key: 'seguridad', label: 'Seguridad' },
  ];
  activeTab = signal<TabKey>('personal');
  setTab(t: TabKey) { this.activeTab.set(t); }
  isActive = (t: TabKey) => computed(() => this.activeTab() === t);

  // --- Estado/UI ---
  saving = signal(false);
  fotoPreview = signal<string | null>(null);

  // --- Formulario ---
  form: FormGroup;
  docenteData = signal<any>(null)
  id = signal<number | null>(null)

  // // Simulación: datos recibidos desde tu API
  // docente: Docente = {
  //   "id": 379,
  //   "nombre": "Claudio",
  //   "apellidos": "franco escamilla",
  //   "email": "20211036@uthh.edu.mx",
  //   "telefono": "7711512740",
  //   "especialidad": null,
  //   "certificado_profesional": false,
  //   "cedula_profesional": "https://iicathi-api-yiit.onrender.com/archivos/descargar?folder=cedulas_docentes&nombre=sewss-1755849120790-307066525.pdf",
  //   "documento_identificacion": "https://iicathi-api-yiit.onrender.com/archivos/descargar?folder=documentos_identificacion_docentes&nombre=Doc1-1755848993017-260800619.pdf",
  //   "num_documento_identificacion": null,
  //   "curriculum_url": null,
  //   "estatus_tipo": "DOCENTE",
  //   "estatus_valor": "Pendiente de validación",
  //   "created_at": "2025-08-21T23:41:21.105Z",
  //   "updated_at": "2025-08-22T07:55:20.291Z",
  //   "usuario_validador_id": null,
  //   "fecha_validacion": null,
  //   "foto_url": "https://iicathi-api-yiit.onrender.com/archivos/descargar?folder=perfiles_docentes&nombre=ChatGPT_Image_23_jul_2025_20_59_56-1755849313266-454937655.png",
  //   "validador_nombre": null,
  //   "validador_apellidos": null
  // };

  // get chipColor() {
  //   const v = (this.docente.estatus_valor || '').toLowerCase();
  //   if (v.includes('verific') || v.includes('validado')) return 'chip--ok';
  //   if (v.includes('pendiente')) return 'chip--warn';
  //   return 'chip';
  // }
  // Computed para el color del chip de estado
  chipColor = computed(() => {
    const docente = this.docenteData();
    if (!docente || !docente.estatus_valor) return 'chip';

    const v = docente.estatus_valor.toLowerCase();
    if (v.includes('verific') || v.includes('validado')) return 'chip--ok';
    if (v.includes('pendiente')) return 'chip--warn';
    return 'chip';
  });

  constructor(private fb: FormBuilder
    , private validadorDocenteService: ValidadorDocenteService,
    private docenteDataService: DocenteDataService,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      whatsapp: [''],
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

    effect(() => {
      const data = this.docenteData();
      if (data) {
        this.patchFromDocente(data);
      }
    });
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

    // Establecer la vista previa de la foto si existe
    if (docente.foto_url) {
      this.fotoPreview.set(docente.foto_url);
    }
  }
  onChangePhoto(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    // Preview local
    const reader = new FileReader();
    reader.onload = () => this.fotoPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    // Aquí podrías subir el archivo y, al recibir la URL del backend, setear:
    // this.form.get('foto_url')?.setValue(urlSubida);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);

    // Payload listo para enviar a tu API
    // const payload = {
    //   ...this.docente,
    //   ...this.form.value,
    // };

    // TODO: Llamar a tu servicio (apiClient) y manejar respuesta/errores
    // this.api.updateDocente(this.docente.id, payload).subscribe(...)

    setTimeout(() => this.saving.set(false), 600); // simulación
  }

  onCancel(): void {
    // Restaurar valores originales
    const docente = this.docenteData();
    if (docente) {
      this.patchFromDocente(docente);
    }
  }
statusClass(v: Number) {
    console.log("estatus_id", v);
    
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
}
