import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";

import { AgentDashboardComponent } from "./agent-dashboard.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { AgentAuthService } from "src/app/common/h/service/AgentAuthService";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import {
  mockTraveler,
  mockAgent,
  mockAirports,
  mockAirportMap,
} from "../mock-data";
import { of, throwError } from "rxjs";

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe("AgentDashboardComponent", () => {
  let component: AgentDashboardComponent;
  let fixture: ComponentFixture<AgentDashboardComponent>;
  let agentService: AgentUtopiaService;
  let authService: AgentAuthService;
  let toastService: ToastrService;
  let modalService: NgbModal;
  let router: Router;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AgentDashboardComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        NgbModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
      ],
      providers: [AgentUtopiaService, AgentAuthService],
    }).compileComponents();
    agentService = TestBed.get(AgentUtopiaService);
    toastService = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
    authService = new AgentAuthService(null);
    component = new AgentDashboardComponent(
      agentService,
      authService,
      modalService,
      router,
      toastService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    var store = { username: "trevorhuis" };
    spyOn(localStorage, "getItem").and.callFake((key) => {
      return store[key];
    });

    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should create and navigate to the login page with no localstorage username", () => {
    component.ngOnInit();
    var store = {};
    spyOn(localStorage, "getItem").and.callFake((key) => {
      return store[key];
    });
    spyOn(router, "navigate");
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalled();
  });

  it("should set mobile display to true", () => {
    component.adjustForMobile(100);
    expect(component.childInput.mobile).toEqual(true);
  });

  it("should set mobile display to false", () => {
    component.adjustForMobile(1000);
    expect(component.childInput.mobile).toEqual(false);
  });

  it("should set traveler to null", () => {
    component.newTraveler();
    expect(component.traveler).toEqual(null);
  });

  it("should call logout service & navigate to login page with router", () => {
    spyOn(router, "navigate");
    component.logout();
    expect(router.navigate).toHaveBeenCalled();
  });

  it("should open a modal window", () => {
    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.openLogoutModal("logoutAgentModal");
    expect(modalService.open).toHaveBeenCalled();
  });

  it("should change the traveler in the dashboard", () => {
    component.traveler = {};
    component.onTravelerChange(mockTraveler);
    expect(component.traveler).toEqual(mockTraveler);
  });

  it("should load the agent data", fakeAsync(() => {
    component.agent = {};
    spyOn(agentService, "get").and.returnValue(of(mockAgent));
    component.loadAgent();
    tick();
    expect(component.agent.name).toEqual("The Mock Agent");
    expect(component.agent.userId).toEqual(1);
  }));

  it("should try to load agent data and handle an error", fakeAsync(() => {
    component.agent = { username: "fakeAgent" };
    spyOn(agentService, "get").and.returnValue(throwError({ status: 400 }));
    spyOn(toastService, "error");
    component.loadAgent();
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should load the airport data", fakeAsync(() => {
    component.airportsMap = new Map();
    spyOn(agentService, "get").and.returnValue(of(mockAirports));
    component.loadAirports();
    tick();
    expect(component.childInput.airports).toEqual(mockAirports);
    expect(component.airportsMap).toEqual(mockAirportMap);
  }));

  it("should try to load the airport data and handle an error", fakeAsync(() => {
    spyOn(agentService, "get").and.returnValue(throwError({ status: 400 }));
    spyOn(toastService, "error");
    component.loadAirports();
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should return and do nothing after seeing book flight is open", fakeAsync(() => {
    spyOn(component, "changeBookFlightClass");
    spyOn(component, "changeCancelFlightClass");
    component.openBookFlight();
    expect(component.changeCancelFlightClass).not.toHaveBeenCalled();
    expect(component.changeBookFlightClass).not.toHaveBeenCalled();
  }));

  it("should call changeBookFlightClass becaus neither is active", fakeAsync(() => {
    spyOn(component, "changeBookFlightClass");
    spyOn(component, "changeCancelFlightClass");
    document
      .getElementById("agent-book-flight")
      .classList.remove("side-link-active");
    component.openBookFlight();
    expect(component.changeCancelFlightClass).not.toHaveBeenCalled();
    expect(component.changeBookFlightClass).toHaveBeenCalled();
  }));

  it("should call changeCancelFlightClass because cancel-flight is active", fakeAsync(() => {
    spyOn(component, "changeBookFlightClass");
    spyOn(component, "changeCancelFlightClass");
    document
      .getElementById("agent-book-flight")
      .classList.remove("side-link-active");
    document
      .getElementById("agent-cancel-flight")
      .classList.add("side-link-active");
    component.openBookFlight();
    expect(component.changeCancelFlightClass).toHaveBeenCalled();
    expect(component.changeBookFlightClass).toHaveBeenCalled();
  }));

  it("should return and do nothing after seeing cancel booking is open", fakeAsync(() => {
    spyOn(component, "changeBookFlightClass");
    spyOn(component, "changeCancelFlightClass");
    document
      .getElementById("agent-book-flight")
      .classList.remove("side-link-active");
    document
      .getElementById("agent-cancel-flight")
      .classList.add("side-link-active");
    component.openCancelBooking();
    expect(component.changeCancelFlightClass).not.toHaveBeenCalled();
    expect(component.changeBookFlightClass).not.toHaveBeenCalled();
  }));

  it("should call changeCancelFlightClass becaus neither is active", fakeAsync(() => {
    spyOn(component, "changeBookFlightClass");
    spyOn(component, "changeCancelFlightClass");
    document
      .getElementById("agent-book-flight")
      .classList.remove("side-link-active");
    component.openCancelBooking();
    expect(component.changeCancelFlightClass).toHaveBeenCalled();
    expect(component.changeBookFlightClass).not.toHaveBeenCalled();
  }));

  it("should call changeCancelFlightClass because book-flight is active", fakeAsync(() => {
    spyOn(component, "changeBookFlightClass");
    spyOn(component, "changeCancelFlightClass");
    component.openCancelBooking();
    expect(component.changeCancelFlightClass).toHaveBeenCalled();
    expect(component.changeBookFlightClass).toHaveBeenCalled();
  }));

  it("should set cancelFlightPage to false with changeCancelFlightClass", () => {
    component.cancelFlightPage = true;
    component.changeCancelFlightClass();
    expect(component.cancelFlightPage).toEqual(false);
  });

  it("should set cancelFlightPage to true with changeCancelFlightClass", () => {
    component.cancelFlightPage = false;
    component.changeCancelFlightClass();
    expect(component.cancelFlightPage).toEqual(true);
    expect(component.bookFlightPage).toEqual(false);
  });

  it("should set bookFlightPage to true with changeBookFlightClass", () => {
    component.bookFlightPage = true;
    component.changeBookFlightClass();
    expect(component.bookFlightPage).toEqual(true);
  });

  it("should set bookFlightPage  to true with changeBookFlightClass", () => {
    component.bookFlightPage = false;
    component.changeBookFlightClass();
    expect(component.bookFlightPage).toEqual(true);
  });
});
