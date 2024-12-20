import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidarCorreoService } from '../../../../shared/services/validar-correo.service';
import { ModalTaiwilService } from '../../../../shared/services/modal-taiwil.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-validar-correo',
  template: `
    <div class="container mx-auto text-center mt-12">
      <!-- Mensaje de éxito -->
      <div *ngIf="!loading && mensaje" class="bg-[#D8566C] text-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold">¡Validación Exitosa!</h2>
        <p>{{ mensaje }}</p>
        <p class="mt-4 text-sm">Redirigiéndote a la creación de contraseña...</p>
      </div>

      <!-- Mensaje de error -->
      <div *ngIf="!loading && error" class="bg-[#F08762] text-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold">Error en la Validación</h2>
        <p>{{ error }}</p>
      </div>
    </div>
  `,
  styles: [],
})
export class ValidarCorreoComponent implements OnInit {
  mensaje: string | null = null;
  error: string | null = null;
  loading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private validarCorreoService: ValidarCorreoService,
    private modalTaiwilService: ModalTaiwilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.error('El entorno no es un navegador.');
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.loading = true;

      // Mostrar modal de carga
      this.modalTaiwilService.showModal('Validando tu correo, por favor espera...');

      this.validarCorreoService.validarCorreo(token).subscribe(
        (response: any) => {
          this.loading = false;
          this.mensaje = response.message;

          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem('userId', response.userId);
            sessionStorage.setItem('userEmail', response.userEmail);
            sessionStorage.setItem('userRole', response.role); // Guardar el rol
          }

          // Mostrar modal de éxito
          this.modalTaiwilService.showModal('Redirigiéndote a la creación de contraseña...');
          setTimeout(() => {
            const role = sessionStorage.getItem('userRole');
            if (role === 'DOCENTE') {
              this.router.navigate(['public/crear-password']);
            } else if (role === 'ALUMNO') {
              this.router.navigate(['public/alumnos-crear-password']);
            } else {
              this.router.navigate(['public/crear-password']);
            }
          }, 5000);
        },
        (error) => {
          this.loading = false;
          this.error = error.error.message || 'Error al validar el correo.';
          this.modalTaiwilService.showModal('Error en la validación. Intenta nuevamente.');
        }
      );
    } else {
      this.error = 'Token no proporcionado.';
      this.modalTaiwilService.showModal('Error: Token no proporcionado.');
    }
  }
}
