import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterComponent } from "./counter.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from '@angular/common/http';

describe("CounterComponent", () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CounterComponent],
      imports: [
        HttpClientModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
