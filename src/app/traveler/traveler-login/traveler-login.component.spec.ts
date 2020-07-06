import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerLoginComponent } from './traveler-login.component';

describe('TravelerLoginComponent', () => {
  let component: TravelerLoginComponent;
  let fixture: ComponentFixture<TravelerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
