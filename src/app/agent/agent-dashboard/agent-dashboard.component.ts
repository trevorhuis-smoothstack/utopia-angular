import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { AgentAuthService } from "src/app/common/h/service/AgentAuthService";
import { Router } from "@angular/router";
import * as moment from "moment";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-agent-dashboard",
  templateUrl: "./agent-dashboard.component.html",
  styleUrls: ["./agent-dashboard.component.css"],
})
export class AgentDashboardComponent implements OnInit {
  traveler: any;
  flights: any;
  airports: any;
  airportsMap: Map<Number, String>;
  bookings: any;
  username: any;
  bookFlightPage: any;
  cancelFlightPage: any;
  agent: any;

  constructor(
    private http: HttpClient,
    private service: AgentUtopiaService,
    private authService: AgentAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    document.getElementById("nav-agent").classList.add("active");
    this.username = localStorage.getItem("username");
    this.airportsMap = new Map();

    this.loadAirports();
    this.loadFlights();
    this.loadAgent();
    
    this.bookFlightPage = true;
    this.cancelFlightPage = false;
  }

  ngOnDestroy() {
    document.getElementById("nav-agent").classList.remove("active");
  }

  loadAgent() {
    this.service
      .get(
        `${environment.agentBackendUrl}${environment.usernameUri}/${this.username}`
      )
      .subscribe((result) => {
        this.agent = result;

        this.service
          .get(
            `${environment.agentBackendUrl}${environment.bookingsUri}/${this.agent.userId}`
          )
          .subscribe(
            (result) => {
              this.bookings = result;

              this.bookings.forEach((element) => {
                element = this.processBooking(element);
              });
            },
            (error) => {
              alert(error);
            }
          );
      });
  }

  processBooking(booking) {
    booking.name = this.setTravelerName(booking);
    booking.flight = this.setFlight(booking);
  }

  setTravelerName(input: any) {
    this.service
      .get(
        `${environment.agentBackendUrl}${environment.userIdUri}/${input.travelerId}`
      )
      .subscribe(
        (result: any) => {
          input.name = result.name;
        },
        (error: any) => {
          input.name = "(error retrieving traveler name)";
          // do something with logger here
        }
      );
  }

  setAirports(input: any) {
    input.arriveAirport = this.airportsMap.get(input.flight.arriveId);
    input.departAirport = this.airportsMap.get(input.flight.departId);
  }

  setFlight(input: any) {
    this.service
      .get(
        `${environment.agentBackendUrl}${environment.flightUri}/${input.flightId}`
      )
      .subscribe(
        (result: any) => {
          input.flight = result;

          this.setAirports(input);
          input.flight.departTime = moment(input.flight.departTime).format(
            "MMMM Do YYYY, h:mm:ss a"
          )
        },
        (error: any) => {
          input.flight = "(error retrieving arrive airport name)";
          // do something with logger here
        }
      );
  }

  loadAirports() {
    this.service.get(`${environment.agentBackendUrl}${environment.airportsUri}`).subscribe(result => {
      this.airports = result;

      this.airports.forEach(element => {
        this.airportsMap.set(element.airportId, element.name);
      });
    }),
    (error => {
      alert(error);
    })
  }

  loadFlights() {
    this.service
      .get(`${environment.agentBackendUrl}${environment.flightsUri}`)
      .subscribe(
        (res) => {
          this.flights = res;

          this.service
            .get(`${environment.agentBackendUrl}${environment.airportsUri}`)
            .subscribe(
              (res) => {
                this.airports = res;

                this.formatFlights();
              },
              (error) => {
                alert(error);
              }
            );
        },
        (error) => {
          alert(error);
        }
      )
      .add();
  }

  formatFlights() {
    this.flights.forEach((element) => {
      element.departTime = moment(element.departTime).format(
        "MMMM Do YYYY, h:mm:ss a"
      );
      element.airportDepart = this.airports.find(
        (record) => record.airportId === element.departId
      ).name;
      element.airportArrive = this.airports.find(
        (record) => record.airportId === element.arriveId
      ).name;
    });
  }

  // Book Flight

  openBookFlight() {
    // Change sidebar classes
    if (
      document
        .getElementById("agent-book-flight")
        .classList.contains("side-link-active")
    )
      return;
    if (
      document
        .getElementById("agent-cancel-flight")
        .classList.contains("side-link-active")
    )
      this.changeCancelFlightClass();
    this.changeBookFlightClass();
  }

  bookFlight(flight) {
    let booking = {
      active: true,
      flightId: flight.flightId,
      bookerId: this.traveler.bookerId,
      travelerId: this.traveler.travelerId,
      stripeId: null,
    };

    let form = document.getElementsByTagName("form")[0];
    (<any>window).Stripe.card.createToken(
      {
        number: form.cardNumber.value,
        exp_month: form.expMonth.value,
        exp_year: form.expYear.value,
        cvc: form.cvc.value,
      },
      (status: number, response: any) => {
        if (status === 200) {
          let token = response.id;
          booking.stripeId = token;

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

  // Cancel flight

  openCancelFlight() {
    // Change sidebar classes
    if (
      document
        .getElementById("agent-cancel-flight")
        .classList.contains("side-link-active")
    )
      return;
    if (
      document
        .getElementById("agent-book-flight")
        .classList.contains("side-link-active")
    )
      this.changeBookFlightClass();
    this.changeCancelFlightClass();
  }

  cancelFlight(booking) {
    this.service
      .put(`${environment.agentBackendUrl}${environment.bookingUri}`, booking)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          alert(error);
        }
      );
  }

  // Logout

  logout() {
    this.authService.logout();
    this.router.navigate(["/agent/login"]);
  }

  // Aesthetics
  changeCancelFlightClass() {
    document
      .getElementById("agent-cancel-flight")
      .classList.toggle("side-link-active");
    if (this.cancelFlightPage === true) {
      this.cancelFlightPage = false;
    } else if (this.cancelFlightPage === false) {
      this.cancelFlightPage = true;
      this.bookFlightPage = false;
    }
  }

  changeBookFlightClass() {
    document
      .getElementById("agent-book-flight")
      .classList.toggle("side-link-active");
    if (this.bookFlightPage === true) {
      this.bookFlightPage = true;
    } else if (this.bookFlightPage === false) {
      this.bookFlightPage = true;
    }
  }
}
