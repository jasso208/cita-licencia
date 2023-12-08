import { TestBed } from '@angular/core/testing';

import { ConvierteFechaService } from './convierte-fecha.service';

describe('ConvierteFechaService', () => {
  let service: ConvierteFechaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvierteFechaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
