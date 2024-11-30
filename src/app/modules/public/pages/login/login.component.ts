import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Logging in with:', email, password);

      // Simular el inicio de sesión
      if (email === 'test@example.com' && password === 'password123') {
        alert('Inicio de sesión exitoso');
        this.router.navigate(['privado/home']); // Redirige al home dentro de la sección privada
        // Redirige a la página de admin
      } else {
        alert('Credenciales incorrectas');
      }
    } else {
      alert('Por favor completa el formulario correctamente.');
    }
  }
}
