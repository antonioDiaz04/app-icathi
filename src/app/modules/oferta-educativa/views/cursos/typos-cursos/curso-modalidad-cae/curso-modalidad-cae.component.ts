import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  signal,
  WritableSignal,
  computed,
} from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { DomSanitizer } from "@angular/platform-browser";
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

export interface Modulo {
  id: number;
  nombre: string;
  clave?: string | undefined;
  duracion_horas: number;
  descripcion: string;
  nivel: string;
  costo?: number | undefined;
  requisitos?: string | undefined;
  area_id?: number | undefined;
  especialidad_id?: number | undefined;
  tipo_curso_id?: number | undefined;
  vigencia_inicio?: string | undefined;
  fecha_publicacion?: string | undefined;
  ultima_actualizacion?: string | undefined;

  firmas: {
    revisado: { nombre: string; cargo: string };
    autorizado: { nombre: string; cargo: string };
    elaborado: { nombre: string; cargo: string };
  };
  objetivos: {
    objetivo: string | undefined;
    perfil_ingreso: string | undefined;
    perfil_egreso: string | undefined;
    perfil_del_docente: string | undefined;
    metodologia: string | undefined;
    bibliografia: string | undefined;
    criterios_acreditacion: string | undefined;
    reconocimiento: string | undefined;
  };
  contenidoProgramatico: {
    temas: Array<{
      id: number | null;
      tema_nombre: string;
      tiempo: number;
      competencias: string | undefined;
      evaluacion: string | undefined;
      actividades: string | undefined;
    }>;
  };
  materiales: Array<{
    id: number | null;
    descripcion: string;
    unidad_de_medida: string | undefined;
    cantidad10?: number | undefined;
    cantidad15?: number | undefined;
    cantidad20?: number | undefined;
  }>;
  equipamiento: Array<{
    id: number | null;
    descripcion: string;
    unidad_de_medida: string | undefined;
    cantidad10?: number | undefined;
    cantidad15?: number | undefined;
    cantidad20?: number | undefined;
  }>;
}

export interface UnitOption {
  value: string;
  label: string;
}

@Component({
  // selector: "app-curso-modalidad-cae",
  selector: "app-curso-modalidad-cae",

  templateUrl: "./curso-modalidad-cae.component.html",
  styles: `
  .ui.dimmer {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
  .ui.mini.text.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }`
})
export class CursoModalidadCAEComponent implements OnInit, OnChanges {
  @Input() selectedCourseId!: number;

  // Signals for state management
  areas = signal<any[]>([]);
  especialidades = signal<any[]>([]);
  tiposCurso = signal<any[]>([]);
  modulos = signal<Modulo[]>([]);
  archivoUrl = signal<any>(null);
  isSaving = signal(false);
  alertMessage = signal<string | null>(null);
  alertTitle = signal<string | null>(null);
  alertType = signal<"success" | "error">("success");
  btnTitle = signal("Agregar");

  // Main course signal
  nuevoCurso = signal<Modulo>({
    id: 0,
    nombre: "",
    costo: 0,
    duracion_horas: 0,
    descripcion: "",
    nivel: "",
    clave: "",
    area_id: undefined,
    especialidad_id: undefined,
    tipo_curso_id: undefined,
    firmas: {
      revisado: { nombre: "", cargo: "Programas de Estudio" },
      autorizado: { nombre: "", cargo: "Directora Académica" },
      elaborado: { nombre: "", cargo: "Director General" },
    },
    vigencia_inicio: undefined,
    fecha_publicacion: undefined,
    objetivos: {
      objetivo: "",
      perfil_ingreso: "",
      perfil_egreso: "",
      perfil_del_docente: "",
      metodologia: "",
      bibliografia: "",
      criterios_acreditacion: "",
      reconocimiento: "",
    },
    contenidoProgramatico: { temas: [] },
    materiales: [],
    equipamiento: [],
  });

  private apiUrl = signal(environment.api);

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarAreas();
    this.cargarEspecialidades();
    this.cargarTiposCurso();

    if (this.selectedCourseId) {
      this.btnTitle.set("Editar");
      console.log(`🔹 Inicializando con ID: ${this.selectedCourseId}`);
      this.showCourseDetails(this.selectedCourseId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedCourseId"] && !changes["selectedCourseId"].firstChange) {
      console.log(`🔹 ID del Curso actualizado: ${this.selectedCourseId}`);
      this.showCourseDetails(this.selectedCourseId);
    }
  }
  get duracionCalculada(): number {
    return this.calcularTotalHoras();
  }
  cargarAreas() {
    this.http.get<any[]>(`${this.apiUrl()}/areas`).subscribe({
      next: (data) => this.areas.set(data),
      error: (err) => console.error("Error loading areas:", err)
    });
  }

