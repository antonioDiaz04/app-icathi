import { Component, OnInit } from '@angular/core';
import { CursosdocentesService } from '../../../../shared/services/cursosdocentes.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DocenteService } from '../../../../shared/services/docente.service';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-cursos-docente',
  templateUrl: './cursos-docente.component.html',
  styleUrls: ['./cursos-docente.component.scss']
})
export class CursosDocenteComponent implements OnInit {
  cursos: any[] = []; // Cursos del docente
  cursosAsignados: any[] = []; // Cursos asignados al docente
  docenteData: any = {}; // Datos del docente

  constructor(
    private docenteService: DocenteService,
    private http: HttpClient,
    private cursosDocentesService: CursosdocentesService,
    private autS: AuthService
  ) {}

  ngOnInit() {
    this.obtenerDatosDocenteYCursos(); // Llamada inicial para obtener los datos
  }

  obtenerDatosDocenteYCursos() {
    this.autS.getIdFromToken().then((id) => {
      // Primero obtenemos los datos del docente usando el ID del usuario (del token)
      this.docenteService.getDocenteById(Number(id)).subscribe({
        next: (docenteResponse) => {
          this.docenteData = docenteResponse;
          console.log('Datos del docente:', this.docenteData);

          // Después de obtener los datos del docente, obtenemos los cursos asignados
          this.obtenerCursosAsignados(String(this.docenteData.id));
        },
        error: (error) => {
          console.error('Error al obtener los datos del docente:', error);
        }
      });
    }).catch((error) => {
      // Manejar el error al obtener el ID del token
      console.error('Error al obtener ID del token:', error);
    });
  }

  obtenerCursosAsignados(docenteId: string) {
    // Consultamos los cursos asignados al docente
    this.cursosDocentesService.obtenerCursosAsignados(Number(docenteId)).subscribe({
      next: (cursosResponse: any) => {  // Usamos "any" para no restringir el tipo
        if (Array.isArray(cursosResponse)) {
          this.cursosAsignados = cursosResponse;
          console.log('Cursos asignados:', this.cursosAsignados);
        } else {
          console.error('La respuesta no es un arreglo de cursos:', cursosResponse);
        }
      },
      error: (error) => {
        console.error('Error al obtener los cursos asignados:', error);
      }
    });
  }
  
}
