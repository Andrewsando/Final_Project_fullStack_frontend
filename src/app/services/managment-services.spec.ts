import { TestBed } from '@angular/core/testing';

import { ManagmentServices } from './managment-services';

describe('ManagmentServices', () => {
  let service: ManagmentServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagmentServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
