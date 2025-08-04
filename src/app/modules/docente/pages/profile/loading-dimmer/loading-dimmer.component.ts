import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-loading-dimmer",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="ui dimmer" 
      [ngClass]="{ active: isLoading }" 
      [ngStyle]="{ position: isLoading ? 'fixed' : 'relative' }">
      <div class="ui mini text loader">{{ loadingText }}</div>
    </div>
  `,
  styles: [
    `
    .ui.dimmer {
      background-color: rgba(0, 0, 0, 0.85);
      z-index: 1000;
    }
    .ui.loader {
      color: #44509D;
    }
  `,
  ],
})
export class LoadingDimmerComponent {
  @Input() isLoading = false
  @Input() loadingText = "Loading"
}
