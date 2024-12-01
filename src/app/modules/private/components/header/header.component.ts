import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router) {} // Inyecta Router como privado

  // Función para navegar a una ruta
  navigateTo(route: string): void {
    this.router.navigate(['privado/',route]);
  }
}
