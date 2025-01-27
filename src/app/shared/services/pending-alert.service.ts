import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingAlertService {
  private pendingAlertsSubject = new BehaviorSubject<string[]>([]);
  pendingAlerts$ = this.pendingAlertsSubject.asObservable();

  getPendingCount(): number {
    return this.pendingAlertsSubject.value.length;
  }

  updatePendingAlerts(alerts: string[]): void {
    this.pendingAlertsSubject.next(alerts);
  }
}
