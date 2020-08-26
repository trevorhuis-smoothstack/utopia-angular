import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";

import { CounterComponent } from "./counter.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import {
  mockCounter,
  mockTraveler,
} from "src/app/common/counter/counter-mock-data";
import { CounterAuthService } from "src/app/common/counter/service/counter-auth.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { of } from "rxjs";
import { Router } from "@angular/router";

describe("CounterComponent", () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let router: Router,
    toastrService: ToastrService,
    authService: CounterAuthService,
    dataService: CounterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CounterComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
        ToastrModule.forRoot(),
      ],
    }).compileComponents();
    router = TestBed.get(Router);
    toastrService = TestBed.get(ToastrService);
    authService = new CounterAuthService(null);
    dataService = new CounterDataService();
    component = new CounterComponent(
      router,
      toastrService,
      dataService,
      authService
    );
  }));

  beforeEach(() => {
    // spyOn(dataService, "getCounter").and.returnValue(mockCounter);
    fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should clear data on logout", fakeAsync(() => {
    spyOn(authService, "checkAuth").and.returnValue(of(null));
    dataService.setCounter(mockCounter)
    dataService.setTraveler(mockTraveler);
    localStorage.setItem("token", "Mock Token");
    expect(dataService.getCounter).toBeTruthy();
    expect(dataService.getTraveler).toBeTruthy();
    expect(localStorage.getItem("token")).toBeTruthy();
    component.logOut();
    expect(dataService.getCounter()).toBeNull();
    expect(dataService.getTraveler()).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  }));

});
