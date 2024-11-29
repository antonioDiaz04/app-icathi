import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicModule } from './modules/public/public.module';
import { PublicRoutingModule } from './modules/public/public-routing.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,PublicRoutingModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'icathi';
}
