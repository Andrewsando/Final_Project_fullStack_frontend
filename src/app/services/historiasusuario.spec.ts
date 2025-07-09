import { TestBed } from '@angular/core/testing';

import { Historiasusuario } from './historiasusuario';

describe('Historiasusuario', () => {
  let service: Historiasusuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Historiasusuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
