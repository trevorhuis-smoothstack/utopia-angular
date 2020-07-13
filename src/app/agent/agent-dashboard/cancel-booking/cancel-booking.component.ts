import { Component, OnInit, Input } from "@angular/core";
import { Agent } from "../../../common/entities/Agent";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { environment } from "src/environments/environment";
import { Airport } from "../../../common/entities/Airport";
import { Booking } from "../../../common/entities/Booking";
import { Flight } from "../../../common/entities/Flight";
import { Traveler } from '../../../common/entities/Traveler';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

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
    private modalService: NgbModal,
    private toastService: ToastrService) {}

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
        this.toastService.error("We are having an error loading booking information. Please try again later or call IT if the problem continues.", "Internal Error")
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
          this.toastService.error("We are having an error cancelling that booking. Please try again later or call IT if the problem continues.", "Internal Error")
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
