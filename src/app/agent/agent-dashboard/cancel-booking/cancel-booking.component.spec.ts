// My Code
import { Agent } from 'src/app/common/entities/Agent';
import { Traveler } from 'src/app/common/entities/Traveler';
import { mockAirports, mockBookings, mockAgent, mockFlights, mockTraveler, mockAirportMap } from '../../mock-data';
import { CancelBookingComponent } from "./cancel-booking.component";
import { AgentUtopiaService } from 'src/app/common/h/agent-utopia.service';
// Pipes
import {
  FilterBookingsByArrivalAirportPipe,
  FilterBookingsByTravelerPipe,
  FilterByDepartureDatePipe,
  FilterBookingsByDepartureAirportPipe,
} from "src/app/common/h/filter-bookings";
// External code
import { async, ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe("CancelBookingComponent", () => {
  let component: CancelBookingComponent;
  let fixture: ComponentFixture<CancelBookingComponent>;
  let service: AgentUtopiaService;
  let modalService: NgbModal;
  let toastService: ToastrService;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CancelBookingComponent,
        FilterBookingsByArrivalAirportPipe,
        FilterBookingsByArrivalAirportPipe,
        FilterBookingsByTravelerPipe,
        FilterByDepartureDatePipe,
        FilterBookingsByDepartureAirportPipe,
      ],
      imports: [FormsModule, NgbModule, HttpClientModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [AgentUtopiaService],
    }).compileComponents();
    toastService = TestBed.get(ToastrService);
    service = new AgentUtopiaService(null);
    modalService = TestBed.get(NgbModal);
    component = new CancelBookingComponent(service, modalService, toastService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBookingComponent);
    component.childInput = {
      agent: mockAgent,
      traveler: mockTraveler,
      airports: mockAirports,
      mobile: false,
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should change the pagination count", () => {
    // Setup
    component.ngOnInit();
    component.filterMetadata = {count: 12};
    component.bookings = [];

    expect(component.filterMetadata.count).toEqual(12);
    component.bookings[10] = null;
    component.changePaginationCount();
    expect(component.filterMetadata.count).toEqual(11);
  });

  it("should call loadBookings afterViewInit", () => {
    spyOn(component, "loadBookings");
    component.ngAfterViewInit();
    expect(component.loadBookings).toHaveBeenCalled;
  });

  it("should open a modal window", () => {
    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.openCancelBookingModal(
      "writeGenreModal",
      mockBookings[0]
    );
  });

  it("should cancel a booking", () => {
    component.cancelledBooking = false;
    spyOn(service, "put").and.returnValue(of({}));
    spyOn(component, "loadBookings").and.callFake(() => {});
    component.selectedBooking = {
      travelerId: 1,
      flightId: 1,
      bookerId: 1,
      active: true,
      selectedBooking: 1,
    }
    component.cancelBooking();
    expect(component.cancelledBooking).toEqual(true);
    expect(component.loadBookings).toHaveBeenCalled();
  });

  it("should try to cancel a booking and handle an error", fakeAsync(() => {
    component.cancelledBooking = false;
    spyOn(toastService, "error");
    spyOn(service, "put").and.returnValue(throwError({status: 400}));
    component.selectedBooking = {
      travelerId: 1,
      flightId: 1,
      bookerId: 1,
      active: true,
      selectedBooking: 1,
    }
    component.cancelBooking();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should load bookings and fill the bookings array", fakeAsync(() => {
    component.childInput.traveler.userId = 1;
    component.childInput.traveler.name = "Trevor Huis in 't Veld";
    component.childInput.agent.userId = 1;

    component.airportsMap = mockAirportMap;
    spyOn(service, "get").and.returnValue(of(mockFlights))
    spyOn(component, "changePaginationCount");
    component.loadBookings();
    tick();
    expect(component.changePaginationCount).toHaveBeenCalled();
    expect(component.bookings).toEqual(mockBookings);
  }));

  it("should try to load bookings but handle an error", fakeAsync(() => {
    spyOn(toastService, "error");
    spyOn(service, "get").and.returnValue(throwError({status: 400}))
    component.loadBookings();
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));
});
