import {
  Component,
  OnInit,
  Input,
} from "@angular/core";
import { Flight } from "../../../common/entities/Flight";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { environment } from "src/environments/environment";
import { NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Agent } from "../../../common/entities/Agent";
import { Airport } from "../../../common/entities/Airport";
import { Traveler } from "../../../common/entities/Traveler";
import { Elements, Element, StripeService } from "ngx-stripe";
import { ToastrService } from "ngx-toastr";
import { FlightQuery } from "src/app/common/entities/FlightQuery";
import * as moment from 'moment';
@Component({
  selector: "app-agent-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.css"],
})
export class CreateBookingComponent implements OnInit {
  @Input() childInput: any;

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

  // Ads on or off
  ads: boolean;

  constructor(
    private service: AgentUtopiaService,
    private modalService: NgbModal,
    private stripe: StripeService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    // Set defaults
    this.ads = false;
    this.flexibleDeparture = false;
    //slider
    this.minValue = 1;
    this.maxValue = 1;
    this.customPrice = 10000;

    this.createDataStructs();
    this.setupStripe();
  }

  ngAfterViewInit() {
    this.loadPremierFlights();
  }

  setupStripe() {
    this.stripe.setKey(
      "pk_test_51Guj65Fb3TAD5KLT94lDvAoFWPcLphSSna40tyv7hCbT8m14pxaItIRXf4y5N33ZaYEU8cqVjXJ7I8lteoAUrmrE00E3zXAfTw"
    );
    this.stripe.elements().subscribe(
      (elements) => {
        this.card = elements.create("card", {});
      },
      (error) => {
        this.toastService.error("We are having an error processing credit charges at the moment. You will not be able to book a flight. Please try again later or contact IT if the problem continues.", "Internal Error");
      }
    );
  }

  createDataStructs() {
    this.flights = new Array();
    this.airportsMap = new Map();
    
    this.childInput.airports.forEach((element) => {
      this.airportsMap.set(element.airportId, element.name);
    });
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
    let flightSearchInput = this.customizeParams(params);
    this.loadFlights(flightSearchInput);
  }

  customizeParams(params) {
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
    return params;
  }

  loadPremierFlights() {
    this.service.get(`${environment.agentBackendUrl}${environment.agentFlightsUri}${environment.agentPremierUri}`).subscribe(
      (result: any) => {
        this.flights = result;
        this.formatFlights();
        this.changePaginationCount();
      },
      (error) => {
        this.toastService.error("There is an error connecting to our data. Please try again or contact IT if the problem continues.", "No Flights Found");
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
            this.toastService.error("There are no flights available that fit your criteria.", "No Flights Found");
            return;
          }
          this.formatFlights();
          this.changePaginationCount();
        },
        (error) => {
          this.toastService.error("There is an error connecting to our data. Please try again or contact IT if the problem continues.", "No Flights Found");
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
    this.stripe.createToken(this.card, {}).subscribe((result) => {
      if (result.token) { this.bookWithToken(result.token) } 
      else if (result.error) { this.handleBadStripeToken() }
    });
  }

  bookWithToken(token) {
    let booking = {
      travelerId: this.childInput.traveler.userId,
      flightId: this.selectedFlight.flightId,
      bookerId: this.childInput.agent.userId,
      active: true,
      stripeId: token.id,
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
          this.toastService.error("There was an error booking your flight. Please try again or contact IT if the problem continues.", "Flight not booked.")
        }
      );
  }

  handleBadStripeToken() {
    this.modalService.dismissAll();
    this.toastService.error("There was an error confirming your credit card, check your card and try to book your flight again.", "Credit Card Not Accepted");
  }

  openBookFlightModal(modal: any, flight: any) {
    this.selectedFlight = flight;
    this.modalService.open(modal);
    this.mountCard();
  }

  mountCard() {
    this.card.mount("#card");
  }
}
