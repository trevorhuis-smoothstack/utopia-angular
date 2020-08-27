import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterLoginComponent } from "./counter-login.component";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { CounterAuthService } from "src/app/common/counter/service/counter-auth.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
import { uncheckedErrorMessage } from "src/app/common/counter/counter-globals";
import {
  mockCounter,
  mockTraveler,
  mockToken,
  mockUsername,
  mockPassword,
} from "src/app/common/counter/counter-mock-data";
import { environment } from "src/environments/environment";

describe("CounterLoginComponent", () => {
  let component: CounterLoginComponent;
  let fixture: ComponentFixture<CounterLoginComponent>;
  let fb: FormBuilder,
    router: Router,
    toastr: ToastrService,
    httpService: CounterHttpService,
    authService: CounterAuthService,
    dataService: CounterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterLoginComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
        ToastrModule.forRoot(),
      ],
    }).compileComponents();
    fb = TestBed.get(FormBuilder);
    toastr = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    httpService = TestBed.get(CounterHttpService);
    authService = TestBed.get(CounterAuthService);
    dataService = TestBed.get(CounterDataService);
    component = new CounterLoginComponent(
      fb,
      router,
      toastr,
      httpService,
      authService,
      dataService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterLoginComponent);
    component = fixture.componentInstance;
    [component.form.value.username, component.form.value.password] = [
      mockUsername,
      mockPassword,
    ];
    localStorage.clear();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should recognize the user is authorized and navigate to the counter dashboard", () => {
    spyOn(authService, "checkAuth").and.returnValue(of({}));
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    expect(authService.checkAuth).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.authorized).toBe(true);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(["/counter"]);
    expect(authService.checkAuth).toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should not authorize the user nor navigate to another URI nor display an error toast", () => {
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
    expect(component.authorized).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should display an error toast, and not authorize the user nor navigate to another URI", () => {
    const mockStatus = 400;
    spyOn(authService, "checkAuth").and.returnValue(
      throwError({ error: { status: mockStatus } })
    );
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    component.ngOnInit();
    expect(component.authorized).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledTimes(1);
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error checking authorization: Status " + mockStatus
    );
  });

  it("should send a login request, recognize the credentials as valid, store the token and the counter, set the traveler to null, navigate to the root counter component, and not display an error toast", () => {
    dataService.setTraveler(mockTraveler);
    spyOn(httpService, "post").and.returnValue(
      of({
        headers: { get: () => mockToken },
      })
    );
    spyOn(httpService, "get").and.returnValue(of(mockCounter));
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    expect(localStorage.getItem("token")).toBeFalsy();
    expect(dataService.getCounter()).toBeFalsy();
    expect(dataService.getTraveler()).toBeTruthy();
    component.logIn();
    expect(component.badCreds).toBe(false);
    expect(httpService.post).toHaveBeenCalledWith(environment.loginUrl, {
      username: mockUsername,
      password: mockPassword,
    });
    expect(localStorage.getItem("token")).toBe(mockToken);
    expect(dataService.getCounter()).toEqual(mockCounter);
    expect(dataService.getTraveler()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/counter/traveler'])
    expect(router.navigate).toHaveBeenCalledTimes(1)
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should recognize the credentials as invalid, not store a token or a counter, not display an error toast, and not navigate to another URI", () => {
    spyOn(httpService, "post").and.returnValue(
      of({
        headers: { get: () => mockToken },
      })
    );
    spyOn(httpService, "get").and.returnValue(
      throwError({ error: { status: 403 } })
    );
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    component.logIn();
    expect(component.badCreds).toBe(true);
    expect(httpService.post).toHaveBeenCalledWith(environment.loginUrl, {
      username: mockUsername,
      password: mockPassword,
    });
    expect(localStorage.getItem("token")).toBeNull();
    expect(dataService.getCounter()).toBeUndefined();
    expect(dataService.getTraveler()).toBeUndefined();
    expect(toastr.error).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
