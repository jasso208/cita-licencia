import { TestBed } from '@angular/core/testing';

import { EmmiterService } from './emmiter.service';

describe('EmmiterService', () => {
  let service: EmmiterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmmiterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
