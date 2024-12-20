import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{ message: string; type: 'error' | 'warning' | 'success' }>({ message: '', type: 'error' });
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: 'error' | 'warning' | 'success' = 'error') {
    this.alertSubject.next({ message, type });
    setTimeout(() => this.clearAlert(), 3000); // Desaparece automáticamente después de 3 segundos
  }

  clearAlert() {
    this.alertSubject.next({ message: '', type: 'error' });
  }
}
