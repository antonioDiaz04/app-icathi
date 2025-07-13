import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmTaiwilService {
  private confirmSubject = new Subject<boolean>();

  showTailwindConfirm(
    message: string,
    confirmText: string = 'Aceptar',
    cancelText: string = 'Cancelar',
    type: 'info' | 'warning' | 'danger' = 'info'
  ): Observable<boolean> {
    // Crear el contenedor principal
    const confirmContainer = document.createElement('div');
    confirmContainer.className = `
      fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50
      backdrop-blur-sm transition-opacity duration-300 ease-in-out
    `;
    confirmContainer.style.opacity = '0';

    // Crear el modal de confirmación
    const modal = document.createElement('div');
    modal.className = `
      bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden
      w-full max-w-md transform transition-all duration-300 ease-in-out
      ${type === 'danger' ? 'border-t-4 border-red-500' : 
        type === 'warning' ? 'border-t-4 border-yellow-500' : 
        'border-t-4 border-blue-500'}
    `;
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(-20px)';

    // Crear el contenido del modal
    const content = document.createElement('div');
    content.className = 'p-6';

    // Crear el icono
    const icon = document.createElement('i');
    icon.className = type === 'danger' ? 'exclamation circle icon text-red-500' : 
                    type === 'warning' ? 'exclamation triangle icon text-yellow-500' : 
                    'info circle icon text-blue-500';
    icon.style.fontSize = '2rem';
    icon.style.marginBottom = '1rem';
    icon.style.display = 'block';
    icon.style.textAlign = 'center';

    // Crear el mensaje
    const messageElement = document.createElement('p');
    messageElement.className = 'text-center text-gray-700 dark:text-gray-300 mb-6';
    messageElement.textContent = message;

    // Crear los botones
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'flex justify-center space-x-4';

    const cancelButton = document.createElement('button');
    cancelButton.className = `
      px-4 py-2 rounded-md transition-colors duration-200
      bg-gray-200 hover:bg-gray-300 text-gray-700
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200
    `;
    cancelButton.textContent = cancelText;
    cancelButton.addEventListener('click', () => {
      this.confirmSubject.next(false);
      this.removeConfirm(confirmContainer);
    });

    const confirmButton = document.createElement('button');
    confirmButton.className = `
      px-4 py-2 rounded-md transition-colors duration-200
      ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' : 
        type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 
        'bg-blue-500 hover:bg-blue-600 text-white'}
    `;
    confirmButton.textContent = confirmText;
    confirmButton.addEventListener('click', () => {
      this.confirmSubject.next(true);
      this.removeConfirm(confirmContainer);
    });

    // Construir la estructura
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(confirmButton);

    content.appendChild(icon);
    content.appendChild(messageElement);
    content.appendChild(buttonsContainer);

    modal.appendChild(content);
    confirmContainer.appendChild(modal);

    // Añadir al body
    document.body.appendChild(confirmContainer);

    // Animación de entrada
    setTimeout(() => {
      confirmContainer.style.opacity = '1';
      modal.style.opacity = '1';
      modal.style.transform = 'translateY(0)';
    }, 50);

    // Permitir cerrar haciendo clic fuera del modal
    confirmContainer.addEventListener('click', (event) => {
      if (event.target === confirmContainer) {
        this.confirmSubject.next(false);
        this.removeConfirm(confirmContainer);
      }
    });

    return this.confirmSubject.asObservable();
  }

  private removeConfirm(container: HTMLElement): void {
    const modal = container.querySelector('div') as HTMLElement;
    if (modal) {
      modal.style.opacity = '0';
      modal.style.transform = 'translateY(-20px)';
    }
    
    container.style.opacity = '0';
    
    setTimeout(() => {
      container.remove();
    }, 300);
  }
}