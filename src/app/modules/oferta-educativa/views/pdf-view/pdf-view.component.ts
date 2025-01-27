import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styles: ``
})
export class PdfViewComponent {
     //*************************FILE */}
     selectedFile: File | any = null;
     // isUploading = false;
     fileExtension: string = '';
   
     // Evento cuando se selecciona un archivo
   
   
constructor(private sanitizer: DomSanitizer) {}
     // Eliminar archivo
     removeFile(): void {
       this.url=''
       this.selectedFile = null;
       this.fileExtension = '';
     }
   
     // Obtener la extensión del archivo
     getFileExtension(fileName: string): string {
       const ext = fileName.split('.').pop()?.toLowerCase() || '';
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
     url:any = '';
   
     onFileSelect(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Sanitize the URL
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(file)
          );
        };
        reader.readAsDataURL(file);
      }
    }
   
   
   
     page:number=1;
     totalPages!:number;
     isLoaded:boolean=false;
   
   
     callbackFn(pdf:PDFDocumentProxy){
       this.totalPages=pdf.numPages;
       this.isLoaded=true;
     }
   
     nextTep(){
       this.page++;
     }
     prevTep(){
       this.page--;
     }
   

}
