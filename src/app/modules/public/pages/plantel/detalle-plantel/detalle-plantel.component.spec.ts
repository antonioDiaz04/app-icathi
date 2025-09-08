import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePlantelComponent } from './detalle-plantel.component';

describe('DetallePlantelComponent', () => {
  let component: DetallePlantelComponent;
  let fixture: ComponentFixture<DetallePlantelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePlantelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePlantelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
