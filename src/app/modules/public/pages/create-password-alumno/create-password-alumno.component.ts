import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { AspiranteService } from '../../../../shared/services/aspirante.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-create-password-alumno',
    templateUrl: './create-password-alumno.component.html',
    styleUrls: ['./create-password-alumno.component.scss'],
    standalone: false
})
export class CreatePasswordAlumnoComponent implements OnInit {
  aviso: string | null = null;
  loading: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private alumnoService: AspiranteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.aviso = 'Como alumno, puedes ingresar directamente a tu perfil utilizando el correo que proporcionaste en tu registro y tu CURP.';

    // Mostrar el aviso por unos segundos antes de proceder al auto-login
    setTimeout(() => {
      this.aviso = null;
      this.autoLogin();
    }, 8000); // 5 segundos
  }

  private autoLogin(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.error('El entorno no es un navegador.');
      return;
    }
    this.loading = true;

    // Suponiendo que el email del usuario ya está almacenado en sessionStorage
    const email = sessionStorage.getItem('userEmail');
    if (!email) {
      this.loading = false;
      alert('No se encontró información de correo. Por favor, intenta nuevamente.');
      this.router.navigate(['public/login']);
      return;
    }

    // Consultar CURP y realizar el inicio de sesión
    this.alumnoService.obtenerCurpPorEmail(email).subscribe({
      next: (curp) => {
        if (!curp) {
          this.loading = false;
          alert('No se encontró CURP asociado a este correo.');
          this.router.navigate(['public/login']);
          return;
        }
        const curpValue = curp.data.curp; // Accedemos directamente al valor del CURP
        console.log("CURP encontrado:", curpValue);
    
        // Realizar el auto-login con email y CURP
        this.authService.login(email, curpValue).subscribe({
          next: async (response) => {
            this.loading = false; // Detener el loader
        
            const { token } = response; // Obtener el token del servidor
            if (token) {
              await this.authService.setToken(token); // Guardar el token en el almacenamiento
        
              // Obtener el rol del usuario desde el token
              const role = await this.authService.getRoleFromToken();
        
              if (role) {
                // console.log('Rol obtenido:', role); // Confirmar el rol
                this.router.navigate(['alumno/']); // Redirigir al dashboard del alumno
 
                // this.redirectByRole(role as ERol); // Redirigir según el rol
              } else {
                alert('No se pudo determinar el rol del usuario.');
              }
            } else {
              alert('Inicio de sesión fallido. Token no recibido.');
            }
          },
          error: (err) => {
            this.loading = false; // Detener el loader en caso de error
            console.error('Error al iniciar sesión:', err); // Log del error
            alert('Error al iniciar sesión. Por favor, intenta nuevamente.');
          },
        });
        
      },
      error: () => {
        this.loading = false;
        alert('Error al obtener la información del alumno.');
      },
    });
  }
}
