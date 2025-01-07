import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoModalidadVirtualComponent } from './curso-modalidad-virtual.component';

describe('CursoModalidadVirtualComponent', () => {
  let component: CursoModalidadVirtualComponent;
  let fixture: ComponentFixture<CursoModalidadVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CursoModalidadVirtualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoModalidadVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
