import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerComponent } from './traveler.component';

describe('TravelerComponent', () => {
  let component: TravelerComponent;
  let fixture: ComponentFixture<TravelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
