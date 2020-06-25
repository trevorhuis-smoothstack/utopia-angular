import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { AgentAuthService } from "src/app/common/h/service/AgentAuthService";
import { Router } from "@angular/router";

@Component({
  selector: "app-agent-dashboard",
  templateUrl: "./agent-dashboard.component.html",
  styleUrls: ["./agent-dashboard.component.css"],
})
export class AgentDashboardComponent implements OnInit {
  traveler: any;
  flights: any;
  airports: any;
  bookings: any;
  username: any;
  bookFlightPage: any;
  cancelFlightPage: any;
  user: any;

  constructor(
    private http: HttpClient,
    private service: AgentUtopiaService,
    private authService: AgentAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem("username");

    this.loadAgent();
    this.loadFlights();
    this.loadAirports();

    this.traveler = {
      active: true,
      bookerId: 1,
      travelerId: 2,
    };
  }

  loadAgent() {
    this.service
      .get("http://127.0.0.1:8083/agent/users/" + this.username)
      .subscribe(
        (res) => {
          this.user = res;

          this.service
            .get("http://127.0.0.1:8083/agent/bookings/" + this.user.userId)
            .subscribe(
              (res) => {
                this.bookings = res;
              },
              (error) => {
                alert(error);
              }
            );
        },
        (error) => {
          alert(error);
        }
      );
  }

  loadFlights() {
    this.service.get("http://127.0.0.1:8083/agent/flights").subscribe(
      (res) => {
        this.flights = res;
      },
      (error) => {
        alert(error);
      }
    );
  }

  loadAirports() {
    this.service.get("http://127.0.0.1:8083/agent/airports").subscribe(
      (res) => {
        this.airports = res;
      },
      (error) => {
        alert(error);
      }
    );
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
            .post("http://127.0.0.1:8083/agent/booking", booking)
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

  cancelFlight(booking) {
    console.log(booking);

    this.service.put("http://127.0.0.1:8083/agent/booking", booking).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        alert(error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/agent/login"]);
  }
}
