import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTravelerComponent } from './select-traveler.component';

describe('SelectTravelerComponent', () => {
  let component: SelectTravelerComponent;
  let fixture: ComponentFixture<SelectTravelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTravelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
