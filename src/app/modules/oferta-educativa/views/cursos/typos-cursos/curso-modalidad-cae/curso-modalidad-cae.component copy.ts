// import {
//   Component,
//   Input,
//   OnChanges,
//   OnInit,
//   SimpleChanges,
//   signal,
//   WritableSignal,
//   computed,
// } from "@angular/core";
// import { environment } from "../../../../../../../environments/environment.prod";
// import { HttpClient } from "@angular/common/http";
// import { PDFDocumentProxy } from "ng2-pdf-viewer";
// import { DomSanitizer } from "@angular/platform-browser";
// import { toSignal } from '@angular/core/rxjs-interop';
// import { catchError, Observable, of, switchMap } from 'rxjs';
// import { FileUploadService } from "../../../../../../shared/services/file-upload.service";
// import { FileSizePipe } from "../../../../../../shared/pipes/file-size.pipe";
// import { CommonModule } from "@angular/common";

// export interface Modulo {
//   id: number;
//   nombre: string;
//   clave?: string | undefined;
//   duracion_horas: number;
//   descripcion: string;
//   nivel: string;
//   costo?: number | undefined;
//   requisitos?: string | undefined;
//   area_id?: number | undefined;
//   especialidad_id?: number | undefined;
//   tipo_curso_id?: number | undefined;
//   vigencia_inicio?: string | undefined;
//   fecha_publicacion?: string | undefined;
//   ultima_actualizacion?: string | undefined;

//   firmas: {
//     revisado: { nombre: string; cargo: string };
//     autorizado: { nombre: string; cargo: string };
//     elaborado: { nombre: string; cargo: string };
//   };
//   objetivos: {
//     objetivo: string | undefined;
//     perfil_ingreso: string | undefined;
//     perfil_egreso: string | undefined;
//     perfil_del_docente: string | undefined;
//     metodologia: string | undefined;
//     bibliografia: string | undefined;
//     criterios_acreditacion: string | undefined;
//     reconocimiento: string | undefined;
//   };
//   contenidoProgramatico: {
//     temas: Array<{
//       id: number | null;
//       tema_nombre: string;
//       tiempo: number;
//       competencias: string | undefined;
//       evaluacion: string | undefined;
//       actividades: string | undefined;
//     }>;
//   };
//   materiales: Array<{
//     id: number | null;
//     descripcion: string;
//     unidad_de_medida: string | undefined;
//     cantidad10?: number | undefined;
//     cantidad15?: number | undefined;
//     cantidad20?: number | undefined;
//   }>;
//   equipamiento: Array<{
//     id: number | null;
//     descripcion: string;
//     unidad_de_medida: string | undefined;
//     cantidad10?: number | undefined;
//     cantidad15?: number | undefined;
//     cantidad20?: number | undefined;
//   }>;
// }

// export interface UnitOption {
//   value: string;
//   label: string;
// }

// @Component({
//   // selector: "app-curso-modalidad-cae",
//   selector: "app-curso-modalidad-cae",
//   // standalone:true,
//   // imports: [ SafeUrlPipe ], // 👈 ahora sí válido


//   templateUrl: "./curso-modalidad-cae.component.html",
//   styles: `
//   .ui.dimmer {
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     z-index: 1000;
//   }
//   .ui.mini.text.loader {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//   }`
// })
// export class CursoModalidadCAEComponent implements OnInit, OnChanges {
//   @Input() selectedCourseId!: number;

//   // Signals for state management
//   areas = signal<any[]>([]);
//   especialidades = signal<any[]>([]);
//   tiposCurso = signal<any[]>([]);
//   modulos = signal<Modulo[]>([]);
//   archivoUrl = signal<any>(null);
//   isSaving = signal(false);
//   alertMessage = signal<string | null>(null);
//   alertTitle = signal<string | null>(null);
//   alertType = signal<"success" | "error">("success");
//   btnTitle = signal("GUARDAR");

//   // Main course signal
//   nuevoCurso = signal<Modulo>({
//     id: 0,
//     nombre: "",
//     costo: 0,
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
//     vigencia_inicio: undefined,
//     fecha_publicacion: undefined,
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
//     materiales: [],
//     equipamiento: [],
//   });

//   private apiUrl = signal(environment.api);

//   constructor(private sanitizer: DomSanitizer, private http: HttpClient, private fileUploadService: FileUploadService) { }

//   ngOnInit(): void {
//     this.cargarAreas();
//     this.cargarEspecialidades();
//     this.cargarTiposCurso();

