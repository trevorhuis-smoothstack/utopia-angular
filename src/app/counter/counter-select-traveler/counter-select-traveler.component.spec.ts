import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterSelectTravelerComponent } from './counter-select-traveler.component';

describe('CounterSelectTravelerComponent', () => {
  let component: CounterSelectTravelerComponent;
  let fixture: ComponentFixture<CounterSelectTravelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterSelectTravelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterSelectTravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
