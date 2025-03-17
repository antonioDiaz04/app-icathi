 import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment.prod";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this is imported
import { style } from '@angular/animations';

declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
  }
}

@Component({
  selector: "app-pdf-example",
  template: '',
    styleUrls: [], // Sin estilos específicos
})
export class PdfExampleComponent implements OnChanges {
  @Input() generarReportePdfCursoId!: number;
  @Output() cerrarModalEvent = new EventEmitter<boolean>();
  cursoData: any;
  generando = false;

  constructor(private http: HttpClient) {}

  

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica si la propiedad `generarReportePdfCursoId` ha cambiado
    if (changes['generarReportePdfCursoId'] && this.generarReportePdfCursoId) {
      this.cargarDetallesCurso();
      console.log("generarReportePdfCursoId")
    }
  }

  cargarDetallesCurso() {
    const url = `${environment.api}/cursos/reporte/${this.generarReportePdfCursoId}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.cursoData = data;
        this.generarPDF(); // Genera el PDF después de obtener los datos
        console.log("Datos del curso cargados:", this.cursoData);
      },
      (error) => {
        console.error("Error al cargar los detalles del curso:", error);
      }
    );
  }


  generarPDF() {
    this.generando = true;
  
    const doc = new jsPDF();
  
    // Agregar imagen de fondo solo en la primera página
    const imageUrl =
      "https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png";
    doc.addImage(
      imageUrl,
      "PNG",
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height
    );
  
    // Definir el margen superior
    const topMargin = 50;
  
    // Centrar el texto "CURSO DE CAPACITACIÓN"
    doc.setFontSize(16); // Tamaño de fuente más grande para el título
    doc.setFont("helvetica", "bold");
    doc.text("CURSO DE CAPACITACIÓN", doc.internal.pageSize.width / 2, topMargin, {
      align: "center",
    });
  
    // Mostrar el valor de TIPO_CURSO debajo del título
    doc.setFontSize(12); // Tamaño de fuente más pequeño para el subtítulo
    doc.setFont("helvetica", "normal");
    doc.text(
      this.cursoData?.TIPO_CURSO || "No disponible",
      doc.internal.pageSize.width / 2,
      topMargin + 10,
      { align: "center" }
    );
  
    // Resto del contenido (datos generales, firmas, etc.)
    const courseData = {
      titulo: "DATOS GENERALES DEL CURSO",
      datosGenerales: [
        { label: "CLAVE:", value: this.cursoData?.CLAVE || "No disponible" },
        {
          label: "DURACIÓN EN HORAS:",
          value: this.cursoData?.DURACION_HORAS || "No disponible",
        },
        {
          label: "DESCRIPCIÓN:",
          value: this.cursoData?.DESCRIPCION || "No disponible",
        },
        {
          label: "ÁREA ID:",
          value: this.cursoData?.AREA_ID || "No disponible",
        },
        {
          label: "ESPECIALIDAD ID:",
          value: this.cursoData?.ESPECIALIDAD_ID || "No disponible",
        },
      ],
    };
  
    // Mostrar el título "DATOS GENERALES DEL CURSO"
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(courseData.titulo, 30, topMargin + 40);
  
    // Mostrar los datos generales del curso
    courseData.datosGenerales.forEach((data, index) => {
      const text = `${data.label} ${data.value}`;
      const yPosition = topMargin + 60 + index * 15; // Ajustar la posición vertical
      doc.text(text, 30, yPosition);
    });
  
    // Agregar datos de "Vigencia"
    doc.setFontSize(10);
    const vigenciaInicio = this.cursoData?.VIGENCIA_INICIO
      ? new Date(this.cursoData.VIGENCIA_INICIO).toLocaleDateString()
      : "No disponible";
    doc.text(
      "VIGENCIA A PARTIR DE",
      doc.internal.pageSize.width - 60,
      topMargin + 60
    );
    doc.text(vigenciaInicio, doc.internal.pageSize.width - 60, topMargin + 70);
  
    // Datos de "Elaborado por", "Revisado por" y "Autorizado por"
    const fixedPositionData = [
      {
        label: "Elaborado por:",
        value: this.cursoData?.ELABORADO_POR
          ? `${this.cursoData.ELABORADO_POR.nombre} - ${this.cursoData.ELABORADO_POR.cargo}`
          : "No disponible",
        yOffset: topMargin + 120,
      },
      {
        label: "Revisado por:",
        value: this.cursoData?.REVISADO_POR
          ? `${this.cursoData.REVISADO_POR.nombre} - ${this.cursoData.REVISADO_POR.cargo}`
          : "No disponible",
        yOffset: topMargin + 140,
      },
      {
        label: "Autorizado por:",
        value: this.cursoData?.AUTORIZADO_POR
          ? `${this.cursoData.AUTORIZADO_POR.nombre} - ${this.cursoData.AUTORIZADO_POR.cargo}`
          : "No disponible",
        yOffset: topMargin + 160,
      },
    ];
  
    // Mostrar las firmas en el PDF
    fixedPositionData.forEach((data) => {
      doc.text(data.label, doc.internal.pageSize.width - 60, data.yOffset);
      doc.text(data.value, doc.internal.pageSize.width - 60, data.yOffset + 10);
    });
  
    // Mover "Ficha Técnica" a otra página y usar tabla
    doc.addPage();
    doc.setFontSize(16);
    doc.text("FICHA TÉCNICA", 10, 20);
  
    const fichaTecnica = [
      ["Objetivo", this.cursoData?.FICHA_TECNICA?.OBJETIVO || "No disponible"],
      [
        "Perfil de ingreso",
        this.cursoData?.FICHA_TECNICA?.PERFIL_INGRESO || "No disponible",
      ],
      [
        "Perfil de egreso",
        this.cursoData?.FICHA_TECNICA?.PERFIL_EGRESO || "No disponible",
      ],
      [
        "Perfil del docente",
        this.cursoData?.FICHA_TECNICA?.PERFIL_DEL_DOCENTE || "No disponible",
      ],
      [
        "Metodología",
        this.cursoData?.FICHA_TECNICA?.METODOLOGIA || "No disponible",
      ],
      [
        "Bibliografía",
        this.cursoData?.FICHA_TECNICA?.BIBLIOGRAFIA || "No disponible",
      ],
      [
        "Criterios de acreditación",
        this.cursoData?.FICHA_TECNICA?.CRITERIOS_ACREDITACION || "No disponible",
      ],
    ];
  
    doc.autoTable({
      startY: 30,
      body: fichaTecnica,
      theme: "plain",
      bodyStyles: { fontSize: 10 },
      columnStyles: {
        0: {
          halign: "left",
          fillColor: [45, 194, 162],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        1: { halign: "left", fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      },
    });
  
    // Verificar si los materiales existen
    if (this.cursoData?.MATERIALES && this.cursoData.MATERIALES.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("MATERIALES", 10, 20);
  
      const materialsTable = [
        [
          { content: "Descripción", rowSpan: 2 },
          { content: "Unidad de medida", rowSpan: 2 },
          { content: "Cantidad por Número de Participantes", colSpan: 3 },
        ],
        ["Cantidad 10", "Cantidad 15", "Cantidad 20"],
        ...this.cursoData.MATERIALES.map((item:any) => [
          item.material_descripcion,
          item.material_unidad_de_medida,
          item.material_cantidad_10,
          item.material_cantidad_15,
          item.material_cantidad_20,
        ]),
      ];
  
      doc.autoTable({
        startY: 30,
        head: materialsTable.slice(0, 2),
        body: materialsTable.slice(2),
        theme: "grid",
        margin: { top: 20 },
        headStyles: {
          fillColor: [45, 194, 162],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
      });
    }
  
    // Verificar si el equipamiento existe
    if (this.cursoData?.EQUIPAMIENTO && this.cursoData.EQUIPAMIENTO.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("EQUIPAMIENTO", 10, 20);
  
      const equipmentTable = [
        [
          { content: "Descripción", rowSpan: 2 },
          { content: "Unidad de medida", rowSpan: 2 },
          { content: "Cantidad por Número de Participantes", colSpan: 3 },
        ],
        ["Cantidad 10", "Cantidad 15", "Cantidad 20"],
        ...this.cursoData.EQUIPAMIENTO.map((item) => [
          item.equipamiento_descripcion,
          item.equipamiento_unidad_de_medida,
          item.equipamiento_cantidad_10,
          item.equipamiento_cantidad_15,
          item.equipamiento_cantidad_20,
        ]),
      ];
  
      doc.autoTable({
        startY: 30,
        head: equipmentTable.slice(0, 2),
        body: equipmentTable.slice(2),
        theme: "grid",
        margin: { top: 20 },
        headStyles: {
          fillColor: [45, 194, 162],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
      });
    }
  
    // Guardar el PDF
    doc.save("curso.pdf");
  
    this.generando = false;
  }

  cerrarModal() {
    this.cerrarModalEvent.emit(false); // Emitting the event to close the modal
  }
}
