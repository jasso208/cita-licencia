import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaWhatsappComponent } from './valida-whatsapp.component';

describe('ValidaWhatsappComponent', () => {
  let component: ValidaWhatsappComponent;
  let fixture: ComponentFixture<ValidaWhatsappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidaWhatsappComponent]
    });
    fixture = TestBed.createComponent(ValidaWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
