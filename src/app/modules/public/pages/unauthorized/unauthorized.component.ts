import { Component, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['./unauthorized.component.scss'],
})
export class UnauthorizedComponent {
  constructor(
    private location: Location,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inyección de PLATFORM_ID
  ) {}

  goBack() {
    if (isPlatformBrowser(this.platformId)) { // Verifica si el entorno es un navegador
      if (window.history.length > 1) {
        this.location.back(); // Navega a la página anterior
      } else {
        this.router.navigate(['/']); // Redirige al inicio
      }
    } else {
      console.warn('El objeto window no está disponible en este entorno. Redirigiendo al inicio.');
      this.router.navigate(['/']);
    }
  }
}