  cargarEspecialidades() {
    this.http.get<any[]>(`${this.apiUrl()}/especialidades`).subscribe({
      next: (data) => this.especialidades.set(data),
      error: (err) => console.error("Error loading especialidades:", err)
    });
  }

  cargarTiposCurso() {
    this.http.get<any[]>(`${this.apiUrl()}/tiposCurso`).subscribe({
      next: (data) => this.tiposCurso.set(data),
      error: (err) => console.error("Error loading tipos curso:", err)
    });
  }

  showCourseDetails(id: number) {
    this.http.get<any>(`${this.apiUrl()}/cursos/detalles/${id}`).subscribe({
      next: (data) => {
        this.archivoUrl.set(data.archivo_url);

        const updatedCourse: Modulo = {
          ...this.nuevoCurso(), // Keep default structure
          ...data, // Override with API data
          id: Number(data.id),
          vigencia_inicio: isNaN(new Date(data.vigencia_inicio).getTime())
            ? ""
            : new Date(data.vigencia_inicio).toISOString().split("T")[0],
          fecha_publicacion: isNaN(new Date(data.fecha_publicacion).getTime())
            ? ""
            : new Date(data.fecha_publicacion).toISOString().split("T")[0],
          // duracion_horas: Number(data.duracion_horas),
          duracion_horas: this.duracionCalculada,
          costo: data.costo !== undefined ? Number(data.costo) : undefined,
          area_id: data.area_id !== undefined ? Number(data.area_id) : undefined,
          especialidad_id: data.especialidad_id !== undefined ? Number(data.especialidad_id) : undefined,
          tipo_curso_id: data.tipo_curso_id !== undefined ? Number(data.tipo_curso_id) : undefined,
          objetivos: {
            ...this.nuevoCurso().objetivos,
            ...data.fichaTecnica,
          },
          contenidoProgramatico: {
            temas: Array.isArray(data.contenidoProgramatico)
              ? data.contenidoProgramatico.map((t: any) => ({
                id: Number(t.id),
                tema_nombre: t.tema_nombre,
                tiempo: Number(t.tiempo) || 0,
                competencias: t.competencias || undefined,
                evaluacion: t.evaluacion || undefined,
                actividades: t.actividades || undefined,
              }))
              : [],
          },
          materiales: Array.isArray(data.materiales)
            ? data.materiales.map((m: any) => ({
              id: Number(m.id),
              descripcion: m.descripcion,
              unidad_de_medida: m.unidad_de_medida || undefined,
              cantidad10: m.cantidad_10 !== undefined ? Number(m.cantidad_10) : undefined,
              cantidad15: m.cantidad_15 !== undefined ? Number(m.cantidad_15) : undefined,
              cantidad20: m.cantidad_20 !== undefined ? Number(m.cantidad_20) : undefined,
            }))
            : [],
          equipamiento: Array.isArray(data.equipamiento)
            ? data.equipamiento.map((e: any) => ({
              id: Number(e.id),
              descripcion: e.descripcion,
              unidad_de_medida: e.unidad_de_medida || undefined,
              cantidad10: e.cantidad_10 !== undefined ? Number(e.cantidad_10) : undefined,
              cantidad15: e.cantidad_15 !== undefined ? Number(e.cantidad_15) : undefined,
              cantidad20: e.cantidad_20 !== undefined ? Number(e.cantidad_20) : undefined,
            }))
            : [],
          firmas: {
            revisado: {
              nombre: data.firmas.revisado?.nombre || "",
              cargo: data.firmas.revisado?.cargo || "",
            },
            autorizado: {
              nombre: data.firmas.autorizado?.nombre || "",
              cargo: data.firmas.autorizado?.cargo || "",
            },
            elaborado: {
              nombre: data.firmas.elaborado?.nombre || "",
              cargo: data.firmas.elaborado?.cargo || "",
            },
          },
        };

        this.nuevoCurso.set(updatedCourse);
        console.log("Curso cargado:", this.nuevoCurso());
      },
      error: (err) => {
        console.error("Error al cargar los detalles del curso:", err);
        this.alertMessage.set("Error al cargar los detalles del curso. Intenta más tarde.");
        this.alertTitle.set("Error");
        this.alertType.set("error");
      },
    });
  }

  // Example of computed signal
  hasCourseId = computed(() => this.selectedCourseId > 0);

  // cargarAreas(): void {
  //   this.http.get<any[]>(`${this.apiUrl}/areas`).subscribe({
  //     next: (data) => {
  //       this.areas = data;
  //     },
  //     error: (err) => {
  //       console.error("Error al cargar áreas:", err);
  //     },
  //   });
  // }
  mostrarModalSubirArchivo() {
    this.mostrarFormulario = true;
  }

