import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTravelerTypeComponent } from './counter-traveler-type.component';

describe('CounterTravelerTypeComponent', () => {
  let component: CounterTravelerTypeComponent;
  let fixture: ComponentFixture<CounterTravelerTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterTravelerTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterTravelerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
