import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterLoginComponent } from "./counter-login.component";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { CounterAuthService } from "src/app/common/counter/service/counter-auth.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

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
    authService = new CounterAuthService(null);
    dataService = new CounterDataService();
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
});
