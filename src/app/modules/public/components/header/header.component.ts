 import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  sidebarVisible: boolean = false;
  visible: boolean = false;

  show() {
    this.sidebarVisible = true;
  }

  closeDrawer() {
    this.visible = false;
  }

}
