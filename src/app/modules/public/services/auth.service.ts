import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { IndexedService } from './indexed.service'; // Importamos IndexedService
export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.api}/auth`;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private indexedService: IndexedService // Usamos IndexedService
  ) {}

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap(response => {
        const token = response.token;
        if (token) {
          // Guardar el token en IndexedDB
          this.setToken(token);
        }
      })
    );
  }
  

  // Guardar el token en IndexedDB
  async setToken(token: string): Promise<void> {
    await this.indexedService.storeToken(token);
  }

  // Obtener el token de IndexedDB
  async getToken(): Promise<string | null> {
    const token = await this.indexedService.getToken();
    // console.log('Token retrieved from IndexedDB:', token);
    return token;
  }

  // Limpiar el token de IndexedDB (logout)
  async clearToken(): Promise<void> {
    await this.indexedService.clearToken();
  }

  // Verificar si el token está expirado
  async isTokenExpired(): Promise<boolean> {
    const token = await this.getToken();
    if (token) {
      return this.jwtHelper.isTokenExpired(token);
    }
    return true;
  }
  async getRoleFromToken(): Promise<string | null> {
    const token = await this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);  // Decodificamos el token
      // console.log('Decoded token:', decodedToken);  // Para revisar la estructura del token
      return decodedToken?.rol || null;  // Accedemos al rol
    }
    return null;
  }
  
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token && !(await this.isTokenExpired());
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  }
  

  // Decodificar el JWT y obtener su contenido
  private decodeToken(token: string): any {
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded;
  }
}
