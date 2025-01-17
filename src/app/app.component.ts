import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { sharedComponentsModule } from './shared/components/components.module';
import { AlertService } from './shared/services/alert.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, sharedComponentsModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isCollapsed = false;
  showButton: boolean = false;
  isAtBottom: boolean = false;

  constructor(
    public alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  // Detectar desplazamiento de la página
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPosition = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Si estamos cerca del final de la página, cambia la dirección de la flecha
      this.isAtBottom = scrollPosition + windowHeight >= documentHeight - 50;

      // Si estamos más abajo de cierto punto, mostramos el botón
      this.showButton = scrollPosition > 200;
    }
  }

  // Función para desplazarse arriba o abajo
  scrollToTarget() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isAtBottom) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Subir
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }); // Bajar
      }
    }
  }
}

