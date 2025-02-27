import { TestBed } from '@angular/core/testing';

import { ConnectionPointService } from './connection-point.service';

describe('ConnectionPointService', () => {
  let service: ConnectionPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
