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
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to the counter dashboard", () => {
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

  it("should displa an error toast, and not authorize the user nor navigate to another URI", () => {
    spyOn(authService, "checkAuth").and.returnValue(
      throwError({ error: { status: 400 } })
    );
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    component.ngOnInit();
    expect(component.authorized).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledTimes(1);
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error checking authorization: Status 400"
    );
  });
});
