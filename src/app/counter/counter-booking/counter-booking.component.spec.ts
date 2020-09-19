import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterBookingComponent } from "./counter-booking.component";
import { CounterPriceFilterPipe } from "src/app/common/counter/pipe/counter-price-filter.pipe";
import { CounterAirportFilterPipe } from "src/app/common/counter/pipe/counter-airport-filter.pipe";
import { CounterDateFilterPipe } from "src/app/common/counter/pipe/counter-date-filter.pipe";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbModule, NgbModal, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { StripeService, NgxStripeModule } from "ngx-stripe";
import { FormsModule } from "@angular/forms";
import {
  mockAirports,
  mockDepartAirport,
  mockArriveAirport,
  mockFlight,
  mockTraveler,
  mockFlights,
  mockCounter,
} from "src/app/common/counter/counter-mock-data";
import { of, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { uncheckedErrorMessage } from "src/app/common/counter/counter-globals";
describe("CounterBookingComponent", () => {
  let component: CounterBookingComponent;
  let fixture: ComponentFixture<CounterBookingComponent>;
  let router: Router,
    toastr: ToastrService,
    stripe: StripeService,
    modalService: NgbModal,
    httpService: CounterHttpService,
    dataService: CounterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CounterBookingComponent,
        CounterAirportFilterPipe,
        CounterDateFilterPipe,
        CounterPriceFilterPipe,
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
        NgbModule,
        ToastrModule.forRoot(),
        NgxStripeModule.forRoot(),
      ],
    }).compileComponents();
    toastr = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
    stripe = TestBed.get(StripeService);
    httpService = TestBed.get(CounterHttpService);
    dataService = TestBed.get(CounterDataService);
    component = new CounterBookingComponent(
      modalService,
      router,
      toastr,
      stripe,
      httpService,
      dataService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterBookingComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get flights if and only if the condition is true", () => {
    spyOn(component, "getFlights");
    component.getFlightsIf(false);
    expect(component.getFlights).not.toHaveBeenCalled();
    component.getFlightsIf(true);
    expect(component.getFlights).toHaveBeenCalled();
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

  it("should remove the active class from the side link", () => {
    const mockElement = document.createElement("li");
    spyOn(document, "getElementById").and.returnValue(mockElement);
    mockElement.className = "side-link-active";
    expect(mockElement.className).toBe("side-link-active");
    component.ngOnDestroy();
    expect(mockElement.className).toBe("");
  });

  it("should remove the active class from the cancellation link and add it to the booking link", () => {
    const book = document.createElement("li"),
      cancel = document.createElement("li");
    cancel.className = "side-link-active";
    spyOn(document, "getElementById").and.callFake((id: string) =>
      id == "book" ? book : id == "cancel" ? cancel : null
    );
    expect(cancel.className).toBe("side-link-active");
    expect(book.className).toBeFalsy();
    component.ngAfterViewInit();
    expect(cancel.className).toBe("");
    expect(book.className).toBe("side-link-active");
  });

  it("should make a GET request, load flights, and not show an error toast", () => {
    component.departAirport = mockDepartAirport;
    component.arriveAirport = mockArriveAirport;
    component.traveler = mockTraveler;
    spyOn(httpService, "get").and.returnValue(of(mockFlights));
    spyOn(toastr, "error");
    expect(component.flights).toBeFalsy();
    expect(httpService.get).not.toHaveBeenCalled();
    component.getFlights();
    expect(httpService.get).toHaveBeenCalledWith(
      `${environment.counterUrl}${environment.counterBookableUri}/departure/${component.departAirport.airportId}/arrival/${component.arriveAirport.airportId}/traveler/${component.traveler.userId}`
    );
    expect(component.flights).toEqual(mockFlights);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should make a GET request, show an error toast, and not load flights", () => {
    const mockStatus = 418;
    component.departAirport = mockDepartAirport;
    component.arriveAirport = mockArriveAirport;
    component.traveler = mockTraveler;
    spyOn(httpService, "get").and.returnValue(
      throwError({ error: { status: mockStatus } })
    );
    spyOn(toastr, "error");
    expect(httpService.get).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
    component.getFlights();
    expect(httpService.get).toHaveBeenCalledWith(
      `${environment.counterUrl}${environment.counterBookableUri}/departure/${component.departAirport.airportId}/arrival/${component.arriveAirport.airportId}/traveler/${component.traveler.userId}`
    );
    expect(component.flights).toBeUndefined();
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error getting flights: Status " + mockStatus
    );
  });

  it("should set the flight, open the modal, and mount the Stripe Element", () => {
    const mockObject = { mockProperty: "Mock Property" },
      mockElement = { mount: null },
      mockElements = { create: () => mockElement };
    spyOn(dataService, "getTraveler").and.returnValue(mockTraveler);
    spyOn(modalService, "open");
    spyOn(mockElement, "mount");
    spyOn(stripe, "setKey");
    spyOn(httpService, "get").and.returnValue(of(null));
    spyOn(stripe, "elements").and.returnValue(of(mockElements));
    expect(component.flight).toBeFalsy();
    expect(modalService.open).not.toHaveBeenCalled();
    expect(mockElement.mount).not.toHaveBeenCalled();
    component.ngOnInit();
    component.openBookingModal(mockFlight, mockObject);
    expect(component.flight).toEqual(mockFlight);
    expect(modalService.open).toHaveBeenCalledWith(mockObject);
    expect(mockElement.mount).toHaveBeenCalled();
  });

  it("should navigate to the traveler component, not make a GET request, not set the Stripe key, not set the card, and not show an error toast", () => {
    spyOn(dataService, "getTraveler").and.returnValue(null);
    spyOn(router, "navigate");
    spyOn(httpService, "get");
    spyOn(toastr, "error");
    spyOn(stripe, "setKey");
    expect(router.navigate).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(["/counter/traveler"]);
    expect(httpService.get).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
    expect(stripe.setKey).not.toHaveBeenCalled();
    expect(component.card).toBeUndefined();
  });

  it("should set the traveler, make a GET request, and show an error toast", () => {
    const mockStatus = 418;
    spyOn(dataService, "getTraveler").and.returnValue(mockTraveler);
    spyOn(httpService, "get").and.returnValue(
      throwError({ error: { status: mockStatus } })
    );
    spyOn(toastr, "error");
    spyOn(stripe, "setKey");
    spyOn(stripe, "elements").and.returnValue(of({ create: () => null }));
    expect(component.traveler).toBeFalsy();
    expect(httpService.get).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.traveler).toBe(mockTraveler);
    expect(httpService.get).toHaveBeenCalledWith(
      environment.counterUrl + environment.counterAirportUri
    );
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error getting airports: Status " + mockStatus
    );
  });

  it("should set the traveler, make a GET request, load airports, set the Stripe key, mount the card Element, not navigate to another URI, and not show an error toast", () => {
    const mockElements = { create: () => null };
    spyOn(dataService, "getTraveler").and.returnValue(mockTraveler);
    spyOn(httpService, "get").and.returnValue(of(mockAirports));
    spyOn(stripe, "setKey");
    spyOn(stripe, "elements").and.returnValue(of(mockElements));
    spyOn(mockElements, "create");
    spyOn(router, "navigate");
    spyOn(toastr, "error");
    expect(component.traveler).toBeFalsy();
    expect(component.airports).toBeFalsy();
    expect(httpService.get).not.toHaveBeenCalled();
    expect(mockElements.create).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.traveler).toBe(mockTraveler);
    expect(httpService.get).toHaveBeenCalledWith(
      environment.counterUrl + environment.counterAirportUri
    );
    expect(component.airports).toBe(mockAirports);
    expect(stripe.setKey).toHaveBeenCalledWith(
      "pk_test_51GwErbJwa8c7tq3ON61IURqOXTi3Lcqlyx7wBTUR0ClnuHPjOMhLZqJhxG0nFwq04Svaxa6p768cb1Mg8IF6NO2n00TlRmCn9i"
    );
    expect(mockElements.create).toHaveBeenCalledWith("card", {});
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("should show an error toast, not make a POST request, not dismiss the modal, not show a success toast, and not filter flights", () => {
    component.flights = mockFlights;
    spyOn(stripe, "createToken").and.returnValue(of({}));
    spyOn(toastr, "error");
    spyOn(httpService, "post");
    spyOn(modalService, "dismissAll");
    spyOn(toastr, "success");
    spyOn(mockFlights, "filter");
    expect(toastr.error).not.toHaveBeenCalled();
    component.book();
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error processing payment: Unexpected error occurred."
    );
    expect(httpService.post).not.toHaveBeenCalled();
    expect(modalService.dismissAll).not.toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
    expect(mockFlights.filter).not.toHaveBeenCalled();
  });

  it("should show an error toast, not make a POST request, not dismiss the modal, not show a success toast, and not filter flights", () => {
    component.flights = mockFlights;
    spyOn(stripe, "createToken").and.returnValue(of({ error: true }));
    spyOn(toastr, "error");
    spyOn(httpService, "post");
    spyOn(modalService, "dismissAll");
    spyOn(toastr, "success");
    spyOn(mockFlights, "filter");
    expect(toastr.error).not.toHaveBeenCalled();
    component.book();
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error processing payment: Token creation failed."
    );
    expect(httpService.post).not.toHaveBeenCalled();
    expect(modalService.dismissAll).not.toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
    expect(mockFlights.filter).not.toHaveBeenCalled();
  });

  it("should make a POST request, show an error toast, not dismiss the modal, not show a success toast, and not filter flights", () => {
    const mockStripeId = "Mock Stripe ID",
      mockStatus = 418,
      mockBooking = {
        travelerId: mockTraveler.userId,
        flightId: mockFlight.flightId,
        bookerId: mockCounter.userId,
        active: true,
        stripeId: mockStripeId,
      };
    component.traveler = mockTraveler;
    component.counter = mockCounter;
    component.flight = mockFlight;
    component.flights = mockFlights;
    spyOn(stripe, "createToken").and.returnValue(
      of({ token: { id: mockStripeId } })
    );
    spyOn(toastr, "error");
    spyOn(httpService, "post").and.returnValue(
      throwError({ error: { status: mockStatus } })
    );
    spyOn(modalService, "dismissAll");
    spyOn(toastr, "success");
    spyOn(mockFlights, "filter");
    expect(toastr.error).not.toHaveBeenCalled();
    expect(httpService.post).not.toHaveBeenCalled();
    component.book();
    expect(httpService.post).toHaveBeenCalledWith(
      environment.counterUrl + environment.counterBookUri,
      mockBooking
    );
    expect(toastr.error).toHaveBeenCalledWith(
      uncheckedErrorMessage,
      "Error booking ticket: Status " + mockStatus
    );
    expect(modalService.dismissAll).not.toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
    expect(mockFlights.filter).not.toHaveBeenCalled();
  });
});
