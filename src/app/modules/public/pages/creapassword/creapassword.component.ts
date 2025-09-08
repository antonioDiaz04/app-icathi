import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ERol } from '../../../../shared/constants/rol.enum';
import { Router } from '@angular/router';

@Component({
    selector: 'app-creapassword',
    templateUrl: './creapassword.component.html',
    styleUrls: ['./creapassword.component.scss'],
    standalone: false
})
export class CreapasswordComponent {
  public mostrarPassword: boolean = false;
  public mostrarConfirmPassword: boolean = false;
  
  email: string = ''; // Capturar el email del usuario
  password: string = '';
  confirmPassword: string = '';
  mensaje: string | null = null;
  error: string | null = null;

  esPasswordValida: boolean = false;
  esConfirmacionValida: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,

    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos PLATFORM_ID

  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Verificamos si estamos en el navegador
      const userId = sessionStorage.getItem('userId');
      const userEmail = sessionStorage.getItem('userEmail');

      if (userId && userEmail) {
        this.email = userEmail;
      } else {
        this.error = 'No se encontró información del usuario.';
      }
    } else {
      this.error = 'El almacenamiento no está disponible fuera del navegador.';
    }
  }

  // Validar la contraseña según los requisitos
  validarPassword() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    this.esPasswordValida = passwordRegex.test(this.password);
  }

  // Validar que las contraseñas coinciden
  validarConfirmacion() {
    this.esConfirmacionValida = this.password === this.confirmPassword;
  }

  crearPassword() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const userEmail = this.email;

    if (userId) {
      this.loading = true; // Empieza el proceso de carga

      this.authService.crearContraseña(userEmail, this.password).subscribe(
        (response: any) => {
          this.mensaje = response.mensaje;
          this.error = null;
          this.loading = false;

          this.authService.login(userEmail, this.password).subscribe(
            async (response) => {
              const { token } = response;
              if (token) {
                await this.authService.setToken(token); // Guardar el token
                const rol = await this.authService.getRoleFromToken();
                // console.log('Rol obtenido:', rol); // Para confirmar
                if (rol) {
                  alert('Inicio de sesión exitoso con rol: ' + rol);
                  this.redirectByRole(rol as ERol); // Asegúrate de castear el rol si es necesario
                  sessionStorage.removeItem('userId');
                  sessionStorage.removeItem('userEmail');
                } else {
                  alert('No se pudo determinar el rol.');
                }
              }
            },
            error => {
              console.error('Error en inicio de sesión:', error);
              alert('Credenciales incorrectas');
            }
          );




        },
        (error) => {
          this.error = error.error.mensaje || 'Error al crear la contraseña.';
          this.mensaje = null;
          this.loading = false;
        }
      );
    } else {
      this.error = 'No se encontró información del usuario.';
    }
  }
  redirectByRole(rol: ERol) {
    switch (rol) {
      case ERol.ADMIN:
        this.router.navigate(['privado/'])
        break
      case ERol.VALIDA_DOCENTE:
        this.router.navigate(['validador/docente'])
        break
      case ERol.VALIDA_CURSO:
        this.router.navigate(['validador/cursos'])
        break
      case ERol.VALIDA_PLANTEL:
        this.router.navigate(['validador/plantel'])
        break
      case ERol.DOCENTE:
        this.router.navigate(['docente'])
        break
      case ERol.ALUMNO:
        this.router.navigate(['alumno/home'])
        break
      case ERol.CONTROL_ESCOLAR:
        this.router.navigate(['control/'])
        break
      case ERol.COORDINADOR_ACADEMICO:
        this.router.navigate(['academico/'])
        break
      // case ERol.ADMIN_FINANZAS:
      //   this.router.navigate(['finanzas/home']);
      //   break;
      case ERol.PLANTEL:
        this.router.navigate(['plantel/home'])
        break
      default:
        this.router.navigate(['/public/login']) // Ruta por defecto
    }}
}
