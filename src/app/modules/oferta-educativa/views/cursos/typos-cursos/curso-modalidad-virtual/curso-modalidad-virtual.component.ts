import {
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmTaiwilService } from "../../../../../../shared/services/confirm-taiwil.service";
import { AlertTaiwilService } from "../../../../../../shared/services/alert-taiwil.service";
import { FileUploadService } from "../../../../../../shared/services/file-upload.service";
import { Observable, switchMap } from "rxjs";

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
    criterios_acreditacion: string | undefined; // Criterios de acreditación
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
  modulos = signal<Modulo[]>([]);
  selectedCourseDetails: any = null;
  alertMessage = signal<string | null>(null);
  alertTitle = signal<string | null>(null);
  btnTitle = signal("GUARDAR");
  isSaving = signal(false);
  archivoUrl = signal<any>(null);

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
    // materiales: [],
    // equipamiento: [],
  });

  // nuevoCurso: Modulo = {
  //   id: 0,
  //   nombre: "",
  //   duracion_horas: 0,
  //   descripcion: "",
  //   nivel: "",
  //   clave: "",
  //   area_id: undefined,
  //   especialidad_id: undefined,
  //   tipo_curso_id: undefined,
  //   firmas: {
  //     revisado: { nombre: "", cargo: "Programas de Estudio" },
  //     autorizado: { nombre: "", cargo: "Directora Académica" },
  //     elaborado: { nombre: "", cargo: "Director General" },
  //   },

  //   vigencia_inicio: undefined,
  //   fecha_publicacion: undefined,
  //   objetivos: {
  //     objetivo: "",
  //     perfil_ingreso: "",
  //     perfil_egreso: "",
  //     perfil_del_docente: "",
  //     metodologia: "",
  //     bibliografia: "",
  //     criterios_acreditacion: "",
  //     reconocimiento: "",
  //   },
  //   contenidoProgramatico: { temas: [] },
  //   // materiales: [],
  //   // equipamiento: []
  // };

  // private apiUrl = `${environment.api}`;
  private apiUrl = signal(environment.api);


  // For loading state and alert message
  // isSaving = false;
  // alertMessage: string | null = null;
  // alertTitle: string | null = null;
  alertType = signal<"success" | "error">("success");
  btnTtle?: string;

  // constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }
  constructor(private confirmService: ConfirmTaiwilService, private alertTaiwilService: AlertTaiwilService, private sanitizer: DomSanitizer, private http: HttpClient, private fileUploadService: FileUploadService) { }
  ngOnInit(): void {
    this.cargarAreas();
    this.cargarEspecialidades();
    this.cargarTiposCurso();
    if (this.selectedCourseId) {
      this.btnTitle.set("GUARDAR CAMBIOS");
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
  // archivoUrl!: any

  // showCourseDetails(id: number) {
  //   this.http.get<any>(`${this.apiUrl()}/cursos/detalles/${id}`).subscribe({
  //     next: (data) => {
  //       this.archivoUrl.set(data.archivo_url);

  //       this.nuevoCurso = {
  //         ...this.nuevoCurso, // Mantiene la estructura inicial
  //         ...data, // Sobrescribe los datos con los valores obtenidos
  //         // Convertir las fechas ISO a timestamps
  //         vigencia_inicio: isNaN(new Date(data.vigencia_inicio).getTime())
  //           ? ""
  //           : new Date(data.vigencia_inicio).toISOString().split("T")[0],
  //         fecha_publicacion: isNaN(new Date(data.fecha_publicacion).getTime())
  //           ? ""
  //           : new Date(data.fecha_publicacion).toISOString().split("T")[0],
  //         duracion_horas: Number(data.duracion_horas),
  //         costo: data.costo !== undefined ? Number(data.costo) : undefined,
  //         area_id:
  //           data.area_id !== undefined ? Number(data.area_id) : undefined,
  //         especialidad_id:
  //           data.especialidad_id !== undefined
  //             ? Number(data.especialidad_id)
  //             : undefined,
  //         tipo_curso_id:
  //           data.tipo_curso_id !== undefined
  //             ? Number(data.tipo_curso_id)
  //             : undefined,
  //         objetivos: {
  //           ...this.nuevoCurso().objetivos,
  //           ...data.fichaTecnica, // Mapea los datos de ficha técnica
  //         },
  //         contenidoProgramatico: {
  //           temas: Array.isArray(data.contenidoProgramatico)
  //             ? data.contenidoProgramatico.map((t: any) => ({
  //               id: Number(t.id),
  //               tema_nombre: t.tema_nombre, // Ajusta al nombre correcto de la propiedad
  //               tiempo: Number(t.tiempo) || 0, // Convierte a número con valor por defecto 0
  //               competencias: t.competencias || undefined,
  //               evaluacion: t.evaluacion || undefined,
  //               actividades: t.actividades || undefined,
  //             }))
  //             : [],
  //         },
  //         firmas: {
  //           revisado: {
  //             nombre: data.firmas.revisado?.nombre || "",
  //             cargo: data.firmas.revisado?.cargo || "",
  //           },
  //           autorizado: {
  //             nombre: data.firmas.autorizado?.nombre || "",
  //             cargo: data.firmas.autorizado?.cargo || "",
  //           },
  //           elaborado: {
  //             nombre: data.firmas.elaborado?.nombre || "",
  //             cargo: data.firmas.elaborado?.cargo || "",
  //           },
  //         },
  //       };

  //       console.log("Curso cargado:", this.nuevoCurso());
  //     },
  //     error: (err) => {
  //       console.error("Error al cargar los detalles del curso:", err);
  //       alert("Error al cargar los detalles del curso. Intenta más tarde.");
  //     },
  //   });
  // }
  get duracionCalculada(): number {
    return this.calcularTotalHoras();
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

  cargarAreas(): void {
    this.http.get<any[]>(`${this.apiUrl()}/areas`).subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error("Error al cargar áreas:", err);
      },
    });
  }

  cargarEspecialidades(): void {
    this.http.get<any[]>(`${this.apiUrl()}/especialidades`).subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: (err) => {
        console.error("Error al cargar especialidades:", err);
      },
    });
  }

  cargarTiposCurso(): void {
    this.http.get<any[]>(`${this.apiUrl()}/tiposCurso`).subscribe({
      next: (data) => {
        this.tiposCurso = data;
      },
      error: (err) => {
        console.error("Error al cargar tipos de curso:", err);
      },
    });
  }
  agregarCurso(): void {
    this.isSaving.set(true);
    this.alertMessage.set(null); // Reset previous alert

    const currentCourse = this.nuevoCurso();
    const file = this.selectedFile();

    // Si hay archivo seleccionado, primero subirlo
    if (file) {
      this.fileUploadService.uploadTemario(file).pipe(
        switchMap((response) => {
          // Una vez subido el archivo, proceder con el resto de los datos
          const formData = this.prepareFormData(currentCourse, response.fileUrl);
          return this.sendCourseRequest(formData);
        })
      ).subscribe({
        next: (response) => this.handleSuccess(response),
        error: (err) => this.handleError(err)
      });
    } else {
      // Si no hay archivo, proceder normalmente
      const formData = this.prepareFormData(currentCourse);
      this.sendCourseRequest(formData).subscribe({
        next: (response) => this.handleSuccess(response),
        error: (err) => this.handleError(err)
      });
    }
  }
  // Manejo de respuesta exitosa
  private handleSuccess(response: any): void {
    this.isSaving.set(false);
    if (this.selectedCourseId) {
      this.alertMessage.set(`Curso actualizado correctamente con ID: ${this.selectedCourseId}`);
      this.alertTaiwilService.showTailwindAlert("Curso actualizado correctamente con ID" + this.selectedCourseId, "success");
      this.showCourseDetails(this.selectedCourseId)
    } else {
      this.modulos.update(modulos => [...modulos, response as Modulo]);
      this.resetNuevoCurso();
      // this.eliminarArchivo();
      this.alertMessage.set("Curso agregado correctamente.");
      this.alertTaiwilService.showTailwindAlert("Curso agregado correctamente", "success");
    }
    this.alertTitle.set("Éxito");
    this.alertType.set("success");
  }

  // Manejo de errores
  private handleError(err: any): void {
    this.isSaving.set(false);
    console.error("Error en la operación del curso:", err);
    this.alertMessage.set(
      this.selectedCourseId
        ? "Error al actualizar el curso"
        : "Error al agregar el curso"
    );
    this.alertTaiwilService.showTailwindAlert(this.selectedCourseId
      ? "Error al actualizar el curso"
      : "Error al agregar el curso", "error");
    this.alertTitle.set("Error");
    this.alertType.set("error");
  }
  // Método auxiliar para enviar la solicitud
  private sendCourseRequest(formData: FormData): Observable<any> {
    const url = this.selectedCourseId
      ? `${this.apiUrl()}/cursos/${this.selectedCourseId}`
      : `${this.apiUrl()}/cursos`;

    return this.selectedCourseId
      ? this.http.put(url, formData)
      : this.http.post<Modulo>(url, formData);
  }
  // Método auxiliar para preparar el FormData
  private prepareFormData(currentCourse: any, fileUrl: string = ''): FormData {
    const formData = new FormData();

    // Agregar propiedades básicas
    formData.append("nombre", currentCourse.nombre);
    formData.append("costo", currentCourse.costo?.toString() || "");
    formData.append("duracion_horas", currentCourse.duracion_horas.toString());
    formData.append("descripcion", currentCourse.descripcion);
    formData.append("nivel", currentCourse.nivel);
    formData.append("vigencia_inicio", currentCourse.vigencia_inicio?.toString() || "");
    formData.append("fecha_publicacion", currentCourse.fecha_publicacion?.toString() || "");
    formData.append("clave", currentCourse.clave?.toString() || "");
    formData.append("area_id", currentCourse.area_id?.toString() || "");
    formData.append("especialidad_id", currentCourse.especialidad_id?.toString() || "");
    formData.append("tipo_curso_id", "2");

    // Agregar URL del archivo si existe
    // Agregar URL del archivo si existe
    // if (fileUrl) {
    //   formData.append("archivo_url", fileUrl);
    // }
    // Manejo explícito del archivo:
    if (this.selectedFile()) {
      // Caso: Hay un nuevo archivo seleccionado
      formData.append("archivo_url", fileUrl);
    } else if (this.archivoUrl()) {
      // Caso: No hay archivo nuevo pero hay URL existente (edición sin modificar archivo)
      formData.append("archivo_url", this.archivoUrl());
    }



    // Firmas
    formData.append("revisado_por", currentCourse.firmas?.revisado?.nombre?.toString() || "");
    formData.append("cargo_revisado_por", currentCourse.firmas?.revisado?.cargo?.toString() || "");
    formData.append("autorizado_por", currentCourse.firmas?.autorizado?.nombre?.toString() || "");
    formData.append("cargo_autorizado_por", currentCourse.firmas?.autorizado?.cargo?.toString() || "");
    formData.append("elaborado_por", currentCourse.firmas?.elaborado?.nombre?.toString() || "");
    formData.append("cargo_elaborado_por", currentCourse.firmas?.elaborado?.cargo?.toString() || "");

    // Datos JSON
    formData.append("objetivos", JSON.stringify(currentCourse.objetivos));
    formData.append("contenidoProgramatico", JSON.stringify(currentCourse.contenidoProgramatico));
    // formData.append("materiales", JSON.stringify(currentCourse.materiales));
    // formData.append("equipamiento", JSON.stringify(currentCourse.equipamiento));

    // Debug: Mostrar contenido de FormData
    console.log("Contenido de FormData:");
    for (const [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    return formData;
  }
  //   agregarCurso(): void {
  //     this.isSaving.set(true);
  //     this.alertMessage.set(null); // Reset previous alert
  //     // Crear un objeto FormData
  //     const formData = new FormData();

  //     // Agregar propiedades del objeto `nuevoCurso` a FormData
  //     formData.append("nombre", this.nuevoCurso.nombre);
  //     formData.append(
  //       "costo",
  //       this.nuevoCurso.costo !== undefined
  //         ? this.nuevoCurso.costo.toString()
  //         : ""
  //     );
  //     formData.append(
  //       "duracion_horas",
  //       this.nuevoCurso.duracion_horas.toString()
  //     );
  //     formData.append("descripcion", this.nuevoCurso.descripcion);
  //     formData.append("nivel", this.nuevoCurso.nivel);
  //     formData.append(
  //       "vigencia_inicio",
  //       this.nuevoCurso.vigencia_inicio?.toString() || ""
  //     );
  //     formData.append(
  //       "fecha_publicacion",
  //       this.nuevoCurso.fecha_publicacion?.toString() || ""
  //     );
  //     formData.append("clave", this.nuevoCurso.clave?.toString() || "");
  //     formData.append("area_id", this.nuevoCurso.area_id?.toString() || "");
  //     formData.append(
  //       "especialidad_id",
  //       this.nuevoCurso.especialidad_id?.toString() || ""
  //     );
  //     formData.append("tipo_curso_id", "2");

  //     formData.append(
  //       "revisado_por",
  //       this.nuevoCurso.firmas?.revisado?.nombre?.toString() || ""
  //     );
  //     formData.append(
  //       "cargo_revisado_por",
  //       this.nuevoCurso.firmas?.revisado?.cargo?.toString() || ""
  //     );

  //     formData.append(
  //       "autorizado_por",
  //       this.nuevoCurso.firmas?.autorizado?.nombre?.toString() || ""
  //     );
  //     formData.append(
  //       "cargo_autorizado_por",
  //       this.nuevoCurso.firmas?.autorizado?.cargo?.toString() || ""
  //     );

  //     formData.append(
  //       "elaborado_por",
  //       this.nuevoCurso.firmas?.elaborado?.nombre?.toString() || ""
  //     );
  //     formData.append(
  //       "cargo_elaborado_por",
  //       this.nuevoCurso.firmas?.elaborado?.cargo?.toString() || ""
  //     );

  // // fileUrl = ''
  //     if (this.selectedFile()) {
  //       // Caso: Hay un nuevo archivo seleccionado
  //       formData.append("archivo_url",  );
  //     } else if (this.archivoUrl()) {
  //       // Caso: No hay archivo nuevo pero hay URL existente (edición sin modificar archivo)
  //       formData.append("archivo_url", this.archivoUrl());
  //     }    // Convertir `objetivos` a JSON y agregarlo a FormData
  //     formData.append("objetivos", JSON.stringify(this.nuevoCurso.objetivos));

  //     // Convertir `contenidoProgramatico` a JSON y agregarlo
  //     formData.append(
  //       "contenidoProgramatico",
  //       JSON.stringify(this.nuevoCurso.contenidoProgramatico)
  //     );



  //     console.log("Contenido de FormData:");

  //     for (const [key, value] of (formData as any).entries()) {
  //       console.log(key, value);
  //     }
  //     // Determinar si es una actualización o una creación
  //     const url = this.selectedCourseId
  //       ? `${this.apiUrl}/cursos/${this.selectedCourseId}`
  //       : `${this.apiUrl}/cursos`;

  //     // ternario que verifica si hay id,deciendo la url depende si lo hay

  //     const request = this.selectedCourseId
  //       ? this.http.put(url, formData)
  //       : this.http.post<Modulo>(url, formData);

  //     request.subscribe({
  //       next: (response) => {
  //         // this.isSaving = false;
  //     this.isSaving.set(false);

  //         if (this.selectedCourseId) {
  //           alert(
  //             `🔹 Curso actualizado correctamente con ID: ${this.selectedCourseId}`
  //           );
  //         } else {
  //           this.modulos.push(response as Modulo);
  //           this.resetNuevoCurso();
  //           this.alertMessage.set("Curso agregado correctamente.");
  //         this.alertTitle.set("Éxito");
  //           this.alertType.set("success");

  //         }
  //       },
  //       error: (err) => {
  //         // this.isSaving = false;
  //             this.isSaving.set(false);

  //         console.error("Error en la operación del curso:", err);
  //         this.alertMessage.set(this.selectedCourseId
  //           ? "Error al actualizar el curso."
  //           : "Error al agregar el curso.");
  //         this.alertTitle.set("Error");
  //         //  this.alertType = "error";
  //         this.alertType.set("error");

  //       },
  //       complete: () => {
  //             this.isSaving.set(false);

  //         // this.isSaving = false;
  //       },
  //     });

  //   }

  // resetNuevoCurso(): void {
  //   this.nuevoCurso = {
  //     id: 0,
  //     nombre: "",
  //     duracion_horas: 0,
  //     descripcion: "",
  //     nivel: "",
  //     clave: "",
  //     area_id: undefined,
  //     especialidad_id: undefined,
  //     tipo_curso_id: undefined,
  //     firmas: {
  //       revisado: { nombre: "", cargo: "Programas de Estudio" },
  //       autorizado: { nombre: "", cargo: "Directora Académica" },
  //       elaborado: { nombre: "", cargo: "Director General" },
  //     },
  //     objetivos: {
  //       objetivo: "",
  //       perfil_ingreso: "",
  //       perfil_egreso: "",
  //       perfil_del_docente: "",
  //       metodologia: "",
  //       bibliografia: "",
  //       criterios_acreditacion: "",
  //       reconocimiento: "",
  //     },
  //     contenidoProgramatico: { temas: [] },
  //     // materiales: [],
  //     // equipamiento: []
  //   };
  // }

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
    });

    const formData = new FormData();

    formData.append("archivo_url", "");
    // this.archivoUrl.set(null); // Solo esto, sin los paréntesis ()
    // Limpiar tanto la URL como el archivo seleccionado
    this.archivoUrl.set(null);
    this.selectedFile.set(null); // Asegurarse de limpiar también el archivo seleccionado
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
  // eliminarTema(index: number): void {
  //   this.nuevoCurso.contenidoProgramatico.temas.splice(index, 1);
  // }
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
  // Método para calcular total de horas
  // calcularTotalHoras(): number {
  //   return this.nuevoCurso.contenidoProgramatico.temas.reduce(
  //     (total, tema) => total + tema.tiempo,
  //     0
  //   );
  // }
  calcularTotalHoras(): number {
    return this.nuevoCurso().contenidoProgramatico.temas.reduce(
      (total, tema) => total + tema.tiempo,
      0
    );
  }

  showModal = false;
  newUnitName = "";
  mostrarFormulario: boolean = false;

  mostrarModalSubirArchivo() {
    console.log("Mostrar modal para subir archivo");
    this.mostrarFormulario = true;
  }

  //*************************FILE */}


  selectedFile = signal<File | null>(null);  // isUploading = false;
  fileExtension: string = "";
  isDragging = signal(false);

  // Evento cuando se selecciona un archivo

  // Subir el archivo
  // uploadFile(file: File): void {
  //   console.log(file);
  // }

  // Eliminar archivo

  removeFile() {
    this.selectedFile.set(null);
  }

  // Obtener la extensión del archivo
  getFileExtension(fileName: string): string {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    return ext;
  }

  // Manejar eventos de arrastre

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.selectedFile.set(file);
      this.fileExtension = this.getFileExtension(file.name);
    }
  }



  onDragLeave(event: DragEvent): void {
    this.isDragging.set(false);
  }

  url: any = "";

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
      this.fileExtension = this.getFileExtension(input.files[0].name);


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

  // ARCHIVOS
  abrirEnNuevaPestana(url: string): void {
    window.open(url, '_blank');
  }
  async descargarArchivo(url: string): Promise<void> {
    try {
      // Solución alternativa para problemas de CORS
      if (url.startsWith('blob:')) {
        // Si es un blob, usamos el método estándar
        const link = document.createElement('a');
        link.href = url;
        link.download = this.obtenerNombreArchivo(url) || 'documento.pdf';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Para URLs remotas, usamos fetch
      const response = await fetch(url, {
        mode: 'cors', // Intenta con CORS
        cache: 'no-cache'
      });

      if (!response.ok) throw new Error('Error al obtener el archivo');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = this.obtenerNombreArchivo(url) || 'documento.pdf';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      // Limpieza
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

    } catch (error) {
      console.error('Error al descargar el archivo:', error);

      // Fallback: abrir en nueva pestaña si la descarga falla
      window.open(url, '_blank');

      // Opcional: mostrar notificación al usuario
      // this.mostrarNotificacion('Error', 'No se pudo descargar el archivo. Se abrirá en una nueva pestaña.', 'error');
    }
  }
  // Cuando se renderiza la miniatura
  onThumbnailRendered(event: any) {
    console.log('Miniatura del PDF renderizada');
  }
  eliminarArchivo() {
    // this
    this.confirmService.showTailwindConfirm(
      '¿Estás seguro de que quieres eliminar este Archivo?',
      'Sí, eliminar',
      'Cancelar',
      'danger'
    ).subscribe(confirmed => {
      if (confirmed) {
        const formData = new FormData();

        formData.append("archivo_url", "");
        // this.archivoUrl.set(null); // Solo esto, sin los paréntesis ()
        // Limpiar tanto la URL como el archivo seleccionado
        this.archivoUrl.set(null);
        this.selectedFile.set(null); // Asegurarse de limpiar también el archivo seleccionado

        this.obtenerNombreArchivo(this.archivoUrl());
        // Lógica cuando el usuario acepta
        console.log('Usuario confirmó la acción');
      } else {
        // Lógica cuando el usuario cancela
        console.log('Usuario canceló la acción');
      }
    });
    console.log('Miniatura del PDF renderizada');
  }

  // En tu componente TypeScript
  uploadProgress = 0;
  isLoadingPreview = false;

  async Aceptar() {
    const file = this.selectedFile();
    if (!file) return;

    try {
      // Mostrar progreso simulado mientras se sube el archivo
      const uploadInterval = setInterval(() => {
        this.uploadProgress = Math.min(this.uploadProgress + 10, 90);
      }, 200);

      // Subir el archivo usando el servicio fileUploadService
      const fileUrl = await this.fileUploadService.uploadTemario(file).toPromise();

      clearInterval(uploadInterval);
      this.uploadProgress = 100;

      // Mostrar vista previa
      this.isLoadingPreview = true;
      this.archivoUrl.set(fileUrl.fileUrl); // Asumiendo que la respuesta es {fileUrl: string}

      // Pequeño delay para que se vea el 100%
      await new Promise(resolve => setTimeout(resolve, 500));

      // Cerrar modal
      this.mostrarFormulario = false;
    } catch (error) {
      this.alertTaiwilService.showTailwindAlert("Error al subir el archivo", 'error');
      // console.error("Error al subir el archivo:", error);
      // Manejar error
      // this.showAlert('error', 'Error al subir archivo', error.message);
    } finally {
      this.isLoadingPreview = false;
      this.uploadProgress = 0;
    }
  }
  obtenerNombreArchivo(url: string): string {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || 'documento.pdf';
    } catch {
      return 'documento.pdf';
    }
  }

}
