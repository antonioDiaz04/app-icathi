import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaEducativaComponent } from './oferta-educativa.component';

describe('OfertaEducativaComponent', () => {
  let component: OfertaEducativaComponent;
  let fixture: ComponentFixture<OfertaEducativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaEducativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertaEducativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
