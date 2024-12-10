import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidarCorreoService } from '../../../../shared/services/validar-correo.service';

@Component({
  selector: 'app-validar-correo',
  template: `
    <div class="container mx-auto text-center mt-12">
      <!-- Loading overlay -->
      <div *ngIf="loading" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div class="ui active loader large text-white"></div>
        <p class="mt-4 text-white text-lg">Validando tu correo, por favor espera...</p>
      </div>

      <!-- Success message -->
      <div *ngIf="!loading && mensaje" class="bg-[#D8566C] text-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold">¡Validación Exitosa!</h2>
        <p>{{ mensaje }}</p>
        <p class="mt-4 text-sm">Redirigiéndote a la creación de contraseña...</p>
      </div>

      <!-- Error message -->
      <div *ngIf="!loading && error" class="bg-[#F08762] text-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold">Error en la Validación</h2>
        <p>{{ error }}</p>
      </div>

      <!-- Modal while processing -->
      <div *ngIf="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-lg text-center w-96">
          <h2 class="text-xl font-bold text-[#44509D]">Procesando</h2>
          <p class="text-gray-600 mt-2" *ngIf="modalStep === 1">Estamos preparando todo para ti. Por favor, no cierres la página.</p>
          <p class="text-gray-600 mt-2" *ngIf="modalStep === 2">Procediendo a la vista de creación de contraseña. Esto solo tomará unos segundos.</p>
          <div class="mt-4">
            <button class="ui button primary disabled" *ngIf="modalStep === 1">Espera...</button>
            <button class="ui button green disabled" *ngIf="modalStep === 2">Continuando...</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ValidarCorreoComponent implements OnInit {
  mensaje: string | null = null;
  error: string | null = null;
  loading: boolean = false;
  showModal: boolean = false;
  modalStep: number = 1; // Para controlar el estado del modal

  constructor(
    private route: ActivatedRoute,
    private validarCorreoService: ValidarCorreoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.loading = true;

      this.validarCorreoService.validarCorreo(token).subscribe(
        (response: any) => {
          this.loading = false;
          this.mensaje = response.message;

          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem('userId', response.userId);
            sessionStorage.setItem('userEmail', response.userEmail);
          }
  
          setTimeout(() => {
            this.showModal = true;

            // Paso 1: Mostrar "No cierres la página"
            setTimeout(() => {
              this.modalStep = 2; // Cambiar al paso 2
              // Paso 2: Mostrar "Procediendo a la vista de creación de contraseña"
              setTimeout(() => {
                this.showModal = false;
                this.router.navigate(['public/crear-password']);
              }, 3000); // Tiempo en el paso 2
            }, 3000); // Tiempo en el paso 1
          }, 1000); // Tiempo antes de mostrar el modal
        },
        (error) => {
          this.loading = false;
          this.error = error.error.message || 'Error al validar el correo.';
        }
      );
    } else {
      this.error = 'Token no proporcionado.';
    }
  }
}
