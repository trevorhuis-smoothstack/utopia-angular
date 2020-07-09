import { Component, OnInit, Input } from '@angular/core';
import { TravelerService } from 'src/app/common/s/service/traveler.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from 'src/app/common/s/service/toasts.service';

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
  bookingToCancel: any;

  constructor(
    private toastsService: ToastsService,
    private service: TravelerService,
    private modalService: NgbModal
    ) { }

  ngOnInit() {
    this.airportsMap = new Map();
    this.bookings = new Array();

    this.loadBookings();
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

  cancelFlight() {
    this.service
      .put(`${environment.travelerBackendUrl}${environment.bookingsUri}`, this.bookingToCancel)
      .subscribe(
        (res) => {
          this.bookings.splice(this.bookings.indexOf(this.bookingToCancel), 1);
          this.toastsService.showSuccess('Trip canceled. We\'ll miss you', 'Done');
        },
        (error) => {
          this.toastsService.showError('problem canceling flight', 'Error');
        }
      );
  }

  openCancelModal(modal: any, booking: any) {
    this.bookingToCancel = booking;
    this.modalService.open(modal);
  }

}
