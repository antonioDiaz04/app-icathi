import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

// @Component({
//   selector: "app-especialidades-display",
//   standalone: true,
//   imports: [CommonModule],
//   template: `
@Component({
  selector: 'app-especialidades-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './especialidades-display.component.html',
  styleUrl: './especialidades-display.component.scss'
})
export class EspecialidadesDisplayComponent {

  @Input() especialidades: any[] = []

  getEspecialidadClass(estatus: string): string {
    const classes = {
      aprobado: "bg-[#E0E5F5] text-[#44509D] border-[#44509D] border",
      pendiente: "bg-[#FBE4D9] text-[#F08762] border-[#F08762] border",
      rechazado: "bg-[#F5DDE1] text-[#D8566C] border-[#D8566C] border",
    }
    return classes[estatus as keyof typeof classes] || ""
  }

  getEspecialidadIcon(estatus: string): string {
    const icons = {
      aprobado: "check square icon",
      pendiente: "thumbtack icon",
      rechazado: "times circle icon",
    }
    return icons[estatus as keyof typeof icons] || ""
  }

  getEspecialidadColor(estatus: string): string {
    const colors = {
      aprobado: "#44509D",
      pendiente: "#F08762",
      rechazado: "#D8566C",
    }
    return colors[estatus as keyof typeof colors] || "#4A5568"
  }
}
