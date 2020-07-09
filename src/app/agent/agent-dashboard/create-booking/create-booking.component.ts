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
import {ToastsService} from "../../../common/s/service/toasts.service";

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
  selectedDeparture: any;
  selectedArrival: any;
  flexibleDeparture: any;

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
    private stripe: StripeService,
    private toastService: ToastsService
  ) {}

  ngOnInit() {
    this.flexibleDeparture = false;
    this.flights = new Array();

    this.airportsMap = new Map();

    //slider
    this.minValue = 1;
    this.maxValue = 1;
    this.customPrice = 10000;

    this.loadPremierFlights();

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
        this.toastService.showError("We are having an error processing credit charges at the moment. You will not be able to book a flight. Please try again later or contact IT if the problem continues.", "Internal Error");
      }
    );

  }

  updateButton() {
    let params = {
      params: {
        price: this.customPrice,
        arriveId: "",
        departId: "",
        dateBegin: "",
        dateEnd: ""
      },
    };
    if(this.selectedArrival != undefined && this.selectedArrival != "All Airports") {
      params.params.arriveId = (parseInt(this.selectedArrival) + 1).toString();
    }
    if(this.selectedDeparture != undefined && this.selectedDeparture != "All Airports") {
      params.params.departId = (parseInt(this.selectedDeparture) + 1).toString();
    }
    if(this.date != undefined) {
      let dateBegin = moment(`${this.date.year}-${this.date.month}-${this.date.day}`, "YYYY-MM-DD");
      if (this.flexibleDeparture) {
        dateBegin.add(-2, 'days');
      }
      params.params.dateBegin = `${dateBegin.year()}-${(dateBegin.month() + 1)}-${dateBegin.date()}`;
    }
    if(this.date != undefined) {
      let dateEnd = moment(`${this.date.year}-${this.date.month}-${this.date.day}`, "YYYY-MM-DD")
      if (this.flexibleDeparture)
        dateEnd.add(3, 'days');
      else
        dateEnd.add(1, 'days');
      params.params.dateEnd = `${dateEnd.year()}-${(dateEnd.month() + 1)}-${dateEnd.date()}`;
    }
    this.loadFlights(params);
  }

  loadPremierFlights() {
    this.service.get(`${environment.agentBackendUrl}${environment.agentFlightsUri}${environment.agentPremierUri}`,).subscribe(
      (result: any) => {
        this.flights = result;
        
        
        this.formatFlights();
        this.changePaginationCount();
      },
      (error) => {
        this.toastService.showError("There is an error connecting to our data. Please try again or contact IT if the problem continues.", "No Flights Found");
      }
    );
  }

  loadFlights(params) {
    this.service
      .getWithParams(
        `${environment.agentBackendUrl}${environment.agentFlightsUri}`,
        params
      )
      .subscribe(
        (result: any) => {
          this.flights = result;
          
          if (this.flights == null) {
            this.toastService.showError("There are no flights with that search criteria", "No Flights Found");
            return;
          }
          this.formatFlights();
          this.changePaginationCount();
        },
        (error) => {
          this.toastService.showError("There is an error connecting to our data. Please try again or contact IT if the problem continues.", "No Flights Found");
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
          .post(
            `${environment.agentBackendUrl}${environment.agentBookingUri}`,
            booking
          )
          .subscribe(
            () => {
              this.flightBooked = true;
              this.flights = this.flights.filter(
                (flight) => flight !== this.selectedFlight
              );
            },
            (error) => {
              this.modalService.dismissAll();
              this.toastService.showError("There was an error booking your flight. Please try again or contact IT if the problem continues.", "Flight not booked.")
            }
          );
      } else if (result.error) {
        this.modalService.dismissAll();
        this.toastService.showError("There was an error confirming your credit card, check your card and try to book your flight again.", "Credit Card Not Accepted");
      }
    });
  }

  openBookFlightModal(modal: any, flight: any) {
    this.selectedFlight = flight;
    this.modalService.open(modal);
    this.card.mount("#card");
  }
}
