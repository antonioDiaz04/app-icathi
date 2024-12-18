import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalTaiwilService {
  showModal(message: string): void {
    // Crear el contenedor del modal
    const modalContainer = document.createElement('div');
    modalContainer.className = `
      fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center
      backdrop-blur-lg transition-all duration-500 ease-in-out opacity-0
    `;
    
    // Contenedor del modal con diseño borroso
    const modalContent = document.createElement('div');
    modalContent.className = `
      bg-white p-8 rounded-lg shadow-xl w-80 max-w-full flex flex-col items-center
      border-2 border-gray-200 backdrop-blur-lg
    `;

    // Crear el icono de carga (puedes cambiar el icono o usar una animación diferente)
    const loadingIcon = document.createElement('div');
    loadingIcon.className = 'animate-spin rounded-full border-t-4 border-blue-600 w-12 h-12 mb-4';

    // Contenedor para el mensaje
    const messageContainer = document.createElement('span');
    messageContainer.textContent = message;
    messageContainer.className = 'text-center text-lg text-gray-800';

    // Añadir el icono de carga y el mensaje al modal
    modalContent.appendChild(loadingIcon);
    modalContent.appendChild(messageContainer);

    // Añadir el modal al contenedor principal
    modalContainer.appendChild(modalContent);
    
    // Añadir el modal al body
    document.body.appendChild(modalContainer);

    // Animación de aparición del modal
    setTimeout(() => {
      modalContainer.style.opacity = '1';
    }, 50);

    // Remover el modal después de 5 segundos
    setTimeout(() => {
      modalContainer.style.opacity = '0';
      setTimeout(() => modalContainer.remove(), 500); // Asegura la transición
    }, 5000);
  }
}
