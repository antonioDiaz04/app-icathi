import { DocenteDataService } from './commons/services/docente-data.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ValidadorDocenteService } from '../validador/commons/services/validador-docente.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-docente',
    templateUrl: './docente.component.html',
    styleUrls: ['./docente.component.scss'],
    standalone: false
})
export class DocenteComponent implements OnInit {
  id: number | null = null; // ID del usuario
  isAuthenticated: boolean = false; // Estado de autenticación
  docenteData: any = null; // Datos del docente

  constructor(
    private authService: AuthService,
    private docenteDataService: DocenteDataService  // Inyecta el servicio
,    private router: Router
, // Inyectar Router

    private validadorDocenteService: ValidadorDocenteService // Servicio para obtener datos del docente
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  // Cargar detalles del usuario desde el token
  private async loadUserDetails(): Promise<void> {
    try {
      // Verificar autenticación
      this.isAuthenticated = await this.authService.isAuthenticated();

      if (this.isAuthenticated) {
        // Obtener el ID del token
        this.id = await this.authService.getIdFromToken();
        console.log('ID del usuario:', this.id);

        // Obtener los datos del docente
        if (this.id !== null) {
          this.getDocenteData(this.id);
        }
      } else {
        console.warn('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los detalles del usuario:', error);
    }
  }

  // Obtener datos del docente usando el servicio
  private getDocenteData(id: number): void {
    this.validadorDocenteService.getDocentesByUserId(id.toString()).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.docenteData = data[0]; // Obtén el primer elemento
        } else {
          this.docenteData = null; // Maneja el caso en que no hay datos
        }
        console.log('Datos del docente:', this.docenteData);
        this.docenteDataService.docenteData = this.docenteData;

      },
      error: (error) => {
        console.error('Error al obtener los datos del docente:', error);
      },
    });
  }


  async logout(): Promise<void> { // Declarar logout como async
    await this.authService.clearToken();
    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/public/login']);
  }
  // logout(): void {
  //   this.authService.clearToken().then(() => {
  //     this.isAuthenticated = false;
  //     this.id = null;
  //     this.docenteData = null;
  //     console.log('Sesión cerrada');
  //   });
  // }

  editarPerfil(): void {
    console.log('Redirigir a la página de edición del perfil');
    // Lógica para redirigir o abrir formulario de edición
  }

  verClases(): void {
    console.log('Redirigir a la página de clases');
    // Lógica para redirigir a las clases del docente
  }

}
