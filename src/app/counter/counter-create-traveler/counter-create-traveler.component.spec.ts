import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterCreateTravelerComponent } from './counter-create-traveler.component';

describe('CounterCreateTravelerComponent', () => {
  let component: CounterCreateTravelerComponent;
  let fixture: ComponentFixture<CounterCreateTravelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterCreateTravelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterCreateTravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
