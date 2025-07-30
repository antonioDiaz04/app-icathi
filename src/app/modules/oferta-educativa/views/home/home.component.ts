import { Component } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { environment } from '../../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {
  cursos: any[] = [];
  filteredCursos: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  showOfertaEducativa = false; // Cambia a true para mostrar la sección
  isAddingCourse: boolean = false;
  isEditCourse: boolean = false;
  selectedCourseDetails: any = null;

  mostrarFormularioFlag = false;
  // selectedCourse: any = null;
  selectedCourse: string = "curso1"; // Esto seleccionará "Curso Modalidad CAE" por defecto
  cursoData: any;

  generando = false;


  searchCurso = '';
  searchEspecialidad = '';



  // Variables para los filtros
  filtroId: string = '';
  filtroEstado: string = '';
  filtroArea: string = '';
  filtroEspecialidad: string = '';
  filtroClave: string = '';
  filtroNombre: string = '';
  filtroTipo: string = '';
  filtroHoras: string = '';
  filtroTipoCurso: string = '';

  private apiUrl = `${environment.api}/cursos`;

  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success'; // Tipo de mensaje (éxito o error)
  // Para los detalles del curso
  selectedCursoDetalle: any = null;

  showDetailModal: boolean = false;

  // Propiedades para manejar archivos
  selectedFile: File | any = null;
  fileExtension: string = '';
  url: any = '';
  page: number = 1;
  isLoaded: boolean = false;

  generarReportePdfCursoId!: any;
  // cursoId!:  any;
  // generarReportePdf:boolean= false;

  modalidades = [
    { id: 1, nombre: 'Curso Modalidad CAE', componente: 'curso1' },
    { id: 2, nombre: 'Curso Modalidad Virtual', componente: 'curso2' },
    { id: 3, nombre: 'Curso Modalidad Escuela', componente: 'curso3' },
    { id: 4, nombre: 'Cursos  Modalidad Regular', componente: 'curso4' },
    { id: 5, nombre: 'Cursos Modalidad SEP', componente: 'curso5' }
  ];
  selectedCourseId: number = 0;
  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer,  private route: ActivatedRoute
) { }

  ngOnInit(): void {
    this.cargarCursos();
    this.route.queryParams.subscribe(params => {
      if (params['agregar'] === 'true') {
        this.isAddingCourse =true;
      }else{
          this.isAddingCourse =false;      }
    });
  }


  cancelAddingCourse(): void {
    this.isAddingCourse = false;
  }

  toggleAddingCourse(): void {
    this.isAddingCourse = !this.isAddingCourse;
  }
  verDetalles(curso: any): void {
    console.log('Curso seleccionado:', curso);
    this.isEditCourse = true;
    this.selectedCourseId = curso.id; // Guarda el ID del curso

    // Busca la modalidad correspondiente y extrae solo el componente
    const modalidad = this.modalidades.find(m => m.id === curso.tipo_curso_id);
    this.selectedCourse = modalidad ? modalidad.componente : "";
    // selectedCourseId
    // Verifica los valores en consola y alerta
    alert(`ID del Curso: ${this.selectedCourseId}, Componente: ${this.selectedCourse}`);
    console.log('Selected Component:', this.selectedCourse);
  }
  generarReportePDF(id: number): void {
    console.log("----<", id)
    this.generarReportePdfCursoId = id;
    // this.generarReportePdf = true;
    // alert("abrio ")
  }

  cargarCursos(): void {
    this.http.get<any[]>(`${this.apiUrl}/cursos/detallados`).subscribe({
      next: (data) => {
        this.cursos = data.map((curso) => ({
          id: curso.id,
          activo: curso.estatus,
          area: curso.area_nombre,
          especialidad: curso.especialidad_nombre,
          clave: curso.clave,
          nombre: curso.curso_nombre,
          tipo: curso.tipo_curso_nombre,
          horas: curso.horas,
          detalles: curso.detalles,
          tipo_curso: curso.tipo_curso_nombre,
          tipo_curso_id: curso.tipo_curso_id,
        }));
        this.filteredCursos = [...this.cursos];
        this.totalPages = Math.ceil(this.filteredCursos.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error al cargar los cursos:', err);
        this.mostrarModal('Error al cargar los cursos. Intenta más tarde.', 'error');
      }
    });
  }


  // // Función para filtrar los datos
  // filtrarCursosBy() {


  //   let filtered = this.cursos.filter(curso => {
  //     return (
  //       curso.id.toString().includes(this.filtroId.toLowerCase()) &&
  //       (curso.activo ? 'activo' : 'inactivo').includes(this.filtroEstado.toLowerCase()) &&
  //       curso.area.toLowerCase().includes(this.filtroArea.toLowerCase()) &&
  //       curso.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
  //       curso.clave.toLowerCase().includes(this.filtroClave.toLowerCase()) &&
  //       curso.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) &&
  //       curso.tipo.toLowerCase().includes(this.filtroTipo.toLowerCase()) &&
  //       curso.horas.toString().includes(this.filtroHoras.toLowerCase()) &&
  //       curso.tipo_curso.toLowerCase().includes(this.filtroTipoCurso.toLowerCase())
  //     );
  //   });

  //   this.calcularTotalPaginas(filtered);
  //   return this.paginarDatos(filtered);
  // }



  filtrarCursosBy() {
    let filtered = this.cursos.filter(curso => {
      // Convertir valores null a string vacío para evitar errores
      const area = curso.area ? curso.area.toLowerCase() : '';
      const especialidad = curso.especialidad ? curso.especialidad.toLowerCase() : '';

      return (
        curso.id.toString().includes(this.filtroId.toLowerCase()) &&
        (curso.activo ? 'activo' : 'inactivo').includes(this.filtroEstado.toLowerCase()) &&
        area.includes(this.filtroArea.toLowerCase()) &&
        especialidad.includes(this.filtroEspecialidad.toLowerCase()) &&
        curso.clave.toLowerCase().includes(this.filtroClave.toLowerCase()) &&
        curso.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) &&
        curso.tipo.toLowerCase().includes(this.filtroTipo.toLowerCase()) &&
        curso.horas.toString().includes(this.filtroHoras.toLowerCase()) &&
        curso.tipo_curso.toLowerCase().includes(this.filtroTipoCurso.toLowerCase())
      );
    });

    this.calcularTotalPaginas(filtered);
    return this.paginarDatos(filtered);
  }
  // Función para paginar los datos
  paginarDatos(data: any[]): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return data.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Calcular total de páginas
  calcularTotalPaginas(data?: any[]): void {
    const datos = data || this.cursos;
    this.totalPages = Math.ceil(datos.length / this.itemsPerPage) || 1;

    // Si la página actual es mayor que el total de páginas después de filtrar,
    // volver a la primera página
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  filtrarCursos(): void {
    this.filteredCursos = this.cursos.filter((curso) =>
      curso.nombre.toLowerCase().includes(this.searchCurso.toLowerCase()) &&
      curso.especialidad.toLowerCase().includes(this.searchEspecialidad.toLowerCase())
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredCursos.length / this.itemsPerPage);
  }

  get paginatedCursos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCursos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  toggleEstado(curso: any) {
    const nuevoEstado = !curso.activo;

    this.http.patch(`${this.apiUrl}/${curso.id}/estatus`, { estatus: nuevoEstado }).subscribe({
      next: () => {
        curso.activo = nuevoEstado;
        this.mostrarModal(
          `El curso "${curso.nombre}" se actualizó a ${nuevoEstado ? 'Activo' : 'Inactivo'}.`,
          'success'
        );
      },
      error: (err) => {
        console.error(`Error al actualizar el estado del curso con ID ${curso.id}:`, err);
        this.mostrarModal('Error al actualizar el estado del curso. Intenta más tarde.', 'error');
      }
    });
  }

  mostrarModal(message: string, type: 'success' | 'error') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;

    // Cierra automáticamente el modal después de 3 segundos
    setTimeout(() => {
      this.showModal = false;
    }, 3000);
  }
  // logout(): void {
  //   const request = indexedDB.open('authDB'); // Nombre de la base de datos

  //   request.onsuccess = () => {
  //     const db = request.result;
  //     const transaction = db.transaction('tokens', 'readwrite'); // Nombre de la tabla/almacén
  //     const store = transaction.objectStore('tokens');

  //     // Eliminar el token
  //     const deleteRequest = store.delete('authToken'); // Clave del token

  //     deleteRequest.onsuccess = () => {
  //       console.log('Token eliminado correctamente.');
  //       this.router.navigate(['/']); // Redirige al login
  //     };

  //     deleteRequest.onerror = (error) => {
  //       console.error('Error al eliminar el token:', error);
  //     };
  //   };


  //   request.onerror = (error) => {
  //     console.error('Error al abrir la base de datos:', error);
  //   };
  // }

  verOfertaEducativa(): void {
    this.isAddingCourse = true;
  }

  toggleAddCourse() {
    this.showOfertaEducativa = !this.showOfertaEducativa;
    console.log('Vista activada:', this.showOfertaEducativa);
  }



  regresar(): void {
    this.isAddingCourse = false;
    this.cargarCursos();
      this.router.navigate(['/oferta-educativa/home'], { queryParams: { agregar: false } });

  }
  regresarEdit(): void {
    this.isEditCourse = false;
    this.selectedCourseId = 0;
  }

  verDetalle(cursoId: number): void {
    this.http.get<any>(`${this.apiUrl}/detalles/${cursoId}`).subscribe({
      next: (cursoDetalle) => {
        this.selectedCursoDetalle = cursoDetalle;
        this.showDetailModal = true;
      },
      error: (err) => {
        console.error('Error al obtener los detalles del curso:', err);
        this.mostrarModal('Error al obtener los detalles del curso. Intenta más tarde.', 'error');
      }
    });
  }


  closeCourseDetails() {
    this.selectedCourseDetails = null;
  }

  // cargarDetallesCurso() {
  //   const url = `${environment.api}/cursos/reporte/${this.id}`;
  //   this.http.get(url).subscribe(
  //     (data: any) => {
  //       this.cursoData = data;
  //       console.log("Datos del curso cargados:", this.cursoData);
  //     },
  //     (error) => {
  //       console.error("Error al cargar los detalles del curso:", error);
  //     }
  //   );
  // }
  showCourseDetails(id: number) {
    this.http.get<any>(`${this.apiUrl}/detalles/${id}`).subscribe({
      next: (data) => {
        this.selectedCourseDetails = data;
        this.cursoData = data; // Asigna los datos del curso a this.cursoData
      },
      error: (err) => {
        console.error('Error al cargar los detalles del curso:', err);
        this.mostrarModal('Error al cargar los detalles del curso. Intenta más tarde.', 'error');
      }
    });
  }
  generarPDF() {
    console.log(this.cursoData);  // Verificar los datos del curso

    if (!this.cursoData) {
      console.error('No hay datos del curso disponibles para generar el PDF.');
      return;
    }

    this.generando = true;

    const doc = new jsPDF();

    // Agregar imagen de fondo solo en la primera página
    const imageUrl = "https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png";
    doc.addImage(imageUrl, "PNG", 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

    const courseData = {
      titulo: "DATOS GENERALES DEL CURSO",
      datosGenerales: [
        { label: "CLAVE:", value: this.cursoData.clave || "No disponible" },
        { label: "DURACIÓN EN HORAS:", value: this.cursoData.duracion_horas || "No disponible" },
        { label: "DESCRIPCIÓN:", value: this.cursoData.descripcion || "No disponible" },
        { label: "ÁREA ID:", value: this.cursoData.area_id || "No disponible" },
        { label: "ESPECIALIDAD ID:", value: this.cursoData.especialidad_id || "No disponible" },
      ],
    };

    // Establecer un margen superior de 50 y usar un tamaño de fuente de 10
    const topMargin = 50;
    doc.setFontSize(10); // Establecer el tamaño de la fuente a 10
    // Título principal
    doc.setFont("helvetica", "bold");
    // Mostrar el título con un margen superior de 50, alineado a la izquierda
    doc.text(courseData.titulo, 30, topMargin);

    // Mostrar los datos generales del curso, alineados a la izquierda
    courseData.datosGenerales.forEach((data, index) => {
      const text = `${data.label} ${data.value}`;

      // Aumentar el espacio entre las líneas
      const yPosition = topMargin + 10 + index * 15; // Aumentar la separación en el eje Y (15 unidades de separación)

      doc.text(text, 30, yPosition); // Alineado a la izquierda en el eje X (10)
    });

    // Agregar datos de "Vigencia"
    doc.setFontSize(10);

    // Vigencia
    const vigenciaInicio = this.cursoData.vigencia_inicio
      ? new Date(this.cursoData.vigencia_inicio).toLocaleDateString()
      : "No disponible";
    doc.text("VIGENCIA A PARTIR DE", doc.internal.pageSize.width - 60, topMargin + 20);
    doc.text(vigenciaInicio, doc.internal.pageSize.width - 60, topMargin + 30);

    // Datos de "Elaborado por", "Revisado por" y "Autorizado por"
    const fixedPositionData = [
      { label: "Elaborado por:", value: this.cursoData.elaborado_por || "No disponible", yOffset: topMargin + 80 },
      { label: "Revisado por:", value: this.cursoData.revisado_por || "No disponible", yOffset: topMargin + 100 },
      { label: "Autorizado por:", value: this.cursoData.autorizado_por || "No disponible", yOffset: topMargin + 140 },
    ];

    fixedPositionData.forEach((data) => {
      doc.text(data.label, doc.internal.pageSize.width - 60, data.yOffset);
      doc.text(data.value, doc.internal.pageSize.width - 60, data.yOffset + 10);
    });

    // Mover "Ficha Técnica" a otra página y usar tabla
    doc.addPage();
    doc.setFontSize(16);
    doc.text("FICHA TÉCNICA", 10, 20);

    const fichaTecnica = [
      ["Objetivo", this.cursoData.FICHA_TECNICA?.OBJETIVO || "No disponible"],
      ["Perfil de ingreso", this.cursoData.FICHA_TECNICA?.PERFIL_INGRESO || "No disponible"],
      ["Perfil de egreso", this.cursoData.FICHA_TECNICA?.PERFIL_EGRESO || "No disponible"],
      ["Perfil del docente", this.cursoData.FICHA_TECNICA?.PERFIL_DEL_DOCENTE || "No disponible"],
      ["Metodología", this.cursoData.FICHA_TECNICA?.METODOLOGIA || "No disponible"],
      ["Bibliografía", this.cursoData.FICHA_TECNICA?.BIBLIOGRAFIA || "No disponible"],
      ["Criterios de acreditación", this.cursoData.FICHA_TECNICA?.CRITERIOS_ACREDITACION || "No disponible"],
    ];

    doc.autoTable({
      startY: 30,
      body: fichaTecnica,
      theme: "plain", // Tema simplificado
      bodyStyles: { fontSize: 10 },
      columnStyles: {
        0: { halign: "left", fillColor: [45, 194, 162], textColor: [0, 0, 0], fontStyle: "bold" }, // Primera columna con fondo azul claro y texto negro
        1: { halign: "left", fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Segunda columna sin fondo
      },
    });

    // Verificar si los materiales y equipamiento existen
    if (this.cursoData.material && this.cursoData.material.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("MATERIALES", 10, 20);

      const materialsTable = [
        ["Descripción", "Unidad de medida", "Cantidad 10", "Cantidad 15", "Cantidad 20"], // Headers
        ...this.cursoData.MATERIALES.map((item: any) => [
          item.material_descripcion,
          item.material_unidad_de_medida,
          item.material_cantidad_10,
          item.material_cantidad_15,
          item.material_cantidad_20,
        ]),
      ];

      doc.autoTable({
        startY: 30, // Positioning the table
        head: materialsTable.slice(0, 1), // Table header
        body: materialsTable.slice(1), // Table body
        theme: "grid",
        margin: { top: 20 },
      });
    }

    if (this.cursoData.EQUIPAMIENTO && this.cursoData.EQUIPAMIENTO.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("EQUIPAMIENTO", 10, 20);

      const equipmentTable = [
        ["Descripción", "Unidad de medida", "Cantidad 10", "Cantidad 15", "Cantidad 20"], // Headers
        ...this.cursoData.EQUIPAMIENTO.map((item: any) => [
          item.equipamiento_descripcion,
          item.equipamiento_unidad_de_medida,
          item.equipamiento_cantidad_10,
          item.equipamiento_cantidad_15,
          item.equipamiento_cantidad_20,
        ]),
      ];

      doc.autoTable({
        startY: 30, // Positioning the table
        head: equipmentTable.slice(0, 1), // Table header
        body: equipmentTable.slice(1), // Table body
        theme: "grid",
        margin: { top: 20 },
      });
    }

    // Guardar el PDF
    doc.save("curso.pdf");

    this.generando = false;
  }
  mostrarFormulario(cursoId: number) {
    this.http.get(`${environment.api}/cursos/detalles/${cursoId}`).subscribe((data: any) => {
      this.selectedCourse = data;
      this.mostrarFormularioFlag = true;
    });
  }

  ocultarFormulario() {
    this.mostrarFormularioFlag = false;
    this.selectedCourse = "";
  }

  actualizarCurso(): void {
    if (!this.selectedCourseDetails) {
      console.error('No se ha seleccionado un curso para actualizar.');
      return;
    }
    console.log('Curso seleccionado para actualizar:', this.selectedCourseDetails);
    // Crear un objeto FormData para enviar los datos del curso y el archivo
    const formData = new FormData();

    // Agregar las propiedades del objeto `nuevoCurso` al FormData
    formData.append('nombre', this.selectedCourseDetails.nombre);
    formData.append('duracion_horas', this.selectedCourseDetails.duracion_horas.toString());
    formData.append('descripcion', this.selectedCourseDetails.descripcion);
    formData.append('nivel', this.selectedCourseDetails.nivel);
    formData.append('clave', this.selectedCourseDetails.clave?.toString() || '');
    formData.append('area_id', this.selectedCourseDetails.area_id?.toString() || '');
    formData.append('especialidad_id', this.selectedCourseDetails.especialidad_id?.toString() || '');
    formData.append('tipo_curso_id', this.selectedCourseDetails.tipo_curso_id?.toString() || '');
    formData.append('revisado_por', this.selectedCourseDetails.revisado_por?.toString() || '');
    formData.append('autorizado_por', this.selectedCourseDetails.autorizado_por?.toString() || '');
    formData.append('elaborado_por', this.selectedCourseDetails.elaborado_por?.toString() || '');

    // Si se seleccionó un archivo (por ejemplo, un archivo de temario)
    if (this.selectedFile) {
      formData.append('temario', this.selectedFile, this.selectedFile.name);
    }

    // Convertir `objetivos` a JSON y agregarlo a FormData
    formData.append('objetivos', JSON.stringify(this.selectedCourseDetails.objetivos));

    // Convertir `contenidoProgramatico` a JSON y agregarlo
    formData.append('contenidoProgramatico', JSON.stringify(this.selectedCourseDetails.contenidoProgramatico));

    // Agregar materiales como archivos (si existen)
    formData.append('materiales', JSON.stringify(this.selectedCourseDetails.materiales));

    // Agregar equipamiento como texto
    formData.append('equipamiento', JSON.stringify(this.selectedCourseDetails.equipamiento));

    // Hacer la solicitud POST a la API para actualizar el curso
    this.http.post(`${this.apiUrl}/cursos/${this.selectedCourseDetails.id}`, formData).subscribe({
      next: (response) => {
        console.log('Curso actualizado correctamente:', response);
        alert('Curso actualizado con éxito.');
        this.mostrarModal('Curso actualizado con éxito.', 'success');
        this.cargarCursos(); // Recargar los cursos para reflejar la actualización
        this.ocultarFormulario(); // Ocultar el formulario
      },
      error: (err) => {
        console.error('Error al actualizar el curso:', err);
        alert('Error al actualizar el curso. Intenta más tarde.');
        this.mostrarModal('Error al actualizar el curso. Intenta más tarde.', 'error');
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileExtension = this.getFileExtension(file.name);

      if (this.fileExtension === 'pdf') {
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


  callbackFn(pdf: PDFDocumentProxy): void {
    this.totalPages = pdf.numPages;
    this.isLoaded = true;
    console.log('PDF cargado:', pdf);
  }

  prevTep(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextTep(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  getFileExtension(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ext;
  }

}
