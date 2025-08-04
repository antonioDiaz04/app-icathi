import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-docente-info',  // Fixed selector
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docente-info.component.ts.component.html',
  styleUrl: './docente-info.component.ts.component.scss'
})
export class DocenteInfoComponentTsComponent {

  @Input() docente: any
  @Output() editProfile = new EventEmitter<void>()
  @Output() viewClasses = new EventEmitter<void>()

  onEditProfile() {
    this.editProfile.emit()
  }

  onViewClasses() {
    this.viewClasses.emit()
  }
}
