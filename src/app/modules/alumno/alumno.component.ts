import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'; // Para capturar el ID desde la URL
import { AspiranteService } from '../../shared/services/aspirante.service';
import { AuthService } from '../../shared/services/auth.service';
import { filter } from 'rxjs';

@Component({
    selector: 'app-alumno',
    templateUrl: './alumno.component.html',
    styleUrls: ['./alumno.component.scss'],
    standalone: false
})
export class AlumnoComponent implements OnInit {
  is_usuario_alumno: number | null = null; // ID del alumno a cargar
  is__alumno: number | null = null; // ID del alumno a cargar
  alumnoData: any = null; // Datos del alumno cargados
  isAuthenticated: boolean = false; // Estado de autenticación
  menuOpen: boolean = false;
menuItems = [
  { label: 'Inicio', route: '/alumno/inicio', icon: 'fas fa-home' },
  { label: 'Perfil', route: '/alumno/perfil', icon: 'fas fa-user' },
  { label: 'Clases Asignadas', route: '/alumno/clases', icon: 'fas fa-book' },
  { label: 'Calificaciones', route: '/alumno/calificaciones', icon: 'fas fa-clipboard' },
  { label: 'Oferta Educativa', route: '/alumno/oferta', icon: 'fas fa-chart-bar' },
  { label: 'Avisos', route: '/alumno/inicio', icon: 'fas fa-bell' }
];

  constructor(

        private authService: AuthService,
       private router: Router,
    
    private aspiranteService: AspiranteService, // Inyectar el servicio AspiranteService
    private route: ActivatedRoute // Inyectar el ActivatedRoute para obtener el ID desde la URL
  ) {}
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  ngOnInit(): void {
    this.loadUserDetails();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.menuOpen = false;
    });

  }

  // Cargar detalles del usuario desde el token
  private async loadUserDetails(): Promise<void> {
    try {
      // Verificar autenticación
      this.isAuthenticated = await this.authService.isAuthenticated();

      if (this.isAuthenticated) {
        // Obtener el ID del token
        this.is_usuario_alumno = await this.authService.getIdFromToken();
        console.log('ID del usuario:', this.is_usuario_alumno);

        // Obtener los datos del docente
        if (this.is_usuario_alumno !== null) {
          this.getAlumnoDetails(this.is_usuario_alumno);
        }
      } else {
        console.warn('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los detalles del usuario:', error);
    }
  }

  // Método para obtener los detalles del alumno
  getAlumnoDetails(id: number): void {
    this.aspiranteService.getAlumnoById_user(id).subscribe({
      next: (data) => {
        this.alumnoData = data[0]; // Asignar el primer (y único) alumnoData que devuelve el array
        console.log(this.alumnoData);
      },
      error: (err) => {
        console.error('Error al obtener los datos del alumno', err);
      }
    });
  }
  async logout(): Promise<void> { // Declarar logout como async
    await this.authService.clearToken();
    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/public/login']);
  }
}
