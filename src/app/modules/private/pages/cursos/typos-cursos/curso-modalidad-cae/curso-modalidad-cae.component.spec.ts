import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoModalidadCAEComponent } from './curso-modalidad-cae.component';

describe('CursoModalidadCAEComponent', () => {
  let component: CursoModalidadCAEComponent;
  let fixture: ComponentFixture<CursoModalidadCAEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CursoModalidadCAEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoModalidadCAEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
