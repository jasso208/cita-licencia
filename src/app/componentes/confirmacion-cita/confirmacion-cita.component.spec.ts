import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionCitaComponent } from './confirmacion-cita.component';

describe('ConfirmacionCitaComponent', () => {
  let component: ConfirmacionCitaComponent;
  let fixture: ComponentFixture<ConfirmacionCitaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionCitaComponent]
    });
    fixture = TestBed.createComponent(ConfirmacionCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
