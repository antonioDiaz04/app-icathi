import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const requiredRole = route.data['role'];

    const token = await this.authService.getToken();
    if (!token) {
      console.warn('No token found. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }

    const isExpired = await this.authService.isTokenExpired();
    if (isExpired) {
      console.warn('Token is expired. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }

    const role = await this.authService.getRoleFromToken();
    if (role === requiredRole) {
      return true; // Rol coincide
    }

    console.warn('Access denied. Role mismatch.');
    this.router.navigate(['/public/unauthorized']);
    return false; // Bloquear acceso
  }
}
