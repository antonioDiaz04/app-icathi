import { Component, ElementRef, ViewChild } from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-pdf-example",
  template: `
    <div class="album py-5" align="center">
      <div class="container" #contenido>
        <h2>Postres</h2>

        <div class="row">
          <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <img
                src="{{ imagen1 }}"
                title="Torta de Chocolate"
                alt="Torta de Chocolate"
              />
              <div class="card-body">
                <p class="card-text">Torta de Chocolate</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <img
                src="{{ imagen2 }}"
                title="Pie de Manzana"
                alt="Pie de Manzana"
              />
              <div class="card-body">
                <p class="card-text">Pie de Manzana</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <img
                src="{{ imagen3 }}"
                title="Arroz con Leche"
                alt="Arroz con Leche"
              />
              <div class="card-body">
                <p class="card-text">Arroz con Leche</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button (click)="generarPDF()" class="btn btn-info">Crear PDF</button>
    </div>
  `,
  styles: [``],
})
export class PdfExampleComponent2 {
  @ViewChild("contenido", { static: false }) contenido!: ElementRef;

  titulo = "Generar PDF con Angular JS 5";
  imagen1 = "https://res.cloudinary.com/dvvhnrvav/image/upload/v1736172507/icathi/ateytwpbwn0aottudqcc.png";
  imagen2 = "https://res.cloudinary.com/dvvhnrvav/image/upload/v1736172507/icathi/ateytwpbwn0aottudqcc.png";
  imagen3 = "https://res.cloudinary.com/dvvhnrvav/image/upload/v1736172507/icathi/ateytwpbwn0aottudqcc.png";

  generarPDF() {
    const pdf = new jsPDF();
    pdf.text("Hola Mundo", 10, 10);
    pdf.save("hola-mundo.pdf");
  }
}
