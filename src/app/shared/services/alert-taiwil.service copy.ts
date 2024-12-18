// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AlertTaiwilService {
//   showTailwindAlert(message: string, type: 'success' | 'error' | 'warning'): void {
//     const alertContainer = document.createElement('div');
//     alertContainer.className = `
//       fixed top-4 right-4 z-50 p-6 rounded-lg shadow-xl transition-all duration-500 ease-in-out
//       ${type === 'success' ? 'bg-green-200 text-green-800 border-l-4 border-green-600' : 
//         type === 'error' ? 'bg-red-200 text-red-800 border-l-4 border-red-600' : 
//         'bg-yellow-200 text-yellow-800 border-l-4 border-yellow-600'}
//       flex items-center justify-start space-x-4 backdrop-blur-sm opacity-40
//       bg-opacity-40
//     `;

//     // Crear el icono correspondiente (usando Semantic UI icons)
//     const icon = document.createElement('i');
//     icon.className = type === 'success' ? 'check circle icon' : 
//                     type === 'error' ? 'exclamation circle icon' : 
//                     'exclamation triangle icon';  // Icono para el tipo 'warning'
//     icon.style.fontSize = '1.75rem';
//     icon.style.marginRight = '10px';

//     // Contenedor para el mensaje
//     const messageContainer = document.createElement('span');
//     messageContainer.textContent = message;

//     // Añadir icono y mensaje al contenedor
//     alertContainer.appendChild(icon);
//     alertContainer.appendChild(messageContainer);

//     // Añadir alerta al body
//     document.body.appendChild(alertContainer);

//     // Animación de aparición con un retraso suave
//     alertContainer.style.opacity = '0';
//     setTimeout(() => {
//       alertContainer.style.opacity = '1';
//       alertContainer.style.transform = 'translateY(10px)';
//     }, 50);

//     // Remover la alerta después de 5 segundos con un efecto de desaparición
//     setTimeout(() => {
//       alertContainer.style.opacity = '0';
//       alertContainer.style.transform = 'translateY(-10px)';
//       setTimeout(() => alertContainer.remove(), 500); // Asegura la transición
//     }, 5000);
//   }
// }
