import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Flight } from "../../entities/Flight";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { environment } from 'src/environments/environment';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Agent } from '../../entities/Agent';
import { Airport } from '../../entities/Airport';
import { Traveler } from '../../entities/Traveler';
import * as moment from 'moment';

@Component({
  selector: "app-agent-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.css"],
})
export class CreateBookingComponent implements OnInit {
  @Input() agent: Agent;
  @Input() traveler: Traveler;
  @Input() airports: Airport[];

  airportsMap: Map<Number, string>;

  creditCardForm = new FormGroup({
    cardNumber: new FormControl("", [<any>Validators.required]),
    expMonth: new FormControl("", [<any>Validators.required]),
    expYear: new FormControl("", [<any>Validators.required]),
    cvc: new FormControl("", [<any>Validators.required]),
  });

  flights: Flight[];
  selectedFlight: any;

  // Slider
  customPrice: number;
  minValue: number;
  maxValue: number;

  // Pagination
  page = 1;
  pageSize = 10;
  filterMetadata = { count: 0 };
  
  // Date Picker
  date: NgbDateStruct;
  

  constructor(
    private formBuilder: FormBuilder,
    private service: AgentUtopiaService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.flights = new Array();

    this.airportsMap = new Map();

    //slider
    this.customPrice = 100;
    this.minValue = 1;
    this.maxValue = 100;

    this.creditCardForm = this.formBuilder.group({
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvc: "",
    });

    this.loadFlights();

    this.airports.forEach((element) => {
      this.airportsMap.set(element.airportId, element.name);
    });
  }

  loadFlights() {
    this.service
      .get(`${environment.agentBackendUrl}${environment.flightsUri}`)
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
      flight.departTimeFormatted = moment(flight.departTime).format(
        "MMMM Do YYYY, h:mm a"
      );
      flight.arriveAirport = this.airportsMap.get(flight.arriveId);
      flight.departAirport = this.airportsMap.get(flight.departId);
    });
  }

  changePaginationCount() {
    this.filterMetadata.count = this.flights.length;
  }

  bookFlight() {
    
    let booking = {
      active: true,
      flightId: this.selectedFlight.flightId,
      bookerId: this.agent.userId,
      travelerId: this.traveler.userId,
      stripeId: null,
    };


    (<any>window).Stripe.card.createToken(
      {
        number: this.creditCardForm.value.cardNumber,
        exp_month: this.creditCardForm.value.expMonth,
        exp_year: this.creditCardForm.value.expYear,
        cvc: this.creditCardForm.value.cvc,
      },
      (status: number, response: any) => {
        if (status === 200) {
          let token = response.id;
          booking.stripeId = token;

          console.log(booking);
          this.service
            .post(
              `${environment.agentBackendUrl}${environment.bookingUri}`,
              booking
            )
            .subscribe(
              (res) => {
                console.log(res);
              },
              (error) => {
                alert(error);
              }
            );
        } else {
          console.log(response.error.message);
        }
      }
    );
  }

  // **********************************************
  // Book flight modal
  // **********************************************

  // initializeBookFlightForm(flight: any) {
  //   let booking = {
  //     active: true,
  //     flightId: flight.flightId,
  //     bookerId: this.agent.userId,
  //     travelerId: this.traveler.userId,
  //     stripeId: null,
  //   };

  // }

  openBookFlightModal(modal: any, flight: any) {
    this.selectedFlight = flight;
    // this.initializeBookFlightForm(flight);
    this.modalService.open(modal);
  }
}
