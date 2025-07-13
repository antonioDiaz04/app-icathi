import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment.prod';
import { Router } from '@angular/router';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this is imported

import { PDFDocumentProxy } from 'ng2-pdf-viewer';

import { DomSanitizer } from '@angular/platform-browser'; // Import DomSanitizer
import { AuthService, UserData } from '../../shared/services/auth.service';
// import { PdfGenerateComponent } from '../../shared/components/pdf-generate/pdf-generate.component';


declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
  }
}

@Component({
  // imports:[PdfGenerateComponent],
  selector: 'app-oferta-educativa',
  templateUrl: './oferta-educativa.component.html',
  styleUrls: ['./oferta-educativa.component.scss']
})
export class OfertaEducativaComponent {

  userData: UserData | null = null;

  constructor(private router: Router,private authService:AuthService) { 
  
  }
  ngOnInit(): void {
    // Aquí puedes inicializar cualquier dato necesario
    this.getUserData();
  }
  getUserData(): void {
    this.authService.getUserData().then(data => {
      this.userData = data;
      console.log('Datos del usuario:', this.userData);
    }).catch(error => {
      console.error('Error al obtener los datos del usuario:', error);
    });
  }
  // this.userData =  this.authService.getUserData();
  logout(): void {
    const request = indexedDB.open('authDB'); // Nombre de la base de datos

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('tokens', 'readwrite'); // Nombre de la tabla/almacén
      const store = transaction.objectStore('tokens');

      // Eliminar el token
      const deleteRequest = store.delete('authToken'); // Clave del token

      deleteRequest.onsuccess = () => {
        console.log('Token eliminado correctamente.');
        this.router.navigate(['/']); // Redirige al login
      };

      deleteRequest.onerror = (error) => {
        console.error('Error al eliminar el token:', error);
      };
    };


    request.onerror = (error) => {
      console.error('Error al abrir la base de datos:', error);
    };
  }
   redirecto(route: string) {
    // this.router.navigate(['plantel/',route]);  // Navegar a la ruta proporcionada
    this.router.navigate(['oferta-educativa/home']);  // Navegar a la ruta proporcionada
  }
  // oferta-educativa/home
}
