// pending-alert.service.ts
import { Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PendingAlertService {
  private _pendingAlerts = signal<string[]>([]);

  // Acceso a los valores
  readonly pendingAlerts = computed(() => this._pendingAlerts());
  readonly pendingCount = computed(() => this._pendingAlerts().length);

  // Actualización
  update(alerts: string[]): void {
    this._pendingAlerts.set(alerts);
  }

  clear(): void {
    this._pendingAlerts.set([]);
  }
}
