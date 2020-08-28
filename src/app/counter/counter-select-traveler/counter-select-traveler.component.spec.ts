import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterSelectTravelerComponent } from "./counter-select-traveler.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import {
  mockControl,
  mockTraveler,
} from "src/app/common/counter/counter-mock-data";
import { of, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { uncheckedErrorMessage } from "src/app/common/counter/counter-globals";

describe("CounterSelectTravelerComponent", () => {
  let component: CounterSelectTravelerComponent;
  let fixture: ComponentFixture<CounterSelectTravelerComponent>;
  let router: Router,
    toastr: ToastrService,
    httpService: CounterHttpService,
    dataService: CounterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CounterSelectTravelerComponent],
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
    component = new CounterSelectTravelerComponent(
      router,
      toastr,
      httpService,
      dataService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterSelectTravelerComponent);
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

  it("should check the username and not register a traveler vaildation error", () => {
    spyOn(httpService, "get").and.returnValues(
      of({}),
      throwError({ status: 418 })
    );
    component
      .validateTraveler(mockControl)
      .subscribe((result) => expect(result).toBeNull());
    component
      .validateTraveler(mockControl)
      .subscribe((result) => expect(result).toBeNull());
    expect(httpService.get).toHaveBeenCalledWith(
      environment.counterUrl +
        environment.counterTravelerUri +
        mockControl.value
    );
    expect(httpService.get).toHaveBeenCalledTimes(2);
  });

  it("should check the username and register a traveler vaildation error", () => {
    spyOn(httpService, "get").and.returnValue(throwError({ status: 404 }));
    component
      .validateTraveler(mockControl)
      .subscribe((result) =>
        expect(result).toEqual({ validateTraveler: true })
      );
    expect(httpService.get).toHaveBeenCalledWith(
      environment.counterUrl +
        environment.counterTravelerUri +
        mockControl.value
    );
    expect(httpService.get).toHaveBeenCalledTimes(1);
  });

  it("should request the traveler, store it, navigate to the booking component, and not display an error toast", () => {
    spyOn(httpService, "get").and.returnValue(of(mockTraveler));
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    expect(dataService.getTraveler()).toBeFalsy();
    component.getTraveler(mockTraveler.username);
    expect(httpService.get).toHaveBeenCalledWith(
      environment.counterUrl +
        environment.counterGetUserUri +
        mockTraveler.username
    );
    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(dataService.getTraveler()).toEqual(mockTraveler);
    expect(router.navigate).toHaveBeenCalledWith(["/counter/booking"]);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should request the traveler, display an error toast, not update the traveler, and not navigate anywhere", () => {
    const mockStatus = 418;
    spyOn(httpService, "get").and.returnValue(
      throwError({ error: { status: mockStatus } })
    );
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    component.getTraveler(mockTraveler.username);
    expect(httpService.get).toHaveBeenCalledWith(
      environment.counterUrl +
        environment.counterGetUserUri +
        mockTraveler.username
    );
    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(dataService.getTraveler()).toBeUndefined();
    expect(toastr.error).toHaveBeenCalledTimes(1);
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error getting traveler: Status " + mockStatus
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
