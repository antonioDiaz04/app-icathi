import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ValidadorDocenteService } from '../../../../commons/services/validador-docente.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent implements OnInit {
  docenteId: string = ''; // ID del docente obtenido de la URL
  docente: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private validadorDocenteService: ValidadorDocenteService
  ) {}

  ngOnInit(): void {
    // Obtén el ID del docente desde la URL
    this.route.paramMap.subscribe((params) => {
      this.docenteId = params.get('id') || ''; // Parámetro "id"
      if (this.docenteId) {
        this.obtenerDocente(this.docenteId);
      } else {
        this.loading = false;
        this.error = 'No se encontró el ID del docente en la URL.';
      }
    });
  }

  obtenerDocente(id: string): void {
    this.validadorDocenteService.getDocenteById(id).subscribe({
      next: (data) => {
        this.docente = {
          ...data,
          foto: data.foto_url || 'https://via.placeholder.com/150', // Foto por defecto si no hay URL
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información del docente.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  regresar(): void {
    this.location.back();
  }
}
