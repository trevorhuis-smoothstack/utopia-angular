import { Component, OnInit, Input } from '@angular/core';
import { TravelerService } from 'src/app/common/s/service/traveler.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { StripeService } from 'ngx-stripe';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  @Input() user: any;
  @Input() airports: any;
  bookings: any[];
  airportsMap: Map<number, string>;

  constructor(private service: TravelerService, private stripe: StripeService) { }

  ngOnInit() {
    this.airportsMap = new Map();
    this.bookings = new Array();

    this.loadBookings();

    this.stripe.setKey(
      "pk_test_51GvUChBYMFlMJbBRvrWM7yZJHJhVExdReQ2A5K0uaKTidkmqRcnY48fr6VmnK9csVNOwkiH0xetgz36Gcvql6IF20098oe4tpg"
    );
  }


  loadBookings() {
    this.service
    .get(
      `${environment.travelerBackendUrl}${environment.bookingsUri}/${this.user.userId}`
    )
    .subscribe((result: any[]) => {
      result.forEach((booking: any) => {

        this.service.get(
          `${environment.travelerBackendUrl}${environment.travelersUri}/${booking.travelerId}`
        ).subscribe((result: any) => {
          booking.name = this.user.name;

          this.service.get(
            `${environment.travelerBackendUrl}${environment.flightsUri}/${booking.flightId}`
          ).subscribe((result: any) => {
            booking.flight = result;

            this.airports.forEach((element) => {
              this.airportsMap.set(element.airportId, element.name);
            });

            booking.flight.arriveAirport = this.airportsMap.get(booking.flight.arriveId);
            booking.flight.departAirport = this.airportsMap.get(booking.flight.departId);

            booking.flight.departTimeFormatted = moment(booking.flight.departTime).format(
              'MMMM Do YYYY, h:mm a'
            );

            this.bookings.push(booking);
        });

        });

      });
    });
  }

  cancelFlight(booking) {
    this.service
      .put(`${environment.travelerBackendUrl}${environment.bookingsUri}`, booking)
      .subscribe(
        (res) => {
          this.bookings.splice(this.bookings.indexOf(booking), 1);
        },
        (error) => {
          alert(error);
        }
      );
  }

}
