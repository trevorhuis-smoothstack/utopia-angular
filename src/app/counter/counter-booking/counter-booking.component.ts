import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { environment } from "src/environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Elements, Element, StripeService } from "ngx-stripe";
import { uncheckedErrorMessage } from "src/app/common/counter/counter-globals";

@Component({
  selector: "app-counter-booking",
  templateUrl: "./counter-booking.component.html",
  styleUrls: ["./counter-booking.component.css"],
})
export class CounterBookingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  currentPage = 1;
  rowsPerPage = 10;
  minDate: any;
  maxDate: any;
  minPrice = 0;
  maxPrice = 10000;
  customPrice = 10000;
  elements: Elements;
  card: Element;
  counter = this.dataService.getCounter();
  traveler: any;
  airports: any[];
  departAirport: any;
  arriveAirport: any;
  flights: any[];
  flight: any;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private stripe: StripeService,
    private httpService: CounterHttpService,
    private dataService: CounterDataService
  ) {}

  ngOnInit() {
    this.traveler = this.dataService.getTraveler();
    if (!this.traveler) {
      this.router.navigate(["/counter/traveler"]);
      return;
    }
    this.dataService.travelerObservable.subscribe(
      (traveler: any) => (this.traveler = traveler)
    );
    this.httpService
      .get(environment.counterUrl + environment.counterAirportUri)
      .subscribe(
        (result: any[]) => (this.airports = result),
        (error: any) =>
          this.toastr.error(
            uncheckedErrorMessage,
            "Error getting airports: Status " + error.error.status
          )
      );
    this.stripe.setKey(
      "pk_test_51GwErbJwa8c7tq3ON61IURqOXTi3Lcqlyx7wBTUR0ClnuHPjOMhLZqJhxG0nFwq04Svaxa6p768cb1Mg8IF6NO2n00TlRmCn9i"
    );
    this.stripe.elements().subscribe((elements) => {
      this.card = elements.create("card", {});
    });
  }

  ngAfterViewInit() {
    let sideLink: HTMLElement;
    if ((sideLink = document.getElementById("cancel")))
      sideLink.classList.remove("side-link-active");
    if ((sideLink = document.getElementById("book")))
      sideLink.classList.add("side-link-active");
  }

  ngOnDestroy() {
    let sideLink: HTMLElement;
    if ((sideLink = document.getElementById("book")))
      sideLink.classList.remove("side-link-active");
  }

  getFlights() {
    this.httpService
      .get(
        `${environment.counterUrl}${environment.counterBookableUri}/departure/${this.departAirport.airportId}/arrival/${this.arriveAirport.airportId}/traveler/${this.traveler.userId}`
      )
      .subscribe(
        (result: any[]) => (this.flights = result),
        (error: any) =>
          this.toastr.error(
            uncheckedErrorMessage,
            "Error getting flights: Status " + error.error.status
          )
      );
  }

  getFlightsIf(condition: any) {
    if (condition) this.getFlights();
  }

  getAirportName(airportId: number) {
    return this.airports.find((airport) => airport.airportId === airportId)
      .name;
  }

  getCurrentDate() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }

  openBookingModal(flight: any, modal: any) {
    this.flight = flight;
    this.modalService.open(modal);
    this.card.mount("#card");
  }

  book() {
    let booking: any;
    this.stripe.createToken(this.card, {}).subscribe((result) => {
      if (result.token) {
        booking = {
          travelerId: this.traveler.userId,
          flightId: this.flight.flightId,
          bookerId: this.counter.userId,
          active: true,
          stripeId: result.token.id,
        };
        this.httpService
          .post(environment.counterUrl + environment.counterBookUri, booking)
          .subscribe(
            () => {
              this.modalService.dismissAll();
              this.toastr.success("Ticket booked", "Success");
              this.flights = this.flights.filter(
                (flight) => flight !== this.flight
              );
            },
            (error) => {
              this.toastr.error(
                uncheckedErrorMessage,
                "Error booking ticket: Status " + error.error.status
              );
            }
          );
      } else if (result.error) {
        this.toastr.error(
          uncheckedErrorMessage,
          "Error processing payment: Token creation failed."
        );
      }
    });
  }
}
