import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterCancellationComponent } from './counter-cancellation.component';

describe('CounterCancellationComponent', () => {
  let component: CounterCancellationComponent;
  let fixture: ComponentFixture<CounterCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
