import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listcards } from './listcards';

describe('Listcards', () => {
  let component: Listcards;
  let fixture: ComponentFixture<Listcards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listcards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listcards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
