import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const requiredRole = route.data['role'];
    
    // Esperar a que el token esté disponible
    const token = await this.authService.getToken();

    if (!token) {
      console.log('No token found. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el token está expirado
    const isExpired = await this.authService.isTokenExpired();
    if (isExpired) {
      console.log('Token is expired. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }

    // Obtener el rol del token
    const role = await this.authService.getRoleFromToken();

    // console.log(`Rol requerido: ${requiredRole}`);
    // console.log(`Rol actual: ${role}`);

    if (role && role === requiredRole) {
      return true; // El rol coincide, puede acceder
    } else {
      // console.log('Access denied. Role mismatch.');
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
