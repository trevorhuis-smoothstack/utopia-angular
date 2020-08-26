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
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";

describe("CounterComponent", () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let router: Router,
    toastr: ToastrService,
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
    toastr = TestBed.get(ToastrService);
    authService = new CounterAuthService(null);
    dataService = new CounterDataService();
    component = new CounterComponent(
      router,
      toastr,
      dataService,
      authService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should clear data on logout", fakeAsync(() => {
    dataService.setCounter(mockCounter);
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

  it("should authorize the user, initialize the counter, and subscribe to the traveler observable", () => {
    spyOn(authService, "checkAuth").and.returnValue(of({}));
    spyOn(dataService, "getCounter").and.returnValue(mockCounter);
    expect(component.authorized).toBeFalsy();
    expect(component.counter).toBeFalsy();
    component.ngOnInit();
    expect(component.authorized).toEqual(true);
    expect(component.counter).toEqual(mockCounter);
    expect(component.traveler).toBeFalsy();
    dataService.setTraveler(mockTraveler);
    expect(component.traveler).toEqual(mockTraveler);
  });

  it("should navigate to the login page, not display an error toast, and not authorize the user", () => {
    spyOn(authService, "checkAuth").and.returnValues(
      throwError({ error: { status: 401 } }),
      throwError({ error: { status: 403 } }),
      throwError({ error: { status: 500 } })
    );
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    component.ngOnInit();
    component.ngOnInit();
    component.ngOnInit();
    expect(component.authorized).toEqual(false);
    expect(router.navigate).toHaveBeenCalledTimes(3);
    expect(router.navigate).toHaveBeenCalledWith(["/counter/login"]);
    expect(toastr.error).not.toHaveBeenCalled()
  });

  xit("should navigate to the login page, display an error toast and not authorize the user")
});
