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

  revisado_por?: string | undefined; // Última actualización puede estar indefinida
  cargo_revisado_por?: string | undefined; // Última actualización puede estar indefinida
  autorizado_por?: string | undefined; // Última actualización puede estar indefinida
  cargo_autorizado_por?: string | undefined; // Última actualización puede estar indefinida
  elaborado_por?: string | undefined; // Última actualización puede estar indefinida
  cargo_elaborado_por?: string | undefined; // Última actualización puede estar indefinida
  
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
      tema_nombre: string;
      tiempo: number;
      competencias: string | undefined; // Competencias pueden estar indefinidas
      evaluacion: string | undefined; // Evaluación puede estar indefinida
      actividades: string | undefined; // Actividades pueden estar indefinidas
    }>;
  };
}

@Component({
  selector: "app-curso-modalidad-virtual",
  templateUrl: "./curso-modalidad-virtual.component.html",
  styles: `/* Asegura que el dimmer ocupe toda la pantalla */
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
export class CursoModalidadVirtualComponent implements OnInit, OnChanges {
  @Input() selectedCourseId!: number;

  areas: any[] = [];
  especialidades: any[] = [];
  tiposCurso: any[] = [];
  modulos: Modulo[] = [];
  selectedCourseDetails: any = null;

  nuevoCurso: Modulo = {
    id: 0,
    nombre: "",
    duracion_horas: 0,
    descripcion: "",
    nivel: "",
    clave: "",
    area_id: undefined,
    especialidad_id: undefined,
    tipo_curso_id: undefined,

    revisado_por: '',
    cargo_revisado_por: 'Programas de Estudio',
    autorizado_por: '',
    cargo_autorizado_por: 'Directora Académica',
    elaborado_por: '',
    cargo_elaborado_por: 'Director General',


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
    // materiales: [],
    // equipamiento: []
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
  archivoUrl!:any

  showCourseDetails(id: number) {
    this.http.get<any>(`${this.apiUrl}/cursos/detalles/${id}`).subscribe({
      next: (data) => {
                this.archivoUrl= data.archivo_url;
        
        this.nuevoCurso = {
          ...this.nuevoCurso, // Mantiene la estructura inicial
          ...data, // Sobrescribe los datos con los valores obtenidos
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
    formData.append("tipo_curso_id", "2");
    formData.append(
      "revisado_por",
      this.nuevoCurso.revisado_por?.toString() || ""
    );
    formData.append(
      "autorizado_por",
      this.nuevoCurso.autorizado_por?.toString() || ""
    );
    formData.append(
      "elaborado_por",
      this.nuevoCurso.elaborado_por?.toString() || ""
    );

    formData.append("temario", this.selectedFile);
    // Convertir `objetivos` a JSON y agregarlo a FormData
    formData.append("objetivos", JSON.stringify(this.nuevoCurso.objetivos));

    // Convertir `contenidoProgramatico` a JSON y agregarlo
    formData.append(
      "contenidoProgramatico",
      JSON.stringify(this.nuevoCurso.contenidoProgramatico)
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
             ? "Error al actualizar el curso."
             : "Error al agregar el curso.";
           this.alertTitle = "Error";
           this.alertType = "error";
         },
         complete: () => {
           this.isSaving = false;
         },
       });
   
  }

  resetNuevoCurso(): void {
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
      // materiales: [],
      // equipamiento: []
    };
  }

  // Métodos para agregar y eliminar temas
  agregarTema(): void {
    this.nuevoCurso.contenidoProgramatico.temas.push({
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

  // Método para calcular total de horas
  calcularTotalHoras(): number {
    return this.nuevoCurso.contenidoProgramatico.temas.reduce(
      (total, tema) => total + tema.tiempo,
      0
    );
  }

  showModal = false;
  newUnitName = "";
  mostrarFormulario: boolean = false;

  mostrarModalSubirArchivo() {
    this.mostrarFormulario = true;
  }

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
