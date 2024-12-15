import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const requiredRole = route.data['role'];

    const token = await this.authService.getToken();
    if (!token) {
      this.alertService.showAlert('No se encontró la session. Redirigiendo al inicio de sesión.', 'error');
      this.router.navigate(['/public/login']);
      return false;
    }

    const isExpired = await this.authService.isTokenExpired();
    if (isExpired) {
      this.alertService.showAlert('Tu sesión ha expirado. Redirigiendo al inicio de sesión.', 'error');
      this.router.navigate(['/public/login']);
      return false;
    }

    const role = await this.authService.getRoleFromToken();
    if (role === requiredRole) {
      return true;
    }

    this.alertService.showAlert('Acceso denegado. No tienes el rol necesario.', 'warning');
    this.router.navigate(['/public/unauthorized']);
    return false;
  }
}
