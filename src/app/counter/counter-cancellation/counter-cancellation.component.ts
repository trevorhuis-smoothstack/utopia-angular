import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-counter-cancellation",
  templateUrl: "./counter-cancellation.component.html",
  styleUrls: ["./counter-cancellation.component.css"],
})
export class CounterCancellationComponent
  implements OnInit, AfterViewInit, OnDestroy {
  currentPage = 1;
  rowsPerPage = 10;
  minDate: any;
  maxDate: any;
  traveler: any;
  airports: any[];
  flights: any[];
  flight: any;

  constructor(
    private modalService: NgbModal,
    private router: Router,
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
          alert("Error getting airports: Status " + error.error.status)
      );
    this.httpService
      .get(
        environment.counterUrl +
          environment.counterCancellablyBookedUri +
          this.traveler.userId
      )
      .subscribe(
        (result: any[]) => (this.flights = result),
        (error: any) =>
          alert("Error getting flights: Status " + error.error.status)
      );
    debugger;
  }

  ngAfterViewInit() {
    document.getElementById("book").classList.remove("side-link-active");
    document.getElementById("cancel").classList.add("side-link-active");
  }

  ngOnDestroy() {
    document.getElementById("cancel").classList.remove("side-link-active");
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

  openCancellationModal(flight: any, modal: any) {
    this.flight = flight;
    this.modalService.open(modal);
  }

  cancel() {
    this.httpService
      .put(
        `${environment.counterUrl}${environment.counterCancelUri}/traveler/${this.traveler.userId}/flight/${this.flight.flightId}`
      )
      .subscribe(
        () => {
          this.modalService.dismissAll();
          alert("Ticket cancelled");
          this.flights = this.flights.filter(
            (flight) => flight !== this.flight
          );
        },
        () => {
          this.modalService.dismissAll();
          alert("Error cancelling ticket");
        }
      );
  }
}
