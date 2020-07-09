import { Component, OnInit, Input } from "@angular/core";
import { Agent } from "../../../common/entities/Agent";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { environment } from "src/environments/environment";
import { Airport } from "../../../common/entities/Airport";
import * as moment from "moment";
import { Booking } from "../../../common/entities/Booking";
import { Flight } from "../../../common/entities/Flight";
import { mergeMap, tap, concatMap, delay, map } from "rxjs/operators";
import { Observable, of, forkJoin } from "rxjs";
import { Traveler } from '../../../common/entities/Traveler';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

  // WHAT I WANT
  
  // STEP 1) USE AGENT ID TO GET ALL BOOKINGS CREATED BY AGENT
  // RETURNS AN ARRAY OF BOOKINGS

  // STEP 2) PERFORM A FOR EACH ON THE BOOKINGS TO GET DATA ABOUT EACH ONE

    // STEP 2-A) FOR EACH BOOKING USE TRAVELER ID TO GET NAME OF TRAVELER

    // STEP 2-B) FOR EACH BOOKING USE FLIGHT ID TO GET DATA ABOUT EACH FLIGHT
    
    // STEP 2-C) FOR EACH BOOKING USE THE FLIGHT AIRPORT IDS WITH A MAP OF AIRPORTS TO GET AIRPORT NAMES
    // AIRPORT MAP IS ALREADY CREATED AT THIS POINT

    // STEP 3) PUSH THE BOOKING WITH ALL INFORMATION TO BE DISPLAYED

@Component({
  selector: "app-agent-cancel-booking",
  templateUrl: "./cancel-booking.component.html",
  styleUrls: ["./cancel-booking.component.css"],
})
export class CancelBookingComponent implements OnInit {
  @Input() agent: Agent;
  @Input() traveler: Traveler;
  @Input() airports: Airport[];
  @Input() mobile: boolean;
  selectedTravelerBookings: Booking[];
  bookings: Booking[];
  airportsMap: Map<Number, string>;
  displayBookings: boolean;
  selectedBooking: any;
  cancelledBooking: boolean;

    // Pagination
    page = 1;
    pageSize = 10;
    filterMetadata = { count: 0 };

  constructor(private service: AgentUtopiaService,
    private modalService: NgbModal,) {}

  ngOnInit() {
    this.airportsMap = new Map();

    this.airports.forEach((element) => {
      this.airportsMap.set(element.airportId, element.name);
    });

    this.loadBookings();
  }

  loadBookings() {
    this.bookings = new Array();
    this.selectedTravelerBookings = new Array();
    this.service
      .get(
        `${environment.agentBackendUrl}${environment.agentFlightsUri}/${this.agent.userId}${environment.agentTravelerUri}/${this.traveler.userId}`
      )
      .subscribe((result: Flight[]) => {
        result.forEach((flight: Flight) => {
          flight.arriveAirport = this.airportsMap.get(flight.arriveId);
          flight.departAirport = this.airportsMap.get(flight.departId);

          let booking: Booking = {
            travelerId: this.traveler.userId,
            flightId: flight.flightId,
            active: true,
            stripeId: "secret",
            bookerId: this.agent.userId,
            name: this.traveler.name,
            flight: flight
          }
          this.bookings.push(booking);
          this.changePaginationCount();
          
        });
      },
      (error) => {
        alert(error);
      }
    )
  }

  
  cancelBooking() {
    let booking = {
      travelerId: this.selectedBooking.travelerId,
      flightId: this.selectedBooking.flightId,
      bookerId: this.selectedBooking.bookerId,
      active: this.selectedBooking.active,
      stripeId: this.selectedBooking.stripeId
    }

    this.service
      .put(`${environment.agentBackendUrl}${environment.agentBookingUri}`, booking)
      .subscribe(
        (res) => {
          this.cancelledBooking = true;
          this.loadBookings();
        },
        (error) => {
          alert(error);
        }
      );
  }

  changePaginationCount() {
    this.filterMetadata.count = this.bookings.length;
  }

  openCancelBookingModal(modal: any, booking: any) {
    this.selectedBooking = booking;
    this.modalService.open(modal);
  }
}
