import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTravelerComponent } from './counter-traveler.component';

describe('CounterTravelerComponent', () => {
  let component: CounterTravelerComponent;
  let fixture: ComponentFixture<CounterTravelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterTravelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterTravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
