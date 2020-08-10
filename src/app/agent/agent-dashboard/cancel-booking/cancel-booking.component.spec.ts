import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CancelBookingComponent } from "./cancel-booking.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  FilterBookingsByArrivalAirportPipe,
  FilterBookingsByTravelerPipe,
  FilterByDepartureDatePipe,
  FilterBookingsByDepartureAirportPipe,
} from "src/app/common/h/filter-bookings";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgentUtopiaService } from 'src/app/common/h/agent-utopia.service';
import { mockAirports, mockBookings, mockAgent, mockFlights, mockTraveler } from '../../mock-data';
import { Agent } from 'src/app/common/entities/Agent';
import { Traveler } from 'src/app/common/entities/Traveler';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe("CancelBookingComponent", () => {
  let component: CancelBookingComponent;
  let service: AgentUtopiaService;
  let fixture: ComponentFixture<CancelBookingComponent>;
  let modalService: NgbModal;
  let toastService: ToastrService;

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
    service = new AgentUtopiaService(null);
    modalService = TestBed.get(NgbModal);
    component = new CancelBookingComponent(service, modalService, toastService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBookingComponent);
    const component = fixture.debugElement.componentInstance;
    const agent: Agent = mockAgent;
    const traveler: Traveler = mockTraveler;
    component.agent = agent;
    component.traveler = traveler;
  });

  it("should create", () => {
    spyOn(service, "get").and.returnValues(mockFlights);
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

  // it("should load the bookings", () => {
  //   spyOn(service, "get").and.returnValue(of(mockFlights));
  //   component.agent = mockAgent;
  //   component.traveler = mockTraveler;
  //   component.loadBookings();
  //   expect(component.bookings).toEqual(mockBookings);
  // });

  

});
