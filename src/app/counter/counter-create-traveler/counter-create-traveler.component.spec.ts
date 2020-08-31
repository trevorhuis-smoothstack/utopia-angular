import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterCreateTravelerComponent } from "./counter-create-traveler.component";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { of, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import {
  mockControl,
  mockTraveler,
  mockPassword,
} from "src/app/common/counter/counter-mock-data";
import { uncheckedErrorMessage } from "src/app/common/counter/counter-globals";

describe("CounterCreateTravelerComponent", () => {
  let component: CounterCreateTravelerComponent;
  let fixture: ComponentFixture<CounterCreateTravelerComponent>;
  let router: Router,
    toastr: ToastrService,
    httpService: CounterHttpService,
    dataService: CounterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterCreateTravelerComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
        ToastrModule.forRoot(),
      ],
    }).compileComponents();
    toastr = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    httpService = TestBed.get(CounterHttpService);
    dataService = TestBed.get(CounterDataService);
    component = new CounterCreateTravelerComponent(
      toastr,
      router,
      httpService,
      dataService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterCreateTravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should correctly discern when the form has errors and is dirty", () => {
    component.form.controls.username.setErrors(null);
    component.form.controls.username.markAsPristine();
    expect(component.errorsDirty("username")).toBeFalsy();
    component.form.controls.username.markAsDirty();
    expect(component.errorsDirty("username")).toBeFalsy();
    component.form.controls.username.markAsPristine();
    component.form.controls.username.setErrors({ required: true });
    expect(component.errorsDirty("username")).toBeFalsy();
    component.form.controls.username.markAsDirty();
    expect(component.errorsDirty("username")).toBeTruthy();
  });

  it("should check the username and not register a username vaildation error", () => {
    const httpSpy = spyOn(httpService, "getFull").and.returnValues(
      of({ status: 200 }),
      throwError({})
    );
    component
      .validateUsername(mockControl)
      .subscribe((result) => expect(result).toBeNull());
    component
      .validateUsername(mockControl)
      .subscribe((result) => expect(result).toBeNull());
    expect(httpSpy.calls.allArgs()).toEqual([
      [
        environment.counterUrl +
          environment.counterUsernameUri +
          mockControl.value,
      ],
      [
        environment.counterUrl +
          environment.counterUsernameUri +
          mockControl.value,
      ],
    ]);
  });

  it("should check the username and register a username vaildation error", () => {
    spyOn(httpService, "getFull").and.returnValue(of({ status: 204 }));
    component
      .validateUsername(mockControl)
      .subscribe((result) =>
        expect(result).toEqual({ validateUsername: true })
      );
    expect(httpService.getFull).toHaveBeenCalledWith(
      environment.counterUrl +
        environment.counterUsernameUri +
        mockControl.value
    );
  });

  it("should correctly discern whether the passwords match", () => {
    const mockValidForm = new FormGroup({
        password: new FormControl("x"),
        confirmPassword: new FormControl("x"),
      }),
      mockInvalidForm = new FormGroup({
        password: new FormControl("x"),
        confirmPassword: new FormControl("y"),
      });
    expect(component.validatePasswordMatch(mockValidForm)).toBeNull();
    expect(component.validatePasswordMatch(mockInvalidForm)).toEqual({
      validatePasswordMatch: true,
    });
  });

  it("should send the new traveler to the backend, store it in the service, navigate to the booking component, and not display an error toast", () => {
    component.form = new FormGroup({
      name: new FormControl(mockTraveler.name),
      username: new FormControl(mockTraveler.username),
      password: new FormControl(mockPassword),
      confirmPassword: new FormControl(mockPassword),
    });
    spyOn(httpService, "post").and.returnValue(of({ body: mockTraveler }));
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    expect(dataService.getTraveler()).toBeFalsy();
    component.createTraveler();
    expect(httpService.post).toHaveBeenCalledWith(
      environment.counterUrl + environment.counterCreateUserUri,
      {
        name: mockTraveler.name,
        username: mockTraveler.username,
        password: mockPassword,
        role: "TRAVELER",
      }
    );
    expect(dataService.getTraveler()).toEqual(mockTraveler);
    expect(router.navigate).toHaveBeenCalledWith(["/counter/booking"]);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should send the new traveler to the backend, not store it in the service, display an error toast, and not navigate to another URI", () => {
    const mockStatus = 418;
    component.form = new FormGroup({
      name: new FormControl(mockTraveler.name),
      username: new FormControl(mockTraveler.username),
      password: new FormControl(mockPassword),
      confirmPassword: new FormControl(mockPassword),
    });
    spyOn(httpService, "post").and.returnValue(
      throwError({ error: { status: mockStatus } })
    );
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    component.createTraveler();
    expect(httpService.post).toHaveBeenCalledWith(
      environment.counterUrl + environment.counterCreateUserUri,
      {
        name: mockTraveler.name,
        username: mockTraveler.username,
        password: mockPassword,
        role: "TRAVELER",
      }
    );
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error creating traveler: Status " + mockStatus
    );
    expect(dataService.getTraveler()).toBeUndefined();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
