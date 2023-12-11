import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaCitaComponent } from './modifica-cita.component';

describe('ModificaCitaComponent', () => {
  let component: ModificaCitaComponent;
  let fixture: ComponentFixture<ModificaCitaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaCitaComponent]
    });
    fixture = TestBed.createComponent(ModificaCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
