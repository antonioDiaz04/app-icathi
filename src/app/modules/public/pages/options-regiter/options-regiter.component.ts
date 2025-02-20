import { Component } from '@angular/core';

@Component({
    selector: 'app-options-regiter',
    template: `
    <div
      class="container mx-auto my-5  min-h-screen p-8"
    >
      <div class="container mx-auto my-10">
        <!-- Título principal estilizado -->
        <div class="text-center mb-12">
          <h1
            class="text-2xl md:text-8xl font-extrabold text-gray-800 leading-tight"
          >
            REGISTRO 
          </h1>
          <p class="text-gray-600 text-lg md:text-xl mt-4 max-w-2xl mx-auto">
            Selecciona que tipo de usuario
            <span

              routerLink="/public/registro-user"
              class="hover:underline  cursor-pointer font-semibold text-orange-500"
              >alumno</span
            >
            ó 
            <span
              routerLink="/public/registro-user"
              class="hover:underline cursor-pointer font-semibold text-purple-500"
              >docente</span
            >
          </p>
        </div>

        <!-- Contenedor principal con dos columnas -->
        <div class="flex flex-wrap justify-center gap-6">
          <!-- Registro de Alumno -->
          <div
        class="bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 w-96 p-8"
      >
            <div class="flex items-center space-x-6">
              <!-- Icono de sombrero de graduación -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-12 h-12 text-blue-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
              <h3 class="text-3xl font-bold text-gray-800 leading-snug">
                Registro de Alumnos
              </h3>
            </div>
            <p class="text-gray-600 mt-6">
              Registra y organiza los datos de los alumnos de manera rápida y
              sencilla.
            </p>
            <a
              routerLink="/public/registro-user"
              class="text-orange-500  cursor-pointer font-semibold hover:underline mt-6 block"
            >
              Ir al Registro de Alumnos →
            </a>
          </div>

         <div
        class="bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 w-96 p-8"
      >
            <div class="flex items-center space-x-6">
              <!-- Icono de persona -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-12 h-12 text-blue-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
              <h3 class="text-3xl font-bold text-gray-800 leading-snug">
                Registro de Docentes
              </h3>
            </div>
            <p class="text-gray-600 mt-6">
              Mantén actualizados los datos y registros de los docentes en la
              plataforma.
            </p>
            <a
              routerLink="/public/proceso"
              class="text-purple-500 font-semibold hover:underline mt-6 block"
            >
              Ir al Registro de Docentes →
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: `

  `,
    standalone: false
})
export class OptionsRegiterComponent {}
