import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlantelesService } from '../../../../../shared/services/planteles.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-frm-plantel',
    templateUrl: './frm-plantel.component.html',
    styleUrl: './frm-plantel.component.scss',
    standalone: false
})
export class FrmPlantelComponent {
  formPlantel: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private plantelService_: PlantelesService
  ) {
    this.formPlantel = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      email: ['', [Validators.required, Validators.email]],
      director: ['', Validators.required],
      capacidad_alumnos: ['', [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      // usuario_gestor_id: ['', Validators.required],
      // estatus: [true, Validators.required],
    });
  }

  regresar() {
    
    // Navegar a la ruta de detalles del curso pasando el id como parámetro
    this.router.navigate([`/privado/lista-planteles`]);
  }
  guardarPlantel() {
    alert('pasa en funsion guardar');
    console.log("this.formPlantel.valid¨¨¨¨¨¨¨¨¨¨",this.formPlantel)
    console.log("this.formPlantel.valid¨¨¨¨¨¨¨¨¨¨",this.formPlantel.valid)
    console.log("Errores en el formulario:", this.formPlantel.errors);
this.formPlantel.controls['nombre']?.errors && console.log("Error en nombre:", this.formPlantel.controls['nombre'].errors);
this.formPlantel.controls['direccion']?.errors && console.log("Error en dirección:", this.formPlantel.controls['direccion'].errors);
this.formPlantel.controls['telefono']?.errors && console.log("Error en teléfono:", this.formPlantel.controls['telefono'].errors);
this.formPlantel.controls['email']?.errors && console.log("Error en email:", this.formPlantel.controls['email'].errors);
this.formPlantel.controls['director']?.errors && console.log("Error en director:", this.formPlantel.controls['director'].errors);
this.formPlantel.controls['capacidad_alumnos']?.errors && console.log("Error en capacidad_alumnos:", this.formPlantel.controls['capacidad_alumnos'].errors);
this.formPlantel.controls['estado']?.errors && console.log("Error en estado:", this.formPlantel.controls['estado'].errors);
this.formPlantel.controls['municipio']?.errors && console.log("Error en municipio:", this.formPlantel.controls['municipio'].errors);

    if (this.formPlantel.valid) {
      const Plantel = {
        nombre: this.formPlantel.get('nombre')?.value,
        direccion: this.formPlantel.get('direccion')?.value,
        telefono: this.formPlantel.get('telefono')?.value,
        email: this.formPlantel.get('email')?.value,
        director: this.formPlantel.get('director')?.value,
        capacidad_alumnos: this.formPlantel.get('capacidad_alumnos')?.value,
        estado: this.formPlantel.get('estado')?.value,
        municipio: this.formPlantel.get('municipio')?.value,
        // usuario_gestor_id: this.formPlantel.get('usuario_gestor_id')?.value,
        // estatus: this.formPlantel.get('estatus')?.value,
      };
      console.log("this.formPlantel.valid¨¨¨¨¨¨¨¨¨¨",this.formPlantel)
      this.plantelService_.createPlantel(Plantel).subscribe(
        (response) => {
          console.log("enviando datos del platel  .....",Plantel)
          // if (action === 'frm-plantel') {
          this.router.navigate(['/privado/frm-plantel']); // Redirige a la página de edición
          // }
          console.log('Plantel creado exitosamente', response);
          // Aquí podrías redirigir o mostrar un mensaje de éxito
        },
        (error) => {
          console.error('Error al crear el plantel', error);
        }
      );
      console.log(this.formPlantel.value); // Muestra los valores del formulario en consola
    }
  }
}
