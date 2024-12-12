import { Component, OnInit } from '@angular/core';
import { AspiranteService } from '../../../../../../shared/services/aspirante.service';

@Component({
  selector: 'app-listado-alumnos',
  templateUrl: './listado-alumnos.component.html',
  styles: ``,
  standalone: false,
})
export class ListadoAlumnosComponent implements OnInit  {
  textoBusqueda: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  alumnoSeleccionado: any = null;

  // Datos de alumnos
  alumnos:any=[]

  constructor(private aspirantesService:AspiranteService){}


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAlumnos()
  }

  getAlumnos(){
this.aspirantesService.getApirantes().subscribe(response=>{
  this.alumnos = response;
  // this.alumnos = this.filtrarAlumnos();
},(error)=>{
  console.error('Error al obtener los alumnos:', error);
})
    
  }
  // Alumnos filtrados según búsqueda
  filtrarAlumnos() {
    return this.alumnos.filter((alumno:any) => {
      const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`.toLowerCase();
      const coincideTextoBusqueda = nombreCompleto.includes(this.textoBusqueda.toLowerCase()) || 
                                    alumno.email.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      return coincideTextoBusqueda;
    });
  }

  abrirMenuAccion(alumno: any) {
    this.alumnoSeleccionado = this.alumnoSeleccionado === alumno ? null : alumno;
  }

  editarAlumno(alumno: any) {
    alert(`Editando alumno: ${alumno.nombre} ${alumno.apellidos}`);
  }

  eliminarAlumno(alumno: any) {
    alert(`Eliminando alumno: ${alumno.nombre} ${alumno.apellidos}`);
  }
}
