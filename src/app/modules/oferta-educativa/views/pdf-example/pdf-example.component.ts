import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment.prod";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this is imported

declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
  }
}

@Component({
  selector: "app-pdf-example",
  templateUrl: "pdf-example.component.html",
  styleUrls: ["style.scss"],
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

//   generarPDF() {
//     this.generando = true;

//     const doc = new jsPDF();

//     // Agregar imagen de fondo solo en la primera página
//     const imageUrl =
//       "https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png";
//     doc.addImage(
//       imageUrl,
//       "PNG",
//       0,
//       0,
//       doc.internal.pageSize.width,
//       doc.internal.pageSize.height
//     );

//     const courseData = {
//       titulo: "DATOS GENERALES DEL CURSO",
//       datosGenerales: [
//         { label: "CLAVE:", value: this.cursoData?.CLAVE || "No disponible" },
//         {
//           label: "DURACIÓN EN HORAS:",
//           value: this.cursoData?.DURACION_HORAS || "No disponible",
//         },
//         {
//           label: "DESCRIPCIÓN:",
//           value: this.cursoData?.DESCRIPCION || "No disponible",
//         },
//         {
//           label: "ÁREA ID:",
//           value: this.cursoData?.AREA_ID || "No disponible",
//         },
//         {
//           label: "ESPECIALIDAD ID:",
//           value: this.cursoData?.ESPECIALIDAD_ID || "No disponible",
//         },
//       ],
//     };

//     // Establecer un margen superior de 50 y usar un tamaño de fuente de 10
//     const topMargin = 50;
//     doc.setFontSize(10); // Establecer el tamaño de la fuente a 10
// // Título principal
// doc.setFont("helvetica", "bold");
//     // Mostrar el título con un margen superior de 50, alineado a la izquierda
//     doc.text(courseData.titulo, 30, topMargin);

//     // Mostrar los datos generales del curso, alineados a la izquierda
//     courseData.datosGenerales.forEach((data, index) => {
//       const text = `${data.label} ${data.value}`;

//       // Aumentar el espacio entre las líneas
//       const yPosition = topMargin + 10 + index * 15; // Aumentar la separación en el eje Y (15 unidades de separación)

//       doc.text(text, 30, yPosition); // Alineado a la izquierda en el eje X (10)
//     });








    
//     // Agregar datos de "Vigencia"
//     doc.setFontSize(10);

//     // Vigencia
//     const vigenciaInicio = this.cursoData?.VIGENCIA_INICIO
//       ? new Date(this.cursoData.VIGENCIA_INICIO).toLocaleDateString()
//       : "No disponible";
//     doc.text(
//       "VIGENCIA A PARTIR DE",
//       doc.internal.pageSize.width - 60,
//       topMargin + 20
//     );
//     doc.text(vigenciaInicio, doc.internal.pageSize.width - 60, topMargin + 30);

//     // Datos de "Elaborado por", "Revisado por" y "Autorizado por"
//     const fixedPositionData = [
//       {
//         label: "Elaborado por:",
//         value: this.cursoData?.ELABORADO_POR || "No disponible",
//         yOffset: topMargin + 80,
//       },
//       {
//         label: "Revisado por:",
//         value: this.cursoData?.REVISADO_POR || "No disponible",
//         yOffset: topMargin + 100,
//       },
//       {
//         label: "Autorizado por:",
//         value: this.cursoData?.AUTORIZADO_POR || "No disponible",
//         yOffset: topMargin + 140,
//       },
//     ];

//     fixedPositionData.forEach((data) => {
//       doc.text(data.label, doc.internal.pageSize.width - 60, data.yOffset);
//       doc.text(data.value, doc.internal.pageSize.width - 60, data.yOffset + 10);
//     });

//     // Mover "Ficha Técnica" a otra página y usar tabla
//     doc.addPage();
//     doc.setFontSize(16);
//     doc.text("FICHA TÉCNICA", 10, 20);

//     const fichaTecnica = [
//       ["Objetivo", this.cursoData?.FICHA_TECNICA?.OBJETIVO || "No disponible"],
//       [
//         "Perfil de ingreso",
//         this.cursoData?.FICHA_TECNICA?.PERFIL_INGRESO || "No disponible",
//       ],
//       [
//         "Perfil de egreso",
//         this.cursoData?.FICHA_TECNICA?.PERFIL_EGRESO || "No disponible",
//       ],
//       [
//         "Perfil del docente",
//         this.cursoData?.FICHA_TECNICA?.PERFIL_DEL_DOCENTE || "No disponible",
//       ],
//       [
//         "Metodología",
//         this.cursoData?.FICHA_TECNICA?.METODOLOGIA || "No disponible",
//       ],
//       [
//         "Bibliografía",
//         this.cursoData?.FICHA_TECNICA?.BIBLIOGRAFIA || "No disponible",
//       ],
//       [
//         "Criterios de acreditación",
//         this.cursoData?.FICHA_TECNICA?.CRITERIOS_ACREDITACION ||
//           "No disponible",
//       ],
//     ];

//     doc.autoTable({
//       startY: 30,
//       body: fichaTecnica,
//       theme: "plain", // Tema simplificado
//       bodyStyles: { fontSize: 10 },
//       columnStyles: {
//         0: {
//           halign: "left",
//           fillColor: [45, 194, 162],
//           textColor: [0, 0, 0],
//           fontStyle: "bold",
//         }, // Primera columna con fondo azul claro y texto negro
//         1: { halign: "left", fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Segunda columna sin fondo
//       },
//     });

//     // Agregar materiales en tabla
//     doc.addPage();
//     doc.setFontSize(16);
//     doc.text("MATERIALES", 10, 20);

//     const materials = this.cursoData?.MATERIALES || [];
//     const materialsTable = [
//       [
//         "Descripción",
//         "Unidad de medida",
//         "Cantidad 10",
//         "Cantidad 15",
//         "Cantidad 20",
//       ], // Headers
//       ...materials.map((item: any) => [
//         item.material_descripcion,
//         item.material_unidad_de_medida,
//         item.material_cantidad_10,
//         item.material_cantidad_15,
//         item.material_cantidad_20,
//       ]),
//     ];

//     doc.autoTable({
//       startY: 30, // Positioning the table
//       head: materialsTable.slice(0, 1), // Table header
//       body: materialsTable.slice(1), // Table body
//       theme: "grid",
//       margin: { top: 20 },
//     });

//     // Agregar equipamiento en tabla
//     doc.addPage();
//     doc.setFontSize(16);
//     doc.text("EQUIPAMIENTO", 10, 20);

//     const equipment = this.cursoData?.EQUIPAMIENTO || [];
//     const equipmentTable = [
//       [
//         "Descripción",
//         "Unidad de medida",
//         "Cantidad 10",
//         "Cantidad 15",
//         "Cantidad 20",
//       ], // Headers
//       ...equipment.map((item: any) => [
//         item.equipamiento_descripcion,
//         item.equipamiento_unidad_de_medida,
//         item.equipamiento_cantidad_10,
//         item.equipamiento_cantidad_15,
//         item.equipamiento_cantidad_20,
//       ]),
//     ];

//     doc.autoTable({
//       startY: 30, // Positioning the table
//       head: equipmentTable.slice(0, 1), // Table header
//       body: equipmentTable.slice(1), // Table body
//       theme: "grid",
//       margin: { top: 20 },
//     });

//     // Guardar el PDF
//     doc.save("curso.pdf");

//     this.generando = false;
//   }
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
  const vigenciaInicio = this.cursoData?.VIGENCIA_INICIO
    ? new Date(this.cursoData.VIGENCIA_INICIO).toLocaleDateString()
    : "No disponible";
  doc.text(
    "VIGENCIA A PARTIR DE",
    doc.internal.pageSize.width - 60,
    topMargin + 20
  );
  doc.text(vigenciaInicio, doc.internal.pageSize.width - 60, topMargin + 30);

  // Datos de "Elaborado por", "Revisado por" y "Autorizado por"
  const fixedPositionData = [
    {
      label: "Elaborado por:",
      value: this.cursoData?.ELABORADO_POR || "No disponible",
      yOffset: topMargin + 80,
    },
    {
      label: "Revisado por:",
      value: this.cursoData?.REVISADO_POR || "No disponible",
      yOffset: topMargin + 100,
    },
    {
      label: "Autorizado por:",
      value: this.cursoData?.AUTORIZADO_POR || "No disponible",
      yOffset: topMargin + 140,
    },
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
      this.cursoData?.FICHA_TECNICA?.CRITERIOS_ACREDITACION ||
        "No disponible",
    ],
  ];

  doc.autoTable({
    startY: 30,
    body: fichaTecnica,
    theme: "plain", // Tema simplificado
    bodyStyles: { fontSize: 10 },
    columnStyles: {
      0: {
        halign: "left",
        fillColor: [45, 194, 162],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      }, // Primera columna con fondo azul claro y texto negro
      1: { halign: "left", fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Segunda columna sin fondo
    },
  });

  // Verificar si los materiales y equipamiento existen
  if (this.cursoData?.MATERIALES && this.cursoData.MATERIALES.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text("MATERIALES", 10, 20);

    const materialsTable = [
      [
        "Descripción",
        "Unidad de medida",
        "Cantidad 10",
        "Cantidad 15",
        "Cantidad 20",
      ], // Headers
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

  if (this.cursoData?.EQUIPAMIENTO && this.cursoData.EQUIPAMIENTO.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text("EQUIPAMIENTO", 10, 20);

    const equipmentTable = [
      [
        "Descripción",
        "Unidad de medida",
        "Cantidad 10",
        "Cantidad 15",
        "Cantidad 20",
      ], // Headers
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

  cerrarModal() {
    this.cerrarModalEvent.emit(false); // Emitting the event to close the modal
  }
}
