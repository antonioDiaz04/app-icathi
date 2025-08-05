import { CommonModule } from "@angular/common"
import { Component, Input, Output, EventEmitter } from "@angular/core"

export interface PendingItem {
  condition: boolean
  message: string
  type: "pending" | "completed"
}

// @Component({
//   selector: "app-docente-info",
//   standalone: true,
//   imports: [CommonModule],
//   template: `
@Component({
  selector: 'app-docente-info',  // Fixed selector
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docente-info.component.ts.component.html',
  styleUrl: './docente-info.component.ts.component.scss'
})
export class DocenteInfoComponentTsComponent {

  @Input() docente: any
  @Input() status = ""
  @Input() pendingItems: PendingItem[] = []

  @Output() editProfile = new EventEmitter<void>()
  @Output() viewClasses = new EventEmitter<void>()

  onEditProfile() {
    this.editProfile.emit()
  }

  onViewClasses() {
    this.viewClasses.emit()
  }

  getStatusClass(status: string): string {
    const classes = {
      Activo: "bg-blue-800 text-white",
      Inactivo: "bg-pink-600 text-white",
      "Pendiente de validación": "bg-orange-500 text-white",
      Suspendido: "bg-gray-400 text-white",
    }
    return classes[status as keyof typeof classes] || "bg-gray-400 text-white"
  }

  trackByIndex(index: number, item: PendingItem): number {
    return index
  }

  getPendingCount(): number {
    return this.pendingItems.filter((item) => item.type === "pending").length
  }

  getCompletedCount(): number {
    return this.pendingItems.filter((item) => item.type === "completed").length
  }

  getProgressPercentage(): number {
    if (this.pendingItems.length === 0) return 100
    return Math.round((this.getCompletedCount() / this.pendingItems.length) * 100)
  }
}
