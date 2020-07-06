import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TravelerService } from 'src/app/common/s/service/traveler.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {

  @Input() user: any;
  @Input() airports: any;

  airportsMap: Map<number, string>;
  flights: any;
  selectedFlight: any;
  date: NgbDateStruct;
  flightButtonText = 'My Flights';

  // Slider
  customPrice = 100;
  minValue = 1;
  maxValue = 100;

  // Pagination
  page = 1;
  pageSize = 10;
  filterMetadata = { count: 0 };


  creditCardForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required as any]),
    expMonth: new FormControl('', [Validators.required as any]),
    expYear: new FormControl('', [Validators.required as any]),
    cvc: new FormControl('', [Validators.required as any]),
  });


  constructor(
    private travelerService: TravelerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
    ) { }

  ngOnInit() {
    this.creditCardForm = this.formBuilder.group({
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvc: '',
    });

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
    const booking = {
      active: true,
      flightId: this.selectedFlight.flightId,
      bookerId: this.user.userId,
      travelerId: this.user.userId,
      stripeId: null,
    };


    (window as any).Stripe.card.createToken(
      {
        number: this.creditCardForm.value.cardNumber,
        exp_month: this.creditCardForm.value.expMonth,
        exp_year: this.creditCardForm.value.expYear,
        cvc: this.creditCardForm.value.cvc,
      },
      (status: number, response: any) => {
        if (status === 200) {
          const token = response.id;
          booking.stripeId = token;

          this.travelerService
            .post(
              `${environment.travelerBackendUrl}${environment.bookingUri}`,
              booking
            )
            .subscribe(
              (res) => {
                // TODO: create toast to notify success
                // reload the list of flights
              },
              (error) => {
                // TODO: create toast to notify failure.
                alert(error);
              }
            );
        } else {
          alert(response.error.message);
        }
      }
    );
  }

  openBookFlightModal(modal: any, flight: any) {
    this.selectedFlight = flight;
    this.modalService.open(modal);
  }
}
