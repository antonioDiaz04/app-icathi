import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { DomSanitizer } from "@angular/platform-browser";
export interface Modulo {
  id: number;
  nombre: string;
  clave?: string | undefined; // Clave puede estar sin definir
  duracion_horas: number;
  descripcion: string;
  nivel: string;
  costo?: number | undefined; // Costo puede estar indefinido
  requisitos?: string | undefined; // Requisitos pueden estar indefinidos
  area_id?: number | undefined; // ID del área puede estar indefinido
  especialidad_id?: number | undefined; // ID de especialidad puede estar indefinido
  tipo_curso_id?: number | undefined; // ID del tipo de curso puede estar indefinido
  vigencia_inicio?: string | undefined; // Fecha de vigencia puede estar indefinida
  fecha_publicacion?: string | undefined; // Fecha de publicación puede estar indefinida
  ultima_actualizacion?: string | undefined; // Última actualización puede estar indefinida

  firmas: {
    revisado: { nombre: string; cargo: string };
    autorizado: { nombre: string; cargo: string };
    elaborado: { nombre: string; cargo: string };
  };
  objetivos: {
    objetivo: string | undefined; // Objetivo del curso puede estar indefinido
    perfil_ingreso: string | undefined; // Perfil de ingreso
    perfil_egreso: string | undefined; // Perfil de egreso
    perfil_del_docente: string | undefined; // Perfil del docente
    metodologia: string | undefined; // Metodología de capacitación
    bibliografia: string | undefined; // Bibliografía
    criteriosAcreditacion: string | undefined; // Criterios de acreditación
    reconocimiento: string | undefined; // Reconocimiento al alumno
  };
  contenidoProgramatico: {
    temas: Array<{
      id: number | null;
      tema_nombre: string;
      tiempo: number;
      competencias: string | undefined; // Competencias pueden estar indefinidas
      evaluacion: string | undefined; // Evaluación puede estar indefinida
      actividades: string | undefined; // Actividades pueden estar indefinidas
    }>;
  };
  materiales: Array<{
    id: number | null;

    descripcion: string;
    unidad_de_medida: string | undefined; // Unidad puede estar indefinida
    cantidad10?: number | undefined; // Cantidad para 10 puede estar indefinida
    cantidad15?: number | undefined; // Cantidad para 15 puede estar indefinida
    cantidad20?: number | undefined; // Cantidad para 20 puede estar indefinida
  }>;
  equipamiento: Array<{
    id: number | null;

    descripcion: string;
    unidad_de_medida: string | undefined; // Unidad puede estar indefinida
    cantidad10?: number | undefined; // Cantidad para 10 puede estar indefinida
    cantidad15?: number | undefined; // Cantidad para 15 puede estar indefinida
    cantidad20?: number | undefined; // Cantidad para 20 puede estar indefinida
  }>;
}

export interface UnitOption {
  value: string;
  label: string;
}

