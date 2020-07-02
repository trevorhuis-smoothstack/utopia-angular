import { Component, OnInit } from "@angular/core";
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

  constructor(
    private httpService: CounterHttpService,
    private dataService: CounterDataService
  ) {}

  ngOnInit() {
    this.traveler = this.dataService.getTraveler();
    this.dataService.travelerObservable.subscribe(
      (traveler: any) => (this.traveler = traveler),
      () => alert("Booking: Error getting traveler")
    );
    this.httpService
      .get(environment.counterUrl + environment.counterAirportUri)
      .subscribe(
        (result: any[]) => (this.airports = result),
        (error: any) => alert("Error getting airports: Status " + error.error.status)
      );
  }
}
