import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AspiranteService } from '../../../../shared/services/aspirante.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  alumnoData: any = null; // Datos del alumno cargados
  editando = false;
  is_usuario_alumno: number | null = null; // ID del alumno a cargar

  constructor(

        private authService: AuthService,
       private router: Router,
    
    private aspiranteService: AspiranteService, // Inyectar el servicio AspiranteService
    private route: ActivatedRoute // Inyectar el ActivatedRoute para obtener el ID desde la URL
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();


  }
  private async loadUserDetails(): Promise<void> {
    try {
      // Verificar autenticación
      // this.isAuthenticated = await this.authService.isAuthenticated();

      // if (this.isAuthenticated) {
        // Obtener el ID del token
        this.is_usuario_alumno = await this.authService.getIdFromToken();
        console.log('ID del usuario:', this.is_usuario_alumno);

        // Obtener los datos del docente
        if (this.is_usuario_alumno !== null) {
          this.getAlumnoDetails(this.is_usuario_alumno);
        }
      // } else {
      //   console.warn('Usuario no autenticado');
      // }
    } catch (error) {
      console.error('Error al cargar los detalles del usuario:', error);
    }
  }

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
}
