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
import { mockAirports, mockBookings, mockAgent } from '../../mock-data';
import { of } from 'rxjs';
import { Agent } from 'src/app/common/entities/Agent';


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
      imports: [FormsModule, NgbModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();
    service = new AgentUtopiaService(null);
    modalService = TestBed.get(NgbModal);
    component = new CancelBookingComponent(service, modalService, toastService);
  }));

  beforeEach(() => {
    const fixture = TestBed.createComponent(CancelBookingComponent);
    const component = fixture.debugElement.componentInstance;
    const agent: Agent = mockAgent;
    component.agent = agent;
  });

  it("should create", () => {
    spyOn(service, "get").and.returnValues(mockBookings);
    expect(component).toBeTruthy();
  });

  it("should change the pagination count", () => {
    spyOn(service, "get").and.returnValues(mockBookings);
    component.ngOnInit();
    component.filterMetadata.count = 12;
    expect(component.filterMetadata.count).toEqual(12);
    component.bookings[10] = null;
    component.changePaginationCount();
    expect(component.filterMetadata.count).toEqual(11);
  });

  it("should create the data structures", () => {
    expect(typeof component.airportsMap).toEqual("undefined");
    expect(typeof component.bookings).toEqual("undefined");
    component.initDataStructs();
    expect(typeof component.airportsMap).toEqual("object");
    expect(typeof component.bookings).toEqual("object");
  })

});
