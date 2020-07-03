import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterCancelComponent } from './counter-cancel.component';

describe('CounterCancelComponent', () => {
  let component: CounterCancelComponent;
  let fixture: ComponentFixture<CounterCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
