import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white text-gray-800">
      <div class="container mx-auto p-4">
        <h1 class="text-xl font-bold text-gray-800 mb-4">Perfil Oferta Educativa</h1>
        <nav class="flex flex-col space-y-2">
          <a
            class="flex items-center space-x-2 px-4 py-2 rounded-md"
            [ngClass]="{ 'bg-blue-500 text-white': selectedItem === 'Inicio', 'text-gray-800': selectedItem !== 'Inicio' }"
            (click)="selectMenuItem('Inicio')"
            [routerLink]="'/oferta-educativa/home'"
          >
            <i class="fas fa-home"></i>
            <span>Inicio</span>
          </a>
          <a
            class="flex items-center space-x-2 px-4 py-2 rounded-md"
            [ngClass]="{ 'bg-blue-500 text-white': selectedItem === 'Cursos', 'text-gray-800': selectedItem !== 'Cursos' }"
            (click)="selectMenuItem('Cursos')"
            [routerLink]="'/oferta-educativa/cursos'"
          >
            <i class="fas fa-school"></i>
            <span>Cursos</span>
          </a>
          <a
            class="flex items-center space-x-2 px-4 py-2 rounded-md"
            [ngClass]="{ 'bg-blue-500 text-white': selectedItem === 'Perfil', 'text-gray-800': selectedItem !== 'Perfil' }"
            (click)="selectMenuItem('Perfil')"
            [routerLink]="'/oferta-educativa/perfil'"
          >
            <i class="fas fa-user"></i>
            <span>Perfil</span>
          </a>
          <a
            class="flex items-center space-x-2 px-4 py-2 rounded-md"
            [ngClass]="{ 'bg-blue-500 text-white': selectedItem === 'Cerrar sesión', 'text-gray-800': selectedItem !== 'Cerrar sesión' }"
            (click)="selectMenuItem('Cerrar sesión')"
            [routerLink]="'/oferta-educativa/cerrar-sesion'"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>Cerrar sesión</span>
          </a>
          <li class="mt-4">
            <button (click)="logout()" class="block py-3 px-6 flex items-center text-gray-600 w-full border-2 border-[#44509D] rounded-md hover:bg-[#44509D] hover:text-white transition-all duration-300">
              <i class="fas fa-sign-out-alt text-[#44509D] mr-3 hover:text-white"></i> Cerrar Sesión
            </button>
          </li>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      header {
        position: sticky;
        top: 0;
        z-index: 50;
      }
      i {
        font-size: 1.25rem;
      }
      li {
        list-style: none;
      }
    `,
  ],
})
export class HeaderComponent {
  selectedItem: string = 'Inicio'; // Inicializa el elemento seleccionado

  constructor(private router: Router) {}

  selectMenuItem(item: string) {
    this.selectedItem = item;
  }

  logout(): void {
    const request = indexedDB.open('authDB');

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('tokens', 'readwrite');
      const store = transaction.objectStore('tokens');

      const deleteRequest = store.delete('authToken');

      deleteRequest.onsuccess = () => {
        console.log('Token eliminado correctamente.');
        this.router.navigate(['/']);
      };

      deleteRequest.onerror = (error) => {
        console.error('Error al eliminar el token:', error);
      };
    };

    request.onerror = (error) => {
      console.error('Error al abrir la base de datos:', error);
    };
  }
}
