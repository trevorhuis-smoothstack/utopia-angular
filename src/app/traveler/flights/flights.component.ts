import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TravelerService } from 'src/app/common/s/service/traveler.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { StripeService, Element, Elements } from 'ngx-stripe';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {

  @Input() user: any;
  @Input() airports: any;

  // stripe
  elements: Elements;
  card: Element;

  airportsMap: Map<number, string>;
  flights: any;
  selectedFlight: any;
  date: NgbDateStruct;

  // Slider
  customPrice = 100;
  minValue = 1;
  maxValue = 100;

  // Pagination
  page = 1;
  pageSize = 10;
  filterMetadata = { count: 0 };

  constructor(
    private travelerService: TravelerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private stripe: StripeService
    ) { }

  ngOnInit() {
    this.stripe.setKey('pk_test_51GvUChBYMFlMJbBRvrWM7yZJHJhVExdReQ2A5K0uaKTidkmqRcnY48fr6VmnK9csVNOwkiH0xetgz36Gcvql6IF20098oe4tpg');
    this.stripe.elements().subscribe(
      (elements) => {
        this.card = elements.create("card", {});
      },

      (error) => {
        alert(error);
      }
    );
    this.flights = new Array();

    this.airportsMap = new Map();

    this.loadFlights();
  }

  loadFlights() {
    this.travelerService
      .get(`${environment.travelerBackendUrl}${environment.travelersUri}/${this.user.userId}${environment.flightsUri}`)
      .subscribe(
        (result: any[]) => {
          this.flights = result;

          this.airports.forEach((element) => {
            this.airportsMap.set(element.airportId, element.name);
          });

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
        'MMMM Do YYYY, h:mm a'
      );
      flight.arriveAirport = this.airportsMap.get(flight.arriveId);
      flight.departAirport = this.airportsMap.get(flight.departId);
    });
  }

  changePaginationCount() {
    this.filterMetadata.count = this.flights.length;
  }

  bookFlight() {
    console.log("booking()");
    let booking: any;
    this.stripe.createToken(this.card, {}).subscribe((result) => {
      if (result.token) {
        booking = {
          travelerId: this.user.userId,
          flightId: this.selectedFlight.flightId,
          bookerId: this.user.userId,
          active: true,
          stripeId: result.token.id,
        };
        this.travelerService
        .post(environment.travelerBackendUrl + environment.bookingUri, booking)
        .subscribe(
          () => {
            this.modalService.dismissAll();
            this.flights = this.flights.filter(
              (flight) => flight !== this.selectedFlight
            );
          },
          (error) => {
            this.modalService.dismissAll();
            alert('Error booking ticket: Status ' + error.error.status);
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
    this.card.mount('#card');
  }
}
