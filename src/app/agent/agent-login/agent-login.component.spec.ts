import { AgentLoginComponent } from "./agent-login.component";
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { RouterModule, Routes, Router } from "@angular/router";
import { AgentAuthService } from "src/app/common/h/service/AgentAuthService";
import { AppRoutingModule } from "src/app/app-routing.module";
import { RouterTestingModule } from "@angular/router/testing";

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe("AgentLoginComponent", () => {
  let component: AgentLoginComponent;
  let fixture: ComponentFixture<AgentLoginComponent>;
  let service: AgentAuthService;
  let fb: FormBuilder;
  let router: Router;
  let toastService: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AgentLoginComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        HttpClientModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
      ],
      providers: [AgentAuthService],
    }).compileComponents();
    toastService = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    service = new AgentAuthService(null);
    fb = new FormBuilder();
    component = new AgentLoginComponent(fb, service, router, toastService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLoginComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set invalidLogin to true", () => {
    component.invalidLogin = false;
    component.setInvalidLogin();
    expect(component.invalidLogin).toEqual(true);
  });

  it("should recognize there are no login values", () => {
    component.login();
    expect(component.invalidAttempt).toEqual(true);
  });

  it("should trigger router to navigate", () => {
    spyOn(service, "isLoggedIn").and.returnValue(true);
    spyOn(router, "navigate");
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalled();
  });

  it("should login a user", fakeAsync(() => {
    let response = {
      status: 200,
      headers: {
        get: (input) => {
          if (input == "expires") return "2015-11-18T18:25:43.511Z";
          if (input == "Authorization") return "testToken";
        },
      },
    };
    spyOn(router, "navigate");
    spyOn(service, "login").and.returnValue(Promise.resolve(response));
    component.loginForm.value.username = "fakeAgent";
    component.loginForm.value.password = "fakePassword";
    component.login();
    tick();
    expect(localStorage.getItem("username")).toEqual("fakeAgent");
    expect(localStorage.getItem("token")).toEqual("testToken");
    expect(router.navigate).toHaveBeenCalled();
  }));

  it("should try to login a user but recieve and handle an error", fakeAsync(() => {
    let response = {
      status: 500,
      error: {
        status: 500,
      },
    };
    spyOn(toastService, "error");
    spyOn(service, "login").and.returnValue(Promise.reject(response));
    component.loginForm.value.username = "fakeAgent";
    component.loginForm.value.password = "fakePassword";
    component.login();
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should try to login a user but recognize that the credentials are invalid", fakeAsync(() => {
    let response = {
      status: 401,
      error: {
        status: 401,
      },
    };
    spyOn(component, "setInvalidLogin");
    spyOn(service, "login").and.returnValue(Promise.reject(response));
    component.loginForm.value.username = "fakeAgent";
    component.loginForm.value.password = "fakePassword";
    component.login();
    tick();
    expect(component.setInvalidLogin).toHaveBeenCalled();
  }));
});
