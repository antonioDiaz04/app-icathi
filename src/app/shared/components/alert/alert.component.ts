import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  // standalone: true,
  // imports: [CommonModule],
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('slideInFadeOut', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      state('out', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('in => out', [animate('300ms ease-out')]),
      transition('out => in', [animate('300ms ease-in')]),
    ]),
  ],
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'error' | 'warning' | 'success' = 'error';

  closeAlert() {
    this.message = '';
  }
}
