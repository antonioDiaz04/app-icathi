import { Component, ElementRef, ViewChild } from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-pdf-example",
  templateUrl:'pdf-example.component.html',
  // template: `
  //   <div class="album py-5" align="center">
  //     <div class="container" #contenido>
  //       <!DOCTYPE html>
  //       <html>
  //         <head>
  //           <meta charset="UTF-8">
  //           <title>Curso de Capacitación</title>
  //           <style>
  //             body {
  //               font-family: Arial, sans-serif;
  //               margin: 0;
  //               padding: 0;
  //             }
              
  //             .container {
  //               max-width: 800px;
  //               margin: 0 auto;
  //               padding: 50px 20px;
  //             }
              
  //             .header, .footer {
  //               background-image: url('https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png');
  //               background-size: cover;
  //               background-position: center;
  //               padding: 20px;
  //               text-align: center;
  //               color: white;
  //             }
              
  //             .content {
  //               background-color: transparent;
  //               padding: 20px;
  //               text-align: center;
  //             }
              
  //             .note, .author, .reviewer, .approver {
  //               font-style: italic;
  //               text-align: center;
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="container">
  //             <div class="content">
  //               <div class="grid grid-cols-2 gap-4">
  //                 <div>
  //                   <h3>ÁREA OCUPACIONAL:</h3>
  //                   <p>COMPETENCIAS DOCENTES</p>
  //                 </div>
  //                 <div>
  //                   <h3>ESPECIALIDAD:</h3>
  //                   <p>DOCENCIA Y CAPACITACIÓN</p>
  //                 </div>
  //                 <div>
  //                   <h3>CURSO:</h3>
  //                   <p>"PROPICIAR EL APRENDIZAJE SIGNIFICATIVO EN EDUCACIÓN MEDIA SUPERIOR Y SUPERIOR, ALINEADO AL ESTÁNDAR EC0647"</p>
  //                 </div>
  //                 <div>
  //                   <h3>CLAVE DEL CURSO:</h3>
  //                   <p>CV-CDP-003</p>
  //                 </div>
  //                 <div>
  //                   <h3>DURACIÓN:</h3>
  //                   <p>40 HORAS</p>
  //                 </div>
  //               </div>
  //               <div class="mt-6">
  //                 <h3>NOTA:</h3>
  //                 <p class="note">Estas son nuestras autoridades vigentes, pero sería oportuno que se puedan editar los nombres y puestos.</p>
  //               </div>
  //             </div>
  //             <div class="flex justify-center mt-4">
  //               <div class="flex items-center space-x-2">
  //                 <p>Elaborado por:</p>
  //                 <p class="author">Ing. Sergio Felipe Acosta Salinas</p>
  //               </div>
  //             </div>
  //             <div class="flex justify-center">
  //               <div class="flex items-center space-x-2">
  //                 <p>Revisado por:</p>
  //                 <p class="reviewer">MDO Roxana García Suárez</p>
  //               </div>
  //             </div>
  //             <div class="flex justify-center">
  //               <div class="flex items-center space-x-2">
  //                 <p>Autorizado por:</p>
  //                 <p class="approver">Mtro. Jorge Israel Acosta Benítez</p>
  //               </div>
  //             </div>
  //           </div>
            
  //           <div class="footer">
  //             <p>CURSO DE CAPACITACIÓN</p>
  //             <p>"MODALIDAD DE EDUCACIÓN VIRTUAL"</p>
  //           </div>
  //         </body>
  //       </html>
  //     </div>

  //     <button (click)="generarPDF()" [class.loading]="generando" class="ui primary button">
  //       <i class="spinner loading icon" *ngIf="generando"></i>
  //       Crear PDF
  //     </button>
  //   </div>
  // `,
  styleUrls:['style.scss'],
})
export class PdfExampleComponent {
  @ViewChild("contenido", { static: false }) contenido!: ElementRef;
  generando = false;

  // generarPDF() {
  //   this.generando = true;
  //   html2canvas(this.contenido.nativeElement).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();

  //     // Agregar la imagen de fondo al PDF
  //     pdf.addImage(
  //       'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png',
  //       'PNG',
  //       0,
  //       0,
  //       pdf.internal.pageSize.getWidth(),
  //       pdf.internal.pageSize.getHeight()
  //     );

  //     // Agregar el contenido del curso al PDF
  //     pdf.addImage(imgData, 'PNG', 10, 10, 190, (canvas.height * 190) / canvas.width);

  //     // Guardar el PDF
  //     pdf.save('curso-capacitacion.pdf');
  //     this.generando = false;
  //   });
  // }
  generarPDF() {
    this.generando = true; // Indicar que se está generando el PDF
  
    // Capturar el contenido del elemento referenciado
    html2canvas(this.contenido.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // Convertir el contenido a imagen
      const pdf = new jsPDF();
  
      // Agregar la imagen de fondo solo a la primera página
      pdf.addImage(
        'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png',
        'PNG',
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
      );
  
      // Agregar el contenido del curso al PDF
      const imgWidth = 190; // Ancho de la imagen del contenido
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcular la altura para mantener la proporción
      const xOffset = 10; // Desplazamiento en X
      const yOffset = 50; // Desplazamiento en Y
  
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
  
      // Agregar páginas adicionales si el contenido excede una página
      if (canvas.height > pdf.internal.pageSize.getHeight() - 50) {
        const pagesCount = Math.ceil((canvas.height - 50) / (pdf.internal.pageSize.getHeight() - 50));
        for (let i = 1; i < pagesCount; i++) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', xOffset, 0, imgWidth, imgHeight);
        }
      }
  
      // Guardar el PDF con un nombre específico
      pdf.save('curso-capacitacion.pdf');
  
      this.generando = false; // Indicar que ha terminado la generación del PDF
    }).catch((error) => {
      console.error("Error al generar el PDF:", error);
      this.generando = false; // Asegurarse de resetear el estado en caso de error
    });
  }
  
}  
