import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterCancellationComponent } from "./counter-cancellation.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { NgbModal, NgbModule, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CounterAirportFilterPipe } from "src/app/common/counter/pipe/counter-airport-filter.pipe";
import { CounterDateFilterPipe } from "src/app/common/counter/pipe/counter-date-filter.pipe";
import {
  mockAirports,
  mockDepartAirport,
  mockArriveAirport,
  mockFlight,
  mockTraveler,
  mockFlightTwo,
  mockFlights,
} from "src/app/common/counter/counter-mock-data";
import { of, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { uncheckedErrorMessage } from "src/app/common/counter/counter-globals";

describe("CounterCancellationComponent", () => {
  let component: CounterCancellationComponent;
  let fixture: ComponentFixture<CounterCancellationComponent>;
  let router: Router,
    toastr: ToastrService,
    modalService: NgbModal,
    httpService: CounterHttpService,
    dataService: CounterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CounterCancellationComponent,
        CounterAirportFilterPipe,
        CounterDateFilterPipe,
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
        NgbModule,
        ToastrModule.forRoot(),
      ],
    }).compileComponents();
    toastr = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
    httpService = TestBed.get(CounterHttpService);
    dataService = TestBed.get(CounterDataService);
    component = new CounterCancellationComponent(
      modalService,
      router,
      toastr,
      httpService,
      dataService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterCancellationComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get the name of the airport", () => {
    component.airports = mockAirports;
    expect(component.getAirportName(mockDepartAirport.airportId)).toBe(
      mockDepartAirport.name
    );
    expect(component.getAirportName(mockArriveAirport.airportId)).toBe(
      mockArriveAirport.name
    );
  });

  it("should remove the active class from the side link", () => {
    const mockElement = document.createElement("li");
    spyOn(document, "getElementById").and.returnValue(mockElement);
    mockElement.className = "side-link-active";
    expect(mockElement.className).toBe("side-link-active");
    component.ngOnDestroy();
    expect(mockElement.className).toBe("");
  });

  it("should set the flight and open the modal", () => {
    const mockObject = { mockProperty: "Mock Property" };
    spyOn(modalService, "open");
    expect(component.flight).toBeFalsy();
    expect(modalService.open).not.toHaveBeenCalled();
    component.openCancellationModal(mockFlight, mockObject);
    expect(component.flight).toEqual(mockFlight);
    expect(modalService.open).toHaveBeenCalledWith(mockObject);
  });

  it("should remove the active class from the booking link and add it to the cancellation link", () => {
    const book = document.createElement("li"),
      cancel = document.createElement("li");
    book.className = "side-link-active";
    spyOn(document, "getElementById").and.callFake((id: string) =>
      id == "book" ? book : id == "cancel" ? cancel : null
    );
    expect(book.className).toBe("side-link-active");
    expect(cancel.className).toBeFalsy();
    component.ngAfterViewInit();
    expect(book.className).toBe("");
    expect(cancel.className).toBe("side-link-active");
  });

  it("should return the current date as an NgbDate", () => {
    const mockDate = new Date(1999, 9, 31);
    spyOn(Date.prototype, "getFullYear").and.returnValue(
      mockDate.getFullYear()
    );
    spyOn(Date.prototype, "getMonth").and.returnValue(mockDate.getMonth());
    spyOn(Date.prototype, "getDate").and.returnValue(mockDate.getDate());
    expect(component.getCurrentDate()).toEqual(
      new NgbDate(
        mockDate.getFullYear(),
        mockDate.getMonth() + 1,
        mockDate.getDate()
      )
    );
  });

  it("should send the cancellation request to the backend, dismiss the modal, show a success toast, remove the cancelled flight, and not show an error toast", () => {
    spyOn(httpService, "put").and.returnValue(of({}));
    spyOn(modalService, "dismissAll");
    spyOn(toastr, "success");
    spyOn(toastr, "error");
    component.traveler = mockTraveler;
    component.flights = [mockFlight, mockFlightTwo];
    component.flight = mockFlight;
    expect(httpService.put).not.toHaveBeenCalled();
    expect(modalService.dismissAll).not.toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
    component.cancel();
    expect(httpService.put).toHaveBeenCalledWith(
      `${environment.counterUrl}${environment.counterCancelUri}/traveler/${mockTraveler.userId}/flight/${mockFlight.flightId}`
    );
    expect(modalService.dismissAll).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith("Ticket cancelled", "Success");
    expect(component.flights).toEqual([mockFlightTwo]);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should send the cancellation request to the backend, show an error toast, not dismiss the modal, not show a success toast, and not remove the flight", () => {
    const mockStatus = 418,
      mockFlights = [mockFlight, mockFlightTwo];
    spyOn(httpService, "put").and.returnValue(
      throwError({ error: { status: mockStatus } })
    );
    spyOn(modalService, "dismissAll");
    spyOn(toastr, "success");
    spyOn(toastr, "error");
    component.traveler = mockTraveler;
    component.flights = mockFlights;
    component.flight = mockFlight;
    expect(httpService.put).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
    component.cancel();
    expect(httpService.put).toHaveBeenCalledWith(
      `${environment.counterUrl}${environment.counterCancelUri}/traveler/${mockTraveler.userId}/flight/${mockFlight.flightId}`
    );
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error cancelling ticket: Status " + mockStatus
    );
    expect(modalService.dismissAll).not.toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
    expect(component.flights).toEqual(mockFlights);
  });

  it("should navigate to the traveler component, not subscribe to the traveler observable, not make a GET request, and not show an error toast", () => {
    spyOn(dataService, "getTraveler").and.returnValue(null);
    spyOn(router, "navigate");
    spyOn(httpService, "get");
    spyOn(toastr, "error");
    expect(router.navigate).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(["/counter/traveler"]);
    expect(httpService.get).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should make two GET requests, load traveler & airports & flights, not navigate to another URI, and not show an error toast", () => {
    const httpSpy = spyOn(httpService, "get").and.callFake((url: string) => {
      return url === environment.counterUrl + environment.counterAirportUri
        ? of(mockAirports)
        : url ===
          environment.counterUrl +
            environment.counterCancellablyBookedUri +
            mockTraveler.userId
        ? of(mockFlights)
        : of(null);
    });
    spyOn(dataService, "getTraveler").and.returnValue(mockTraveler);
    spyOn(router, "navigate");
    expect(httpService.get).not.toHaveBeenCalled();
    expect(component.traveler).toBeFalsy();
    expect(component.airports).toBeFalsy();
    expect(component.flights).toBeFalsy();
    spyOn(toastr, "error");
    component.ngOnInit();
    expect(httpSpy.calls.allArgs()).toEqual([
      [environment.counterUrl + environment.counterAirportUri],
      [
        environment.counterUrl +
          environment.counterCancellablyBookedUri +
          mockTraveler.userId,
      ],
    ]);
    expect(component.traveler).toEqual(mockTraveler);
    expect(component.airports).toEqual(mockAirports);
    expect(component.flights).toEqual(mockFlights);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should load the traveler, make two GET requests, show two error toasts, not load airports or flights, and not navigate to another URI", () => {
    const mockStatusOne = 418,
      mockStatusTwo = 451,
      httpSpy = spyOn(httpService, "get").and.callFake((url: string) => {
        return url === environment.counterUrl + environment.counterAirportUri
          ? throwError({ error: { status: mockStatusOne } })
          : url ===
            environment.counterUrl +
              environment.counterCancellablyBookedUri +
              mockTraveler.userId
          ? throwError({ error: { status: mockStatusTwo } })
          : of(null);
      }),
      toastrSpy = spyOn(toastr, "error");
    spyOn(dataService, "getTraveler").and.returnValue(mockTraveler);
    spyOn(router, "navigate");
    expect(httpService.get).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
    expect(component.traveler).toBeFalsy();
    component.ngOnInit();
    expect(component.traveler).toEqual(mockTraveler);
    expect(httpSpy.calls.allArgs()).toEqual([
      [environment.counterUrl + environment.counterAirportUri],
      [
        environment.counterUrl +
          environment.counterCancellablyBookedUri +
          mockTraveler.userId,
      ],
    ]);
    expect(toastrSpy.calls.allArgs()).toEqual([
      [
        uncheckedErrorMessage,
        "Error getting airports: Status " + mockStatusOne,
      ],
      [uncheckedErrorMessage, "Error getting flights: Status " + mockStatusTwo],
    ]);
    expect(component.airports).toBeUndefined();
    expect(component.flights).toBeUndefined();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
