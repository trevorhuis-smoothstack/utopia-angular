import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";

import { CounterSelectTravelerComponent } from "./counter-select-traveler.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  ReactiveFormsModule,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import {
  mockUsername,
  mockControl,
} from "src/app/common/counter/counter-mock-data";
import { of, throwError } from "rxjs";
import { environment } from "src/environments/environment";

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
    expect(mockControl.errors).toBeNull();
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
});
