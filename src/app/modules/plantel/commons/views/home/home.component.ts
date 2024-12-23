import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ``,
  standalone: false,
})
export class HomeComponent implements OnInit {
  data: any = {};

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getIdFromToken().then((idPlantel) => {
      this.http
        .get<any>(`${environment.api}/plantelesCursos/info/${idPlantel}`)
        .subscribe((response) => {
          this.data= response;
        });
    });
  }
}
