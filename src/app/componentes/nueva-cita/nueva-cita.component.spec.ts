import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCitaComponent } from './nueva-cita.component';

describe('NuevaCitaComponent', () => {
  let component: NuevaCitaComponent;
  let fixture: ComponentFixture<NuevaCitaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaCitaComponent]
    });
    fixture = TestBed.createComponent(NuevaCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
