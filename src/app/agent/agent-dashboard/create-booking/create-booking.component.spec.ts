// My Code
import { Agent } from 'src/app/common/entities/Agent';
import { Traveler } from 'src/app/common/entities/Traveler';
import { mockAirports, mockBookings, mockAgent, mockFlights, mockTraveler, mockFlightsPreFormat, mockAirportMap } from '../../mock-data';
import { CreateBookingComponent } from "./create-booking.component";
import { AgentUtopiaService } from 'src/app/common/h/agent-utopia.service';

// External code
import { async, ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { StripeService, NgxStripeModule } from 'ngx-stripe';

//Mock modal reference class
export class MockNgbModalRef {
    result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
  }

describe('CreateBookingComponent', () => {
    let component: CreateBookingComponent;
    let fixture: ComponentFixture<CreateBookingComponent>;
    let service: AgentUtopiaService;
    let modalService: NgbModal;
    let stripeService: StripeService;
    let toastService: ToastrService;
    let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CreateBookingComponent ],
      imports: [FormsModule, NgbModule, HttpClientModule, HttpClientTestingModule, ToastrModule.forRoot(), NgxStripeModule.forRoot(),],
      providers: [AgentUtopiaService],
    })
    .compileComponents();
    toastService = TestBed.get(ToastrService);
    service = new AgentUtopiaService(null);
    modalService = TestBed.get(NgbModal);
    component = new CreateBookingComponent(service,  modalService, stripeService, toastService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBookingComponent);
    component.childInput = {
        agent: mockAgent,
        traveler: mockTraveler,
        airports: mockAirports,
        mobile: false,
      }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should setup the component", () => {
    expect(component.ads).toEqual(undefined);
    expect(component.flexibleDeparture).toEqual(undefined);
    expect(component.minValue).toEqual(undefined);
    expect(component.maxValue).toEqual(undefined);
    expect(component.customPrice).toEqual(undefined);
    spyOn(component, "createDataStructs");
    spyOn(component, "setupStripe");
    component.ngOnInit();
    expect(component.ads).toEqual(false);
    expect(component.flexibleDeparture).toEqual(false);
    expect(component.minValue).toEqual(1);
    expect(component.maxValue).toEqual(1);
    expect(component.customPrice).toEqual(10000);
    expect(component.createDataStructs).toHaveBeenCalled;
    expect(component.setupStripe).toHaveBeenCalled;
    
  });

  it("should change the pagination count", () => {
    // Setup
    component.filterMetadata = {count: 12, maxPrice: 1};
    component.flights = [];

    expect(component.filterMetadata.count).toEqual(12);
    component.flights[10] = null;
    component.changePaginationCount();
    expect(component.filterMetadata.count).toEqual(11);
  });

  it("should call loadPremierFlights afterViewInit", () => {
    spyOn(component, "loadPremierFlights");
    component.ngAfterViewInit();
    expect(component.loadPremierFlights).toHaveBeenCalled;
  });

  it("should format the flights", () => {
    component.maxValue = 1.0;
    component.flights = mockFlightsPreFormat;
    component.airportsMap = mockAirportMap;

    expect(component.maxValue).toEqual(1.0);
    component.formatFlights();
    expect(component.flights).toEqual(mockFlights);
    expect(component.maxValue).toEqual(20.0);

  });

  it("should create the data structures", () => {
    expect(component.flights).toEqual(undefined);
    expect(component.airportsMap).toEqual(undefined);
    component.createDataStructs();
    expect(component.flights).toEqual([]);
    expect(component.airportsMap).toEqual(mockAirportMap);
  });

  it("should use updateButton to call two functions", () => {
    spyOn(component, "customizeParams");
    spyOn(component, "loadFlights");
    component.updateButton();
    expect(component.customizeParams).toHaveBeenCalled;
    expect(component.loadFlights).toHaveBeenCalled;
  });

  it("should customize my query parameters from filters", () => {
    let params = {
      params: {
        price: 15.0,
        arriveId: "",
        departId: "",
        dateBegin: "",
        dateEnd: ""
      },
    };
    component.date = {
      year: 2000,
      month: 1,
      day: 1
    };
    component.selectedArrival = "0";
    component.selectedDeparture = "1";

    let newParams = component.customizeParams(params);
    expect(newParams).toEqual({params: {price: 15, arriveId: '1', departId: '2', dateBegin: '2000-1-1', dateEnd: '2000-1-2'}});
  })

  it("should customize my query parameters from filters with flexible departure", () => {
    let params = {
      params: {
        price: 15.0,
        arriveId: "",
        departId: "",
        dateBegin: "",
        dateEnd: ""
      },
    };
    component.date = {
      year: 2000,
      month: 1,
      day: 10
    };
    component.selectedArrival = "0";
    component.selectedDeparture = "1";
    component.flexibleDeparture = true;

    let newParams = component.customizeParams(params);
    expect(newParams).toEqual({params: {price: 15, arriveId: '1', departId: '2', dateBegin: '2000-1-8', dateEnd: '2000-1-13'}});
  });

  it("should open a modal window", () => {
    spyOn(component, "mountCard").and.callFake(() => {});
    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.openBookFlightModal(
      "bookFlightModal",
      mockBookings[0]
    );
  });

  it("should load premier flights", fakeAsync(() => {
    spyOn(service, "get").and.returnValue(of(mockFlightsPreFormat));
    spyOn(component, "formatFlights");
    spyOn(component, "changePaginationCount");    
    component.loadPremierFlights();
    tick();
    expect(component.formatFlights).toHaveBeenCalled();
    expect(component.changePaginationCount).toHaveBeenCalled();
  }));

  it("should load premier flights", fakeAsync(() => {
    spyOn(service, "get").and.returnValue(of(mockFlightsPreFormat));
    spyOn(component, "formatFlights");
    spyOn(component, "changePaginationCount");    
    component.loadPremierFlights();
    tick();
    expect(component.formatFlights).toHaveBeenCalled();
    expect(component.changePaginationCount).toHaveBeenCalled();
  }));

  it("should try to load premier flights and handle an error", fakeAsync(() => {
    spyOn(service, "get").and.returnValue(throwError({status: 400}));
    spyOn(toastService, "error");
    component.loadPremierFlights();
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should load flights with params", fakeAsync(() => {
    spyOn(service, "getWithParams").and.returnValue(of(mockFlightsPreFormat));
    spyOn(component, "formatFlights");
    spyOn(component, "changePaginationCount");    
    component.loadFlights({});
    tick();
    expect(component.formatFlights).toHaveBeenCalled();
    expect(component.changePaginationCount).toHaveBeenCalled();
  }));

  it("should load flights with params but handle a null object", fakeAsync(() => {
    spyOn(service, "getWithParams").and.returnValue(of(null));
    spyOn(toastService, "error");
    component.loadFlights({});
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should try to load flights with params and handle an error", fakeAsync(() => {
    spyOn(service, "getWithParams").and.returnValue(throwError({status: 400}));
    spyOn(toastService, "error");
    component.loadFlights({});
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should try to book a flight with a stripe token", fakeAsync(() => {
    component.selectedFlight = mockFlights[0];
    component.flights = mockFlights;
    component.childInput = {
      traveler: {
        userId: 1
      },
      agent: {
        userId: 1
      }
    };

    spyOn(service, "post").and.returnValue(of({}));
    component.bookWithToken("testValue");
    tick();
    expect(component.flightBooked).toEqual(true);
    expect(component.flights).toEqual([mockFlights[1], mockFlights[2]]);
  }));

  it("should try to book a flight with a stripe token but handle an error", fakeAsync(() => {
    component.selectedFlight = mockFlights[0];
    component.flights = mockFlights;
    component.childInput = {
      traveler: {
        userId: 1
      },
      agent: {
        userId: 1
      }
    };

    spyOn(service, "post").and.returnValue(throwError({status: 400}));
    spyOn(modalService, "dismissAll");
    spyOn(toastService, "error");
    component.bookWithToken("testValue");
    tick();
    expect(modalService.dismissAll).toHaveBeenCalled();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should handle a bad stripe token", fakeAsync(() => {
    spyOn(modalService, "dismissAll");
    spyOn(toastService, "error");
    component.handleBadStripeToken();
    tick();
    expect(modalService.dismissAll).toHaveBeenCalled();
    expect(toastService.error).toHaveBeenCalled();
  }));

});
