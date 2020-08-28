import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterCreateTravelerComponent } from "./counter-create-traveler.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";

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
});
