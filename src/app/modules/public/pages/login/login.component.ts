import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        async (response) => {
          const token = response.token;
          if (token) {
            await this.authService.setToken(token); // Guardamos el token
            alert('Inicio de sesión exitoso');
            this.router.navigate(['privado/home']); // Redirige a la ruta protegida
          }
        },
        error => {
          console.error('Error en inicio de sesión:', error);
          alert('Credenciales incorrectas');
        }
      );
    } else {
      alert('Por favor completa el formulario correctamente.');
    }
  }
}