//     if (this.selectedCourseId) {
//       this.btnTitle.set("GUARDAR CAMBIOS");
//       console.log(`🔹 Inicializando con ID: ${this.selectedCourseId}`);
//       this.showCourseDetails(this.selectedCourseId);
//     }
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes["selectedCourseId"] && !changes["selectedCourseId"].firstChange) {
//       console.log(`🔹 ID del Curso actualizado: ${this.selectedCourseId}`);
//       this.showCourseDetails(this.selectedCourseId);
//     }
//   }
//   get duracionCalculada(): number {
//     return this.calcularTotalHoras();
//   }
//   cargarAreas() {
//     this.http.get<any[]>(`${this.apiUrl()}/areas`).subscribe({
//       next: (data) => this.areas.set(data),
//       error: (err) => console.error("Error loading areas:", err)
//     });
//   }

//   cargarEspecialidades() {
//     this.http.get<any[]>(`${this.apiUrl()}/especialidades`).subscribe({
//       next: (data) => this.especialidades.set(data),
//       error: (err) => console.error("Error loading especialidades:", err)
//     });
//   }

//   cargarTiposCurso() {
//     this.http.get<any[]>(`${this.apiUrl()}/tiposCurso`).subscribe({
//       next: (data) => this.tiposCurso.set(data),
//       error: (err) => console.error("Error loading tipos curso:", err)
//     });
//   }

//   showCourseDetails(id: number) {
//     this.http.get<any>(`${this.apiUrl()}/cursos/detalles/${id}`).subscribe({
//       next: (data) => {
//         this.archivoUrl.set(data.archivo_url);

//         const updatedCourse: Modulo = {
//           ...this.nuevoCurso(), // Keep default structure
//           ...data, // Override with API data
//           id: Number(data.id),
//           vigencia_inicio: isNaN(new Date(data.vigencia_inicio).getTime())
//             ? ""
//             : new Date(data.vigencia_inicio).toISOString().split("T")[0],
//           fecha_publicacion: isNaN(new Date(data.fecha_publicacion).getTime())
//             ? ""
//             : new Date(data.fecha_publicacion).toISOString().split("T")[0],
//           // duracion_horas: Number(data.duracion_horas),
//           duracion_horas: this.duracionCalculada,
//           costo: data.costo !== undefined ? Number(data.costo) : undefined,
//           area_id: data.area_id !== undefined ? Number(data.area_id) : undefined,
//           especialidad_id: data.especialidad_id !== undefined ? Number(data.especialidad_id) : undefined,
//           tipo_curso_id: data.tipo_curso_id !== undefined ? Number(data.tipo_curso_id) : undefined,
//           objetivos: {
//             ...this.nuevoCurso().objetivos,
//             ...data.fichaTecnica,
//           },
//           contenidoProgramatico: {
//             temas: Array.isArray(data.contenidoProgramatico)
//               ? data.contenidoProgramatico.map((t: any) => ({
//                 id: Number(t.id),
//                 tema_nombre: t.tema_nombre,
//                 tiempo: Number(t.tiempo) || 0,
//                 competencias: t.competencias || undefined,
//                 evaluacion: t.evaluacion || undefined,
//                 actividades: t.actividades || undefined,
//               }))
//               : [],
//           },
//           materiales: Array.isArray(data.materiales)
//             ? data.materiales.map((m: any) => ({
//               id: Number(m.id),
//               descripcion: m.descripcion,
//               unidad_de_medida: m.unidad_de_medida || undefined,
//               cantidad10: m.cantidad_10 !== undefined ? Number(m.cantidad_10) : undefined,
//               cantidad15: m.cantidad_15 !== undefined ? Number(m.cantidad_15) : undefined,
//               cantidad20: m.cantidad_20 !== undefined ? Number(m.cantidad_20) : undefined,
//             }))
//             : [],
//           equipamiento: Array.isArray(data.equipamiento)
//             ? data.equipamiento.map((e: any) => ({
//               id: Number(e.id),
//               descripcion: e.descripcion,
//               unidad_de_medida: e.unidad_de_medida || undefined,
//               cantidad10: e.cantidad_10 !== undefined ? Number(e.cantidad_10) : undefined,
//               cantidad15: e.cantidad_15 !== undefined ? Number(e.cantidad_15) : undefined,
//               cantidad20: e.cantidad_20 !== undefined ? Number(e.cantidad_20) : undefined,
//             }))
//             : [],
//           firmas: {
//             revisado: {
//               nombre: data.firmas.revisado?.nombre || "",
//               cargo: data.firmas.revisado?.cargo || "",
//             },
//             autorizado: {
//               nombre: data.firmas.autorizado?.nombre || "",
//               cargo: data.firmas.autorizado?.cargo || "",
//             },
//             elaborado: {
//               nombre: data.firmas.elaborado?.nombre || "",
//               cargo: data.firmas.elaborado?.cargo || "",
//             },
//           },
//         };

//         this.nuevoCurso.set(updatedCourse);
//         console.log("Curso cargado:", this.nuevoCurso());
//       },
//       error: (err) => {
//         console.error("Error al cargar los detalles del curso:", err);
//         this.alertMessage.set("Error al cargar los detalles del curso. Intenta más tarde.");
//         this.alertTitle.set("Error");
//         this.alertType.set("error");
//       },
//     });
//   }

//   hasCourseId = computed(() => this.selectedCourseId > 0);

//   mostrarModalSubirArchivo() {
//     this.mostrarFormulario = true;
//   }


//   selectedFile = signal<File | null>(null);
//   isFileSelected = computed(() => this.selectedFile() !== null);


//   agregarCurso(): void {
//     this.isSaving.set(true);
//     this.alertMessage.set(null); // Reset previous alert

//     const currentCourse = this.nuevoCurso();
//     const file = this.selectedFile();

//     // Si hay archivo seleccionado, primero subirlo
//     if (file) {
//       this.fileUploadService.uploadTemario(file).pipe(
//         switchMap((response) => {
//           // Una vez subido el archivo, proceder con el resto de los datos
//           const formData = this.prepareFormData(currentCourse, response.fileUrl);
//           return this.sendCourseRequest(formData);
//         })
//       ).subscribe({
//         next: (response) => this.handleSuccess(response),
//         error: (err) => this.handleError(err)
//       });
//     } else {
//       // Si no hay archivo, proceder normalmente
//       const formData = this.prepareFormData(currentCourse);
//       this.sendCourseRequest(formData).subscribe({
//         next: (response) => this.handleSuccess(response),
//         error: (err) => this.handleError(err)
//       });
//     }
//   }

//   // Método auxiliar para preparar el FormData
//   private prepareFormData(currentCourse: any, fileUrl: string = ''): FormData {
//     const formData = new FormData();

//     // Agregar propiedades básicas
//     formData.append("nombre", currentCourse.nombre);
//     formData.append("costo", currentCourse.costo?.toString() || "");
//     formData.append("duracion_horas", currentCourse.duracion_horas.toString());
//     formData.append("descripcion", currentCourse.descripcion);
//     formData.append("nivel", currentCourse.nivel);
//     formData.append("vigencia_inicio", currentCourse.vigencia_inicio?.toString() || "");
//     formData.append("fecha_publicacion", currentCourse.fecha_publicacion?.toString() || "");
//     formData.append("clave", currentCourse.clave?.toString() || "");
//     formData.append("area_id", currentCourse.area_id?.toString() || "");
//     formData.append("especialidad_id", currentCourse.especialidad_id?.toString() || "");
//     formData.append("tipo_curso_id", "1");

//     // Agregar URL del archivo si existe
//     if (fileUrl) {
//       formData.append("archivo_url", fileUrl);
//     }

//     // Firmas
//     formData.append("revisado_por", currentCourse.firmas?.revisado?.nombre?.toString() || "");
//     formData.append("cargo_revisado_por", currentCourse.firmas?.revisado?.cargo?.toString() || "");
//     formData.append("autorizado_por", currentCourse.firmas?.autorizado?.nombre?.toString() || "");
//     formData.append("cargo_autorizado_por", currentCourse.firmas?.autorizado?.cargo?.toString() || "");
//     formData.append("elaborado_por", currentCourse.firmas?.elaborado?.nombre?.toString() || "");
//     formData.append("cargo_elaborado_por", currentCourse.firmas?.elaborado?.cargo?.toString() || "");

//     // Datos JSON
//     formData.append("objetivos", JSON.stringify(currentCourse.objetivos));
//     formData.append("contenidoProgramatico", JSON.stringify(currentCourse.contenidoProgramatico));
//     formData.append("materiales", JSON.stringify(currentCourse.materiales));
//     formData.append("equipamiento", JSON.stringify(currentCourse.equipamiento));

//     // Debug: Mostrar contenido de FormData
//     console.log("Contenido de FormData:");
//     for (const [key, value] of (formData as any).entries()) {
//       console.log(key, value);
//     }

//     return formData;
//   }

//   // Método auxiliar para enviar la solicitud
//   private sendCourseRequest(formData: FormData): Observable<any> {
//     const url = this.selectedCourseId
//       ? `${this.apiUrl()}/cursos/${this.selectedCourseId}`
//       : `${this.apiUrl()}/cursos`;

//     return this.selectedCourseId
//       ? this.http.put(url, formData)
//       : this.http.post<Modulo>(url, formData);
//   }

//   // Manejo de respuesta exitosa
//   private handleSuccess(response: any): void {
//     this.isSaving.set(false);
//     if (this.selectedCourseId) {
//       this.alertMessage.set(`Curso actualizado correctamente con ID: ${this.selectedCourseId}`);
//       this.showCourseDetails(this.selectedCourseId)
//     } else {
//       this.modulos.update(modulos => [...modulos, response as Modulo]);
//       this.resetNuevoCurso();
//       this.alertMessage.set("Curso agregado correctamente.");
//     }
//     this.alertTitle.set("Éxito");
//     this.alertType.set("success");
//   }

//   // Manejo de errores
//   private handleError(err: any): void {
//     this.isSaving.set(false);
//     console.error("Error en la operación del curso:", err);
//     this.alertMessage.set(
//       this.selectedCourseId
//         ? "Error al actualizar el curso"
//         : "Error al agregar el curso"
//     );
//     this.alertTitle.set("Error");
//     this.alertType.set("error");
//   }
//   resetNuevoCurso(): void {
//     this.selectedFile.set(null);
//     this.nuevoCurso.set({
//       id: 0,
//       nombre: "",
//       duracion_horas: 0,
//       descripcion: "",
//       nivel: "",
//       clave: "",
//       area_id: undefined,
//       especialidad_id: undefined,
//       tipo_curso_id: undefined,
//       firmas: {
//         revisado: { nombre: "", cargo: "Programas de Estudio" },
//         autorizado: { nombre: "", cargo: "Directora Académica" },
//         elaborado: { nombre: "", cargo: "Director General" },
//       },
//       objetivos: {
//         objetivo: "",
//         perfil_ingreso: "",
//         perfil_egreso: "",
//         perfil_del_docente: "",
//         metodologia: "",
//         bibliografia: "",
//         criterios_acreditacion: "",
//         reconocimiento: "",
//       },
//       contenidoProgramatico: { temas: [] },
//       materiales: [],
//       equipamiento: [],
//     });
//   }

//   // Métodos para agregar y eliminar temas
//   agregarTema(): void {
//     this.nuevoCurso.update(current => ({
//       ...current,
//       contenidoProgramatico: {
//         temas: [
//           ...current.contenidoProgramatico.temas,
//           {
//             id: null,
//             tema_nombre: "",
//             tiempo: 0,
//             competencias: undefined,
//             evaluacion: undefined,
//             actividades: undefined,
//           }
//         ]
//       }
//     }));
//   }

//   eliminarTema(index: number): void {
//     this.nuevoCurso.update(current => {
//       const newTemas = [...current.contenidoProgramatico.temas];
//       newTemas.splice(index, 1);
//       return {
//         ...current,
//         contenidoProgramatico: {
//           temas: newTemas
//         }
//       };
//     });
//   }

//   // Add this method to handle file selection
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile.set(input.files[0]);
//     }
//   }

//   // Métodos para agregar y eliminar materiales
//   // agregarMaterial(): void {
//   //   this.nuevoCurso().materiales.push({
//   //     id: null,
//   //     descripcion: "",
//   //     unidad_de_medida: undefined,
//   //     cantidad10: undefined,
//   //     cantidad15: undefined,
//   //     cantidad20: undefined,
//   //   });

//   //   // console.log("click agregarMaterial")
//   // }

//   eliminarMaterial(index: number) {
//     const materialesActualizados = [...this.nuevoCurso().materiales];
//     materialesActualizados.splice(index, 1);

//     this.nuevoCurso.set({
//       ...this.nuevoCurso(),
//       materiales: materialesActualizados
//     });
//   }

//   agregarMaterial() {
//     this.nuevoCurso.set({
//       ...this.nuevoCurso(),
//       materiales: [
//         ...this.nuevoCurso().materiales,
//         {
//           id: null,
//           descripcion: '',
//           unidad_de_medida: undefined,
//           cantidad10: undefined,
//           cantidad15: undefined,
//           cantidad20: undefined
//         }
//       ]
//     });
//   }

//   agregarEquipamiento() {
//     this.nuevoCurso.set({
//       ...this.nuevoCurso(),
//       equipamiento: [
//         ...this.nuevoCurso().equipamiento,
//         {
//           id: null,
//           descripcion: '',
//           unidad_de_medida: undefined,
//           cantidad10: undefined,
//           cantidad15: undefined,
//           cantidad20: undefined
//         }
//       ]
//     });
//   }

//   eliminarEquipamiento(index: number): void {
//     this.nuevoCurso().equipamiento.splice(index, 1);
//   }

//   // Método para calcular total de horas
//   calcularTotalHoras(): number {
//     return this.nuevoCurso().contenidoProgramatico.temas.reduce(
//       (total, tema) => total + tema.tiempo,
//       0
//     );
//   }

//   // Equipamiento y opciones de unidad_de_medida

//   unitOptions: UnitOption[] = [
//     { value: "PIEZA", label: "PIEZA" },
//     { value: "OTRO", label: "OTRO" },
//     { value: "SERVICIO", label: "SERVICIO" },
//   ];

//   showModal = false;
//   newUnitName = "";

//   mostrarFormulario: boolean = false;

//   //*************************FILE */}

//   fileExtension: string = "";
//   isDragging = signal(false);

//   removeFile() {
//     this.selectedFile.set(null);
//   }
//   // Obtener la extensión del archivo
//   getFileExtension(fileName: string): string {
//     const ext = fileName.split(".").pop()?.toLowerCase() || "";
//     return ext;
//   }

//   onDragOver(event: DragEvent) {
//     event.preventDefault();
//     this.isDragging.set(true);
//   }

//   onDrop(event: DragEvent) {
//     event.preventDefault();
//     this.isDragging.set(false);

//     if (event.dataTransfer?.files.length) {
//       const file = event.dataTransfer.files[0];
//       this.selectedFile.set(file);
//       this.fileExtension = this.getFileExtension(file.name);
//     }
//   }


//   onDragLeave(event: DragEvent): void {
//     this.isDragging.set(false);
//   }

//   url: any = "";

//   onFileSelect(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files?.length) {
//       this.selectedFile.set(input.files[0]);
//       this.fileExtension = this.getFileExtension(input.files[0].name);


//     }
//   }

// isImageFile(): boolean {
//   return ['jpg', 'jpeg', 'png', 'webp'].includes(this.fileExtension);
// }

//   page: number = 1;
//   totalPages!: number;
//   isLoaded: boolean = false;

//   callbackFn(pdf: PDFDocumentProxy) {
//     this.totalPages = pdf.numPages;
//     this.isLoaded = true;
//   }

//   nextTep() {
//     this.page++;
//   }
//   Aceptar() {
//     this.mostrarFormulario=false;
//   }
//   prevTep() {
//     this.page--;
//   }





//   // PDF VISUALIZADOR]
//   vistaExpandida = false;
  
//   // Método para expandir la vista a pantalla completa
//   expandirVista() {
//     this.vistaExpandida = true;
//   }
  
//   // Cerrar vista expandida
//   cerrarVistaExpandida() {
//     this.vistaExpandida = false;
//   }
  
//   obtenerNombreArchivo(url: string): string {
//   if (!url) return '';
//   try {
//     const urlObj = new URL(url);
//     const pathname = urlObj.pathname;
//     return pathname.split('/').pop() || 'documento.pdf';
//   } catch {
//     return 'documento.pdf';
//   }
// }



// // Función para abrir en nueva pestaña
// abrirEnNuevaPestana(url: string): void {
//   window.open(url, '_blank');
// }
// // Función para descargar el archivo mejorada
// async descargarArchivo(url: string): Promise<void> {
//   try {
//     // Solución alternativa para problemas de CORS
//     if (url.startsWith('blob:')) {
//       // Si es un blob, usamos el método estándar
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = this.obtenerNombreArchivo(url) || 'documento.pdf';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       return;
//     }

//     // Para URLs remotas, usamos fetch
//     const response = await fetch(url, {
//       mode: 'cors', // Intenta con CORS
//       cache: 'no-cache'
//     });
    
//     if (!response.ok) throw new Error('Error al obtener el archivo');
    
//     const blob = await response.blob();
//     const blobUrl = window.URL.createObjectURL(blob);
    
//     const link = document.createElement('a');
//     link.href = blobUrl;
//     link.download = this.obtenerNombreArchivo(url) || 'documento.pdf';
//     link.style.display = 'none';
    
//     document.body.appendChild(link);
//     link.click();
    
//     // Limpieza
//     setTimeout(() => {
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     }, 100);
    
//   } catch (error) {
//     console.error('Error al descargar el archivo:', error);
    
//     // Fallback: abrir en nueva pestaña si la descarga falla
//     window.open(url, '_blank');
    
//     // Opcional: mostrar notificación al usuario
//     // this.mostrarNotificacion('Error', 'No se pudo descargar el archivo. Se abrirá en una nueva pestaña.', 'error');
//   }
// }
//   // Cuando se renderiza la miniatura
//   onThumbnailRendered(event: any) {
//     console.log('Miniatura del PDF renderizada');
//   }
// }
