import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-counter-booking",
  templateUrl: "./counter-booking.component.html",
  styleUrls: ["./counter-booking.component.css"],
})
export class CounterBookingComponent implements OnInit {
  counter = this.dataService.getCounter();
  traveler: any;
  airports: any[];
  flights: any[];
  departAirport: any;
  arriveAirport: any;

  constructor(
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
      (traveler: any) => (this.traveler = traveler),
      () => alert("Booking: Error getting traveler")
    );
    this.httpService
      .get(environment.counterUrl + environment.counterAirportUri)
      .subscribe(
        (result: any[]) => (this.airports = result),
        (error: any) =>
          alert("Error getting airports: Status " + error.error.status)
      );
  }

  getFlights() {
    debugger;
    this.httpService
      .get(
        `${environment.counterUrl}${environment.counterFlightUri}/departure/${this.departAirport.airportId}/arrival/${this.arriveAirport.airportId}/traveler/${this.traveler.userId}`
      )
      .subscribe(
        (result: any[]) => (this.flights = result),
        (error: any) =>
          alert("Error getting flights: Status " + error.error.status)
      );
  }

  getFlightsIf(condition: any) {
    if (condition) this.getFlights();
  }

  getAirportName(airportId: number) {
    return this.airports.find((airport) => airport.airportId === airportId)
      .name;
  }
}
