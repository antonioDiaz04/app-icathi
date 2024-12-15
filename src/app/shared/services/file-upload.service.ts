import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private apiUrl = `${environment.api}/archivos`;

  constructor(private http: HttpClient) {}

  // Subir foto de perfil
  uploadProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file); // La clave debe coincidir con la usada en el backend
    return this.http.post(`${this.apiUrl}/upload-profile_docente`, formData);
  }

  // Subir cédula
  uploadCedula(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('cedula', file); // La clave debe coincidir con la usada en el backend
    return this.http.post(`${this.apiUrl}/upload-cedula_docente`, formData);
  }

  // Subir currículum
  uploadCurriculum(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('curriculum', file); // La clave debe coincidir con la usada en el backend
    return this.http.post(`${this.apiUrl}/upload-curriculum_docente`, formData);
  }

  // Subir documento de identificación
  uploadDocumentoIdentificacion(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('documentoIdentificacion', file); // La clave debe coincidir con la usada en el backend
    return this.http.post(`${this.apiUrl}/upload-documento-identificacion_docente`, formData);
  }
}
