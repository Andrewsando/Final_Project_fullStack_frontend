import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hulist } from './hulist';

describe('Hulist', () => {
  let component: Hulist;
  let fixture: ComponentFixture<Hulist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hulist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hulist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
