import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Flight } from "../../../common/entities/Flight";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { environment } from "src/environments/environment";
import { NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Agent } from "../../../common/entities/Agent";
import { Airport } from "../../../common/entities/Airport";
import { Traveler } from "../../../common/entities/Traveler";
import * as moment from "moment";
import { Elements, Element, StripeService } from "ngx-stripe";
@Component({
  selector: "app-agent-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.css"],
})
export class CreateBookingComponent implements OnInit {
  @Input() agent: Agent;
  @Input() traveler: Traveler;
  @Input() airports: Airport[];
  @Input() mobile: boolean;

  airportsMap: Map<Number, string>;

  card: Element;
  elements: Elements;
  flightBooked: boolean;
  flights: Flight[];
  selectedFlight: Flight;

  // Slider
  minValue: number;
  maxValue: number;
  customPrice: number;

  // Pagination
  page = 1;
  pageSize = 10;
  filterMetadata = { count: 0, maxPrice: this.maxValue };

  // Date Picker
  date: NgbDateStruct;

  constructor(
    private service: AgentUtopiaService,
    private modalService: NgbModal,
    private stripe: StripeService
  ) {}

  ngOnInit() {
    this.flights = new Array();

    this.airportsMap = new Map();

    //slider
    this.minValue = 1;
    this.maxValue = 1;
    this.customPrice = 1;

    this.loadFlights();

    this.airports.forEach((element) => {
      this.airportsMap.set(element.airportId, element.name);
    });

    this.stripe.setKey(
      "pk_test_51Guj65Fb3TAD5KLT94lDvAoFWPcLphSSna40tyv7hCbT8m14pxaItIRXf4y5N33ZaYEU8cqVjXJ7I8lteoAUrmrE00E3zXAfTw"
    );
    this.stripe.elements().subscribe(
      (elements) => {
        this.card = elements.create("card", {});
      },

      (error) => {
        alert(error);
      }
    );
  }

  loadFlights() {
    this.service
      .get(`${environment.agentBackendUrl}${environment.agentFlightsUri}`)
      .subscribe(
        (result: Flight[]) => {
          this.flights = result;

          this.formatFlights();
          this.changePaginationCount();
          
        },
        (error) => {
          alert(error);
        }
      );
  }

  formatFlights() {
    this.flights.forEach((flight) => {
      if (flight.price > this.maxValue) {
        this.maxValue = flight.price;
        this.customPrice = flight.price;
      }

      flight.arriveAirport = this.airportsMap.get(flight.arriveId);
      flight.departAirport = this.airportsMap.get(flight.departId);
    });
  }

  changePaginationCount() {
    this.filterMetadata.count = this.flights.length;
  }

  bookFlight() {
    let booking: any;
    this.stripe.createToken(this.card, {}).subscribe((result) => {
      if (result.token) {
        booking = {
          travelerId: this.traveler.userId,
          flightId: this.selectedFlight.flightId,
          bookerId: this.agent.userId,
          active: true,
          stripeId: result.token.id,
        };
        this.service
          .post(`${environment.agentBackendUrl}${environment.agentBookingUri}`, booking)
          .subscribe(
            () => {
              this.flightBooked = true;
              this.flights = this.flights.filter(
                (flight) => flight !== this.selectedFlight
              );
            },
            (error) => {
              this.modalService.dismissAll();
              alert("Error booking ticket: Status " + error.error.status);
            }
          );
      } else if (result.error) {
        this.modalService.dismissAll();
        alert("Error processing payment: Token creation failed.");
      }
    });
  }

  openBookFlightModal(modal: any, flight: any) {
    this.selectedFlight = flight;
    this.modalService.open(modal);
    this.card.mount("#card");
  }
}
