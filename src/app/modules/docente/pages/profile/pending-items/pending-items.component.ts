import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

export interface PendingItem {
  condition: boolean
  message: string
  type: "pending" | "completed"
}

@Component({
  selector: "app-pending-items",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-8">
      <h3 class="text-xl font-semibold text-center text-[#44509D] mb-4 animate__animated animate__fadeIn">
        Pendientes en el Perfil
      </h3>
      <ul class="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-md transition animate__animated animate__fadeIn">
        <li *ngFor="let item of pendingItems"
          [ngClass]="item.type === 'pending' ? 'text-[#D8566C]' : 'text-[#4CAF50]'"
          class="font-medium flex items-center gap-2 mb-2"
          [class.animate__animated]="true"
          [class.animate__shakeX]="item.type === 'pending'"
          [class.animate__fadeIn]="item.type === 'completed'">
          <i class="icon"
            [ngClass]="item.type === 'pending' ? 'exclamation circle' : 'check circle'"
            [style.color]="item.type === 'pending' ? '#D8566C' : '#4CAF50'"></i>
          {{ item.message }}
        </li>
      </ul>
    </div>
  `,
})
export class PendingItemsComponent {
  @Input() pendingItems: PendingItem[] = []
}
