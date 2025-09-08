import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {
  private spinnerContainer: HTMLElement | null = null;

  mostrar(): void {
    if (this.spinnerContainer) return; // Evita crear más de un spinner

    this.spinnerContainer = document.createElement('div');
    this.spinnerContainer.className = `
      fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50
    `;
    
    const spinner = document.createElement('div');
    spinner.className = `
      w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin
    `;
    
    this.spinnerContainer.appendChild(spinner);
    document.body.appendChild(this.spinnerContainer);
  }

  ocultar(): void {
    if (!this.spinnerContainer) return;

    this.spinnerContainer.style.opacity = '0';
    this.spinnerContainer.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      this.spinnerContainer?.remove();
      this.spinnerContainer = null; // Limpieza
    }, 500);
  }
}
