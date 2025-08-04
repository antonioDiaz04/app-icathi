import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-profile-status",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-8">
      <h3 class="text-xl font-semibold text-center text-[#44509D] mb-4 animate__animated animate__fadeIn">
        Estado del Perfil
      </h3>
      <div class="p-4 rounded-lg text-center font-semibold shadow-md transition animate__animated animate__fadeInUp"
        [ngClass]="getStatusClass(status)">
        {{ status || 'Estado no registrado' }}
      </div>
    </div>
  `,
})
export class ProfileStatusComponent {
  @Input() status = ""

  getStatusClass(status: string): string {
    const classes = {
      Activo: "bg-[#44509D] text-white",
      Inactivo: "bg-[#D8566C] text-white",
      "Pendiente de validación": "bg-[#F08762] text-white",
      Suspendido: "bg-gray-100 text-gray-600",
    }
    return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-600"
  }
}
