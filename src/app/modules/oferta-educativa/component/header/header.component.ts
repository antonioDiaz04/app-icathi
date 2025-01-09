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
            *ngFor="let item of menuItems"
            class="flex items-center space-x-2 px-4 py-2 rounded-md"
            [class.bg-blue-500]="selectedItem === item"
            [class.text-white]="selectedItem === item"
            [class.text-gray-800]="selectedItem !== item"
            (click)="selectMenuItem(item)"
            [routerLink]="item.link"
          >
            <!-- Cambiar la clase a Font Awesome -->
            <i class="fas" [ngClass]="item.icon"></i>
            <span>{{ item.label }}</span>
          </a>
          <!-- Cerrar sesión debajo de los enlaces -->
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
  menuItems = [
    { label: 'Inicio', icon: 'fa-home', link: '/oferta-educativa/home' },  // Ruta para la página de inicio
    { label: 'Cursos', icon: 'fa-school', link: '/oferta-educativa/cursos' },
    { label: 'Perfil', icon: 'fa-user', link: '/oferta-educativa/perfil' }, // Icono de perfil
    { label: 'Cerrar sesión', icon: 'fa-sign-out-alt', link: '/oferta-educativa/cerrar-sesion' }, // Icono de cerrar sesión
  ];

  selectedItem = this.menuItems[0];

  selectMenuItem(item: { label: string; icon: string, link: string }) {
    this.selectedItem = item;
  }

  constructor(private router: Router) {}

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
}