@Component({
  selector: "app-curso-modalidad-cae",
  templateUrl: "./curso-modalidad-cae.component.html",
  styles: `
  /* Asegura que el dimmer ocupe toda la pantalla */
.ui.dimmer {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000; /* Asegura que esté por encima de todo */
}

/* Asegura que el loader esté centrado */
.ui.mini.text.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
})
export class CursoModalidadCAEComponent implements OnInit, OnChanges {
  @Input() selectedCourseId!: number;
  areas: any[] = [];
  especialidades: any[] = [];
  tiposCurso: any[] = [];
  modulos: Modulo[] = [];
  selectedCourseDetails: any = null;
  cursoData: any;

  nuevoCurso: Modulo = {
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
      criteriosAcreditacion: "",
      reconocimiento: "",
    },
    contenidoProgramatico: { temas: [] },
    materiales: [],
    equipamiento: [],
  };

  private apiUrl = `${environment.api}`;

  // For loading state and alert message
  isSaving = false;
  alertMessage: string | null = null;
  alertTitle: string | null = null;
  alertType: "success" | "error" = "success";
  btnTtle?: string;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarAreas();
    this.cargarEspecialidades();
    this.cargarTiposCurso();
    if (this.selectedCourseId) {
      this.btnTtle = "Editar";
      console.log(`🔹 Inicializando con ID: ${this.selectedCourseId}`);
      this.showCourseDetails(this.selectedCourseId);
    } else {
      this.btnTtle = "Agregar";
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["selectedCourseId"] &&
      !changes["selectedCourseId"].firstChange
    ) {
      console.log(`🔹 ID del Curso actualizado: ${this.selectedCourseId}`);
      alert(`🔹 ID del Curso actualizado: ${this.selectedCourseId}`);
    }
  }
  archivoUrl!: any;
  showCourseDetails(id: number) {
    this.http.get<any>(`${this.apiUrl}/cursos/detalles/${id}`).subscribe({
      next: (data) => {
        this.archivoUrl = data.archivo_url;
        this.nuevoCurso = {
          ...this.nuevoCurso, // Mantiene la estructura inicial
          ...data, // Sobrescribe los datos con los valores obtenidos

          id: Number(data.id),

          // Convertir las fechas ISO a timestamps
          vigencia_inicio: isNaN(new Date(data.vigencia_inicio).getTime())
            ? ""
            : new Date(data.vigencia_inicio).toISOString().split("T")[0],
          fecha_publicacion: isNaN(new Date(data.fecha_publicacion).getTime())
            ? ""
            : new Date(data.fecha_publicacion).toISOString().split("T")[0],
          duracion_horas: Number(data.duracion_horas),
          costo: data.costo !== undefined ? Number(data.costo) : undefined,
          area_id:
            data.area_id !== undefined ? Number(data.area_id) : undefined,
          especialidad_id:
            data.especialidad_id !== undefined
              ? Number(data.especialidad_id)
              : undefined,
          tipo_curso_id:
            data.tipo_curso_id !== undefined
              ? Number(data.tipo_curso_id)
              : undefined,
          objetivos: {
            ...this.nuevoCurso.objetivos,
            ...data.fichaTecnica, // Mapea los datos de ficha técnica
          },
          contenidoProgramatico: {
            temas: Array.isArray(data.contenidoProgramatico)
              ? data.contenidoProgramatico.map((t: any) => ({
                  id: Number(t.id),
                  tema_nombre: t.tema_nombre, // Ajusta al nombre correcto de la propiedad
                  tiempo: Number(t.tiempo) || 0, // Convierte a número con valor por defecto 0
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
                cantidad10:
                  m.cantidad_10 !== undefined
                    ? Number(m.cantidad_10)
                    : undefined,
                cantidad15:
                  m.cantidad_15 !== undefined
                    ? Number(m.cantidad_15)
                    : undefined,
                cantidad20:
                  m.cantidad_20 !== undefined
                    ? Number(m.cantidad_20)
                    : undefined,
              }))
            : [],
          equipamiento: Array.isArray(data.equipamiento)
            ? data.equipamiento.map((e: any) => ({
                id: Number(e.id),

                descripcion: e.descripcion,
                unidad_de_medida: e.unidad_de_medida || undefined,
                cantidad10:
                  e.cantidad_10 !== undefined
                    ? Number(e.cantidad_10)
                    : undefined,
                cantidad15:
                  e.cantidad_15 !== undefined
                    ? Number(e.cantidad_15)
                    : undefined,
                cantidad20:
                  e.cantidad_20 !== undefined
                    ? Number(e.cantidad_20)
                    : undefined,
              }))
            : [],
             // Mapear las firmas
        firmas: {
          revisado: {
            nombre: data.firmas.revisado_por?.nombre || "",
            cargo: data.firmas.revisado_por?.cargo || "",
          },
          autorizado: {
            nombre: data.firmas.autorizado_por?.nombre || "",
            cargo: data.firmas.autorizado_por?.cargo || "",
          },
          elaborado: {
            nombre: data.firmas.elaborado_por?.nombre || "",
            cargo: data.firmas.elaborado_por?.cargo || "",
          },
        },
        };

        console.log("Curso cargado:", this.nuevoCurso);
      },
      error: (err) => {
        console.error("Error al cargar los detalles del curso:", err);
        alert("Error al cargar los detalles del curso. Intenta más tarde.");
      },
    });
  }

  cargarAreas(): void {
    this.http.get<any[]>(`${this.apiUrl}/areas`).subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error("Error al cargar áreas:", err);
      },
    });
  }
  mostrarModalSubirArchivo() {
    this.mostrarFormulario = true;
  }

  cargarEspecialidades(): void {
    this.http.get<any[]>(`${this.apiUrl}/especialidades`).subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: (err) => {
        console.error("Error al cargar especialidades:", err);
      },
    });
  }

  cargarTiposCurso(): void {
    this.http.get<any[]>(`${this.apiUrl}/tiposCurso`).subscribe({
      next: (data) => {
        this.tiposCurso = data;
      },
      error: (err) => {
        console.error("Error al cargar tipos de curso:", err);
      },
    });
  }
  agregarCurso(): void {
    this.isSaving = true;
    this.alertMessage = null; // Reset previous alert

    // Crear un objeto FormData
    const formData = new FormData();

    // Agregar propiedades del objeto `nuevoCurso` a FormData
    formData.append("nombre", this.nuevoCurso.nombre);
    formData.append(
      "costo",
      this.nuevoCurso.costo !== undefined
        ? this.nuevoCurso.costo.toString()
        : ""
    );
    formData.append(
      "duracion_horas",
      this.nuevoCurso.duracion_horas.toString()
    );
    formData.append("descripcion", this.nuevoCurso.descripcion);
    formData.append("nivel", this.nuevoCurso.nivel);
    formData.append(
      "vigencia_inicio",
      this.nuevoCurso.vigencia_inicio?.toString() || ""
    );
    formData.append(
      "fecha_publicacion",
      this.nuevoCurso.fecha_publicacion?.toString() || ""
    );
    formData.append("clave", this.nuevoCurso.clave?.toString() || "");
    formData.append("area_id", this.nuevoCurso.area_id?.toString() || "");
    formData.append(
      "especialidad_id",
      this.nuevoCurso.especialidad_id?.toString() || ""
    );
    formData.append("tipo_curso_id", "1");

    formData.append(
      "revisado_por",
      this.nuevoCurso.firmas?.revisado?.nombre?.toString() || ""
    );
    formData.append(
      "cargo_revisado_por",
      this.nuevoCurso.firmas?.revisado?.cargo?.toString() || ""
    );

    formData.append(
      "autorizado_por",
      this.nuevoCurso.firmas?.autorizado?.nombre?.toString() || ""
    );
    formData.append(
      "cargo_autorizado_por",
      this.nuevoCurso.firmas?.autorizado?.cargo?.toString() || ""
    );

    formData.append(
      "elaborado_por",
      this.nuevoCurso.firmas?.elaborado?.nombre?.toString() || ""
    );
    formData.append(
      "cargo_elaborado_por",
      this.nuevoCurso.firmas?.elaborado?.cargo?.toString() || ""
    );

    formData.append("temario", this.selectedFile);
    formData.append("objetivos", JSON.stringify(this.nuevoCurso.objetivos));
    formData.append(
      "contenidoProgramatico",
      JSON.stringify(this.nuevoCurso.contenidoProgramatico)
    );
    formData.append("materiales", JSON.stringify(this.nuevoCurso.materiales));
    formData.append(
      "equipamiento",
      JSON.stringify(this.nuevoCurso.equipamiento)
    );

    // Determinar si es una actualización o una creación
    const url = this.selectedCourseId
      ? `${this.apiUrl}/cursos/${this.selectedCourseId}`
      : `${this.apiUrl}/cursos`;

    // ternario que verifica si hay id,deciendo la url depende si lo hay

    const request = this.selectedCourseId
      ? this.http.put(url, formData)
      : this.http.post<Modulo>(url, formData);

    request.subscribe({
      next: (response) => {
        this.isSaving = false;
        if (this.selectedCourseId) {
          alert(
            `🔹 Curso actualizado correctamente con ID: ${this.selectedCourseId}`
          );
        } else {
          this.modulos.push(response as Modulo);
          this.resetNuevoCurso();
          this.alertMessage = "Curso agregado correctamente.";
          this.alertTitle = "Éxito";
          this.alertType = "success";
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error("Error en la operación del curso:", err);
        this.alertMessage = this.selectedCourseId
          ? `Error al actualizar el curso `
          : `Error al agregar el curso`;
        this.alertTitle = "Error";
        this.alertType = "error";
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }

  resetNuevoCurso(): void {
    // this.selectedFile=null
    this.nuevoCurso = {
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
        criteriosAcreditacion: "",
        reconocimiento: "",
      },
      contenidoProgramatico: { temas: [] },
      materiales: [],
      equipamiento: [],
    };
  }

  // Métodos para agregar y eliminar temas
  agregarTema(): void {
    this.nuevoCurso.contenidoProgramatico.temas.push({
      id: null,
      tema_nombre: "",
      tiempo: 0,
      competencias: undefined,
      evaluacion: undefined,
      actividades: undefined,
    });
  }

  eliminarTema(index: number): void {
    this.nuevoCurso.contenidoProgramatico.temas.splice(index, 1);
  }

  // Métodos para agregar y eliminar materiales
  agregarMaterial(): void {
    this.nuevoCurso.materiales.push({
      id: null,
      descripcion: "",
      unidad_de_medida: undefined,
      cantidad10: undefined,
      cantidad15: undefined,
      cantidad20: undefined,
    });
  }

  eliminarMaterial(index: number): void {
    this.nuevoCurso.materiales.splice(index, 1);
  }

  // Métodos para agregar y eliminar equipamiento
  agregarEquipamiento(): void {
    this.nuevoCurso.equipamiento.push({
      id: null,
      descripcion: "",
      unidad_de_medida: undefined,
      cantidad10: undefined,
      cantidad15: undefined,
    });
  }

  eliminarEquipamiento(index: number): void {
    this.nuevoCurso.equipamiento.splice(index, 1);
  }

  // Método para calcular total de horas
  calcularTotalHoras(): number {
    return this.nuevoCurso.contenidoProgramatico.temas.reduce(
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
  selectedFile: File | any = null;
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
    this.selectedFile = null;
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
      this.selectedFile = file;
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
