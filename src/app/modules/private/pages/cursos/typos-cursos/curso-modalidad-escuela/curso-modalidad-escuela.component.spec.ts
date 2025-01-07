import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoModalidadEscuelaComponent } from './curso-modalidad-escuela.component';

describe('CursoModalidadEscuelaComponent', () => {
  let component: CursoModalidadEscuelaComponent;
  let fixture: ComponentFixture<CursoModalidadEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CursoModalidadEscuelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoModalidadEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
