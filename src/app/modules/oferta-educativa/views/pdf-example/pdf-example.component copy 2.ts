import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../../environments/environment.prod";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure this is imported

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}

@Component({
  selector: "app-pdf-example",
  templateUrl: 'pdf-example.component.html',
  styleUrls: ['style.scss'],
})
export class PdfExampleComponent implements OnInit {
  @Input() id!: number;
  @Output() cerrarModalEvent = new EventEmitter<boolean>();
  cursoData: any;
  generando = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.id) {
      this.cargarDetallesCurso();
    }
  }

  cargarDetallesCurso() {
    const url = `${environment.api}/cursos/reporte/${this.id}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.cursoData = data;
        console.log("Datos del curso cargados:", this.cursoData);
      },
      (error) => {
        console.error("Error al cargar los detalles del curso:", error);
      }
    );
  }


  // generarPDF() {
  //   this.generando = true;
  
  //   const doc = new jsPDF();
  
  //   // Agregar imagen de fondo solo en la primera página
  //   const imageUrl = 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png';
  //   doc.addImage(imageUrl, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
  
  //   // Agregar primeros datos en la primera página
  //   doc.setFontSize(16);
  //   doc.text('DATOS GENERALES DEL CURSO', 10, 20);
    
  //   // Mostrar los primeros datos
  //   doc.setFontSize(12);
  //   doc.text(`CLAVE: ${this.cursoData?.CLAVE || 'No disponible'}`, 10, 30);
  //   doc.text(`DURACIÓN EN HORAS: ${this.cursoData?.DURACION_HORAS || 'No disponible'}`, 10, 40);
  //   doc.text(`DESCRIPCIÓN: ${this.cursoData?.DESCRIPCION || 'No disponible'}`, 10, 50);
  //   doc.text(`ÁREA ID: ${this.cursoData?.AREA_ID || 'No disponible'}`, 10, 60);
  //   doc.text(`ESPECIALIDAD ID: ${this.cursoData?.ESPECIALIDAD_ID || 'No disponible'}`, 10, 70);
    
  //   // Ficha Técnica
  //   doc.text('FICHA TÉCNICA', 10, 80);
  //   doc.setFontSize(10);
  //   doc.text(`OBJETIVO: ${this.cursoData?.FICHA_TECNICA?.OBJETIVO || 'No disponible'}`, 10, 90);
  //   doc.text(`PERFIL DE INGRESO: ${this.cursoData?.FICHA_TECNICA?.PERFIL_INGRESO || 'No disponible'}`, 10, 100);
  //   doc.text(`PERFIL DE EGRESO: ${this.cursoData?.FICHA_TECNICA?.PERFIL_EGRESO || 'No disponible'}`, 10, 110);
  //   doc.text(`PERFIL DEL DOCENTE: ${this.cursoData?.FICHA_TECNICA?.PERFIL_DEL_DOCENTE || 'No disponible'}`, 10, 120);
  //   doc.text(`METODOLOGÍA: ${this.cursoData?.FICHA_TECNICA?.METODOLOGIA || 'No disponible'}`, 10, 130);
  //   doc.text(`BIBLIOGRAFÍA: ${this.cursoData?.FICHA_TECNICA?.BIBLIOGRAFIA || 'No disponible'}`, 10, 140);
  //   doc.text(`CRITERIOS DE ACREDITACIÓN: ${this.cursoData?.FICHA_TECNICA?.CRITERIOS_ACREDITACION || 'No disponible'}`, 10, 150);
  
  //   // Agregar materiales en tabla en una nueva página
  //   doc.addPage();
  //   doc.setFontSize(16);
  //   doc.text('MATERIALES', 10, 20);
  
  //   const materials = this.cursoData?.MATERIALES || [];
  //   const materialsTable = [
  //     ['Descripción', 'Unidad de medida', 'Cantidad 10', 'Cantidad 15', 'Cantidad 20'], // Headers
  //     ...materials.map((item: any) => [
  //       item.material_descripcion,
  //       item.material_unidad_de_medida,
  //       item.material_cantidad_10,
  //       item.material_cantidad_15,
  //       item.material_cantidad_20
  //     ])
  //   ];
  
  //   // Definir los colores para el encabezado de la tabla
  //   const headerStyles = { fillColor: [34, 45, 50], textColor: [255, 255, 255] };
  //   const bodyStyles = { fillColor: [240, 240, 240] };
  
  //   doc.autoTable({
  //     startY: 30, // Positioning the table
  //     head: materialsTable.slice(0, 1), // Table header
  //     body: materialsTable.slice(1), // Table body
  //     theme: 'grid',
  //     headStyles: headerStyles,
  //     bodyStyles: bodyStyles,
  //     margin: { top: 20 },
  //   });
  
  //   // Agregar equipamiento en tabla en una nueva página
  //   doc.addPage();
  //   doc.setFontSize(16);
  //   doc.text('EQUIPAMIENTO', 10, 20);
  
  //   const equipment = this.cursoData?.EQUIPAMIENTO || [];
  //   const equipmentTable = [
  //     ['Descripción', 'Unidad de medida', 'Cantidad 10', 'Cantidad 15', 'Cantidad 20'], // Headers
  //     ...equipment.map((item: any) => [
  //       item.equipamiento_descripcion,
  //       item.equipamiento_unidad_de_medida,
  //       item.equipamiento_cantidad_10,
  //       item.equipamiento_cantidad_15,
  //       item.equipamiento_cantidad_20
  //     ])
  //   ];
  
  //   doc.autoTable({
  //     startY: 30, // Positioning the table
  //     head: equipmentTable.slice(0, 1), // Table header
  //     body: equipmentTable.slice(1), // Table body
  //     theme: 'grid',
  //     headStyles: headerStyles,
  //     bodyStyles: bodyStyles,
  //     margin: { top: 20 },
  //   });
  
  //   // Guardar el PDF
  //   doc.save('curso.pdf');
  
  //   this.generando = false;
  // }
  



  generarPDF() {
    this.generando = true;

    const doc = new jsPDF();

    // Agregar imagen de fondo solo en la primera página
    const imageUrl = 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png';
    doc.addImage(imageUrl, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);


    






    // Ficha Técnica
    doc.setFontSize(16);
    doc.text('FICHA TÉCNICA', 10, 20);
    doc.setFontSize(12);
    doc.text(`OBJETIVO: ${this.cursoData?.FICHA_TECNICA?.OBJETIVO || 'No disponible'}`, 10, 30);
    doc.text(`PERFIL DE INGRESO: ${this.cursoData?.FICHA_TECNICA?.PERFIL_INGRESO || 'No disponible'}`, 10, 40);
    doc.text(`PERFIL DE EGRESO: ${this.cursoData?.FICHA_TECNICA?.PERFIL_EGRESO || 'No disponible'}`, 10, 50);
    doc.text(`PERFIL DEL DOCENTE: ${this.cursoData?.FICHA_TECNICA?.PERFIL_DEL_DOCENTE || 'No disponible'}`, 10, 60);
    doc.text(`METODOLOGÍA: ${this.cursoData?.FICHA_TECNICA?.METODOLOGIA || 'No disponible'}`, 10, 70);
    doc.text(`BIBLIOGRAFÍA: ${this.cursoData?.FICHA_TECNICA?.BIBLIOGRAFIA || 'No disponible'}`, 10, 80);
    doc.text(`CRITERIOS DE ACREDITACIÓN: ${this.cursoData?.FICHA_TECNICA?.CRITERIOS_ACREDITACION || 'No disponible'}`, 10, 90);

    // Agregar materiales en tabla
    doc.addPage();
    doc.setFontSize(16);
    doc.text('MATERIALES', 10, 20);

    const materials = this.cursoData?.MATERIALES || [];
    const materialsTable = [
      ['Descripción', 'Unidad de medida', 'Cantidad 10', 'Cantidad 15', 'Cantidad 20'], // Headers
      ...materials.map((item: any) => [
        item.material_descripcion,
        item.material_unidad_de_medida,
        item.material_cantidad_10,
        item.material_cantidad_15,
        item.material_cantidad_20
      ])
    ];

    doc.autoTable({
      startY: 30, // Positioning the table
      head: materialsTable.slice(0, 1), // Table header
      body: materialsTable.slice(1), // Table body
      theme: 'grid',
      margin: { top: 20 },
    });

    // Agregar equipamiento en tabla
    doc.addPage();
    doc.setFontSize(16);
    doc.text('EQUIPAMIENTO', 10, 20);

    const equipment = this.cursoData?.EQUIPAMIENTO || [];
    const equipmentTable = [
      ['Descripción', 'Unidad de medida', 'Cantidad 10', 'Cantidad 15', 'Cantidad 20'], // Headers
      ...equipment.map((item: any) => [
        item.equipamiento_descripcion,
        item.equipamiento_unidad_de_medida,
        item.equipamiento_cantidad_10,
        item.equipamiento_cantidad_15,
        item.equipamiento_cantidad_20
      ])
    ];

    doc.autoTable({
      startY: 30, // Positioning the table
      head: equipmentTable.slice(0, 1), // Table header
      body: equipmentTable.slice(1), // Table body
      theme: 'grid',
      margin: { top: 20 },
    });

    // Guardar el PDF
    doc.save('curso.pdf');

    this.generando = false;
  }
  cerrarModal() {
    this.cerrarModalEvent.emit(false); // Emitting the event to close the modal
  }
  
}
