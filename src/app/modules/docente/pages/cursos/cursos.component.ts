import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-cursos',
  template:`

 <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  <div *ngFor="let curso of cursos" class="bg-white shadow-md rounded-lg overflow-hidden hover:border-blue-500 hover:border-2 transition-all duration-300">
    <div class="p-4">
      <h2 class="text-lg font-bold">Curso de {{ curso.nombre }}</h2>
      <p class="text-gray-500">{{ curso.clave }}</p>
      <p class="text-gray-500">{{ curso.duracion_horas }} horas</p>
      <p class="text-gray-500">{{ curso.descripcion }}</p>
    </div>
    <div class="bg-gray-100 p-4">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-500">Área:</p>
          <p class="font-bold">{{ curso.area_nombre }}</p>
        </div>
        <div>
          <p class="text-gray-500">Especialidad:</p>
          <p class="font-bold">{{ curso.especialidad_nombre }}</p>
        </div>
        <div>
          <p class="text-gray-500">Tipo:</p>
          <p class="font-bold">{{ curso.tipo_curso_nombre }}</p>
        </div>
      </div>
    </div>
    <div class="bg-gray-100 p-4 border-t">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-500">Plantel:</p>
          <p class="font-bold">{{ curso.plantel_nombre }}</p>
        </div>
        <div>
          <p class="text-gray-500">Alumnos:</p>
          <p class="font-bold">{{ curso.cantidad_alumnos }}</p>
        </div>
        <div>
          <p class="text-gray-500">Promedio:</p>
          <p class="font-bold">{{ curso.promedio_calificaciones }}</p>
        </div>
      </div>
    </div>
    <div class="bg-gray-100 p-4 border-t">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-500">Estado:</p>
          <p class="font-bold">{{ curso.estado }}</p>
        </div>
        <div>
          <p class="text-gray-500">Vigencia:</p>
          <p class="font-bold">{{ curso.porcentaje_progreso }}%</p>
        </div>
        <div>
          <p class="text-gray-500">Progreso:</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-blue-600 h-2.5 rounded-full" [style.width]="curso.porcentaje_progreso + '%'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



`,
  styles: ``
})
export class CursosComponent  implements OnInit{

constructor(private http:HttpClient,private autS:AuthService){}

cursos:any


ngOnInit(): void {
  this.getCursos()


}

getCursos() {
  this.autS.getIdFromToken().then((id) => {

      this.http.get<any>(`${environment.api}/cursos/byIdDocente/${id}`)
          .subscribe(
              (response) => {
                  // Manejar la respuesta aquí
                  console.log('Cursos:', response);
                  this.cursos=response
              },
              (error) => {
                  // Manejar el error aquí
                  console.error('Error al obtener cursos:', error);
              }
          );
  }).catch((error) => {
      // Manejar el error al obtener el ID del token
      console.error('Error al obtener ID del token:', error);
  });
}




}