  // cargarEspecialidades(): void {
  //   this.http.get<any[]>(`${this.apiUrl}/especialidades`).subscribe({
  //     next: (data) => {
  //       this.especialidades = data;
  //     },
  //     error: (err) => {
  //       console.error("Error al cargar especialidades:", err);
  //     },
  //   });
  // }

  // cargarTiposCurso(): void {
  //   this.http.get<any[]>(`${this.apiUrl}/tiposCurso`).subscribe({
  //     next: (data) => {
  //       this.tiposCurso = data;
  //     },
  //     error: (err) => {
  //       console.error("Error al cargar tipos de curso:", err);
  //     },
  //   });
  // }
  // Add these signals at the top of your component class
  selectedFile = signal<File | null>(null);
  isFileSelected = computed(() => this.selectedFile() !== null);

  agregarCurso(): void {
    this.isSaving.set(true);
    this.alertMessage.set(null); // Reset previous alert

    // Crear un objeto FormData
    const formData = new FormData();
    const currentCourse = this.nuevoCurso();

    // Agregar propiedades del objeto `nuevoCurso` a FormData
    formData.append("nombre", currentCourse.nombre);
    formData.append(
      "costo",
      currentCourse.costo !== undefined ? currentCourse.costo.toString() : ""
    );
    formData.append(
      "duracion_horas",
      currentCourse.duracion_horas.toString()
    );
    formData.append("descripcion", currentCourse.descripcion);
    formData.append("nivel", currentCourse.nivel);
    formData.append(
      "vigencia_inicio",
      currentCourse.vigencia_inicio?.toString() || ""
    );
    formData.append(
      "fecha_publicacion",
      currentCourse.fecha_publicacion?.toString() || ""
    );
    formData.append("clave", currentCourse.clave?.toString() || "");
    formData.append("area_id", currentCourse.area_id?.toString() || "");
    formData.append(
      "especialidad_id",
      currentCourse.especialidad_id?.toString() || ""
    );
    formData.append("tipo_curso_id", "1");

    // Append firmas data
    formData.append(
      "revisado_por",
      currentCourse.firmas?.revisado?.nombre?.toString() || ""
    );
    formData.append(
      "cargo_revisado_por",
      currentCourse.firmas?.revisado?.cargo?.toString() || ""
    );
    formData.append(
      "autorizado_por",
      currentCourse.firmas?.autorizado?.nombre?.toString() || ""
    );
    formData.append(
      "cargo_autorizado_por",
      currentCourse.firmas?.autorizado?.cargo?.toString() || ""
    );
    formData.append(
      "elaborado_por",
      currentCourse.firmas?.elaborado?.nombre?.toString() || ""
    );
    formData.append(
      "cargo_elaborado_por",
      currentCourse.firmas?.elaborado?.cargo?.toString() || ""
    );

    // Append file if selected
    const file = this.selectedFile();
    if (file) {
      formData.append("temario", file);
    }

    // Append JSON data
    formData.append("objetivos", JSON.stringify(currentCourse.objetivos));
    formData.append(
      "contenidoProgramatico",
      JSON.stringify(currentCourse.contenidoProgramatico)
    );
    formData.append("materiales", JSON.stringify(currentCourse.materiales));
    formData.append(
      "equipamiento",
      JSON.stringify(currentCourse.equipamiento)
    );

    // Determinar si es una actualización o una creación
    const url = this.selectedCourseId
      ? `${this.apiUrl()}/cursos/${this.selectedCourseId}`
      : `${this.apiUrl()}/cursos`;

    const request = this.selectedCourseId
      ? this.http.put(url, formData)
      : this.http.post<Modulo>(url, formData);

    request.subscribe({
      next: (response) => {
        this.isSaving.set(false);
        if (this.selectedCourseId) {
          this.alertMessage.set(`Curso actualizado correctamente con ID: ${this.selectedCourseId}`);
          this.alertTitle.set("Éxito");
          this.alertType.set("success");
        } else {
          this.modulos.update(modulos => [...modulos, response as Modulo]);
          this.resetNuevoCurso();
          this.alertMessage.set("Curso agregado correctamente.");
          this.alertTitle.set("Éxito");
          this.alertType.set("success");
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error("Error en la operación del curso:", err);
        this.alertMessage.set(
          this.selectedCourseId
            ? "Error al actualizar el curso"
            : "Error al agregar el curso"
        );
        this.alertTitle.set("Error");
        this.alertType.set("error");
      },
      complete: () => {
        this.isSaving.set(false);
      },
    });
  }

  resetNuevoCurso(): void {
    this.selectedFile.set(null);
    this.nuevoCurso.set({
      id: 0,
      nombre: "",
      duracion_horas: 0,
      descripcion: "",
      nivel: "",
      clave: "",
      area_id: undefined,
      especialidad_id: undefined,
      tipo_curso_id: undefined,
      firmas: {
        revisado: { nombre: "", cargo: "Programas de Estudio" },
        autorizado: { nombre: "", cargo: "Directora Académica" },
        elaborado: { nombre: "", cargo: "Director General" },
      },
      objetivos: {
        objetivo: "",
        perfil_ingreso: "",
        perfil_egreso: "",
        perfil_del_docente: "",
        metodologia: "",
        bibliografia: "",
        criterios_acreditacion: "",
        reconocimiento: "",
      },
      contenidoProgramatico: { temas: [] },
      materiales: [],
      equipamiento: [],
    });
  }

  // Métodos para agregar y eliminar temas
  agregarTema(): void {
    this.nuevoCurso.update(current => ({
      ...current,
      contenidoProgramatico: {
        temas: [
          ...current.contenidoProgramatico.temas,
          {
            id: null,
            tema_nombre: "",
            tiempo: 0,
            competencias: undefined,
            evaluacion: undefined,
            actividades: undefined,
          }
        ]
      }
    }));
  }

  eliminarTema(index: number): void {
    this.nuevoCurso.update(current => {
      const newTemas = [...current.contenidoProgramatico.temas];
      newTemas.splice(index, 1);
      return {
        ...current,
        contenidoProgramatico: {
          temas: newTemas
        }
      };
    });
  }

  // Add this method to handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  // Métodos para agregar y eliminar materiales
  // agregarMaterial(): void {
  //   this.nuevoCurso().materiales.push({
  //     id: null,
  //     descripcion: "",
  //     unidad_de_medida: undefined,
  //     cantidad10: undefined,
  //     cantidad15: undefined,
  //     cantidad20: undefined,
  //   });

  //   // console.log("click agregarMaterial")
  // }

  eliminarMaterial(index: number) {
    const materialesActualizados = [...this.nuevoCurso().materiales];
    materialesActualizados.splice(index, 1);

    this.nuevoCurso.set({
      ...this.nuevoCurso(),
      materiales: materialesActualizados
    });
  }

  agregarMaterial() {
    this.nuevoCurso.set({
      ...this.nuevoCurso(),
      materiales: [
        ...this.nuevoCurso().materiales,
        {
          id: null,
          descripcion: '',
          unidad_de_medida: undefined,
          cantidad10: undefined,
          cantidad15: undefined,
          cantidad20: undefined
        }
      ]
    });
  }

  agregarEquipamiento() {
    this.nuevoCurso.set({
      ...this.nuevoCurso(),
      equipamiento: [
        ...this.nuevoCurso().equipamiento,
        {
          id: null,
          descripcion: '',
          unidad_de_medida: undefined,
          cantidad10: undefined,
          cantidad15: undefined,
          cantidad20: undefined
        }
      ]
    });
  }

  eliminarEquipamiento(index: number): void {
    this.nuevoCurso().equipamiento.splice(index, 1);
  }

  // Método para calcular total de horas
  calcularTotalHoras(): number {
    return this.nuevoCurso().contenidoProgramatico.temas.reduce(
      (total, tema) => total + tema.tiempo,
      0
    );
  }

  // Equipamiento y opciones de unidad_de_medida

  unitOptions: UnitOption[] = [
    { value: "PIEZA", label: "PIEZA" },
    { value: "OTRO", label: "OTRO" },
    { value: "SERVICIO", label: "SERVICIO" },
  ];

  showModal = false;
  newUnitName = "";

  mostrarFormulario: boolean = false;

  //*************************FILE */}
  // selectedFile: File | any = null;
  // isUploading = false;
  fileExtension: string = "";

  // Evento cuando se selecciona un archivo

  // Subir el archivo
  // uploadFile(file: File): void {
  //   console.log(file);
  // }

  // Eliminar archivo
  removeFile(): void {
    this.url = "";
    this.selectedFile.set(null);
    this.fileExtension = "";
  }

  // Obtener la extensión del archivo
  getFileExtension(fileName: string): string {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    return ext;
  }

  // Manejar eventos de arrastre
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.fileExtension = this.getFileExtension(file.name);
      // this.uploadFile(file);
    }
  }

  onDragLeave(event: DragEvent): void {
    // Se puede agregar algún efecto visual para cuando el archivo sale del área
  }
  url: any = "";

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileExtension = this.getFileExtension(file.name);

      if (this.fileExtension === "pdf") {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(file)
          );
        };
        reader.readAsDataURL(file);
      }
    }
  }

  page: number = 1;
  totalPages!: number;
  isLoaded: boolean = false;

  callbackFn(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
    this.isLoaded = true;
  }

  nextTep() {
    this.page++;
  }
  prevTep() {
    this.page--;
  }
}
