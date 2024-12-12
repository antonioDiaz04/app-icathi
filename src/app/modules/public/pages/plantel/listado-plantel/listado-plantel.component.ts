import { Component, OnInit } from '@angular/core';
import { PlantelesService } from '../../../../../shared/services/planteles.service';

@Component({
  selector: 'app-listado-plantel',
  templateUrl: './listado-plantel.component.html',
  styleUrl: './listado-plantel.component.scss',
})
export class ListadoPlantelComponent implements OnInit {
  planteles: any;

  constructor(private plantelS_: PlantelesService) {}

  ngOnInit(): void {
    this.getPlanteles();
  }

  getPlanteles() {
    this.plantelS_.getPlanteles().subscribe((response) => {
      this.planteles = response;
    });
  }
}
