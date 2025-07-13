import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { IndexedService } from './indexed.service'; // Importamos IndexedService

// Interfaz para los datos del usuario
export interface UserData {
  id: number;
  email: string;
  nombre: string;
  apellidos: string;
  rol: string;
  // iat: number;
  // exp: number;
}
export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.api}/auth`;
  private apiUrl2 = `${environment.api}`;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private indexedService: IndexedService // Usamos IndexedService
  ) {}


   /**
   * Obtiene todos los datos del usuario desde el token
   * @returns Promise con los datos del usuario o null si no hay token o hay error
   */
  async getUserData(): Promise<UserData | null> {
    try {
      const token = await this.getToken();
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return this.mapTokenToUserData(decodedToken);
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
    }
    return null;
  }
    /**
   * Mapea el token decodificado a la interfaz UserData
   * @param decodedToken Token decodificado
   * @returns Objeto UserData
   */
  private mapTokenToUserData(decodedToken: any): UserData {
    return {
      id: decodedToken.id,
      email: decodedToken.email,
      nombre: decodedToken.nombre,
      apellidos: decodedToken.apellidos,
      rol: decodedToken.rol,
      // iat: decodedToken.iat,
      // exp: decodedToken.exp
    };
  }
  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap(response => {
        try {
          const token = response.token;
          if (token) {
            // Guardar el token en IndexedDB
            this.setToken(token);
          }
        } catch (error) {
          console.error('Error guardando el token:', error);
        }
      })
    );
  }

  // Guardar el token en IndexedDB
  async setToken(token: string): Promise<void> {
    try {
      if (this.isBrowser()) {
        await this.indexedService.storeToken(token);
      }
    } catch (error) {
      console.error('Error guardando el token en IndexedDB:', error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (this.isBrowser()) {
        return await this.indexedService.getToken();
      }
    } catch (error) {
      console.error('Error obteniendo el token de IndexedDB:', error);
    }
    return null;
  }

  // Limpiar el token de IndexedDB (logout)
  async clearToken(): Promise<void> {
    try {
      await this.indexedService.clearToken();
    } catch (error) {
      console.error('Error eliminando el token de IndexedDB:', error);
    }
  }

  // Verificar si el token está expirado
  async isTokenExpired(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (token) {
        return this.jwtHelper.isTokenExpired(token);
      }
    } catch (error) {
      console.error('Error verificando si el token está expirado:', error);
    }
    return true;
  }

  async getIdFromToken(): Promise<number | null> {
    try {
      const token = await this.getToken();
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token); // Decodificar el token
        return decodedToken?.id || null;
      }
    } catch (error) {
      console.error('Error obteniendo ID del token:', error);
    }
    return null;
  }

  async getRoleFromToken(): Promise<string | null> {
    try {
      const token = await this.getToken();
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token); // Decodificamos el token
        return decodedToken?.rol || null; // Accedemos al rol
      }
    } catch (error) {
      console.error('Error obteniendo rol del token:', error);
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

  crearContraseña(email: string, nuevaContraseña: string): Observable<any> {
    const body = { email, nuevaContraseña };
    return this.http.post(`${this.apiUrl2}/postulacion/crear-password`, body);
  }
  private isBrowser(): boolean {
    try {
      return typeof window !== 'undefined';
    } catch (error) {
      console.error('Error al verificar el entorno del navegador:', error);
      return false; // Asumimos que no estamos en un navegador si hay un error
    }
  }
  
}
