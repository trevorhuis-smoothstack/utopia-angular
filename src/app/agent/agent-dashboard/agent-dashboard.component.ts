import {
  Component,
  OnInit
} from '@angular/core';
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { AgentAuthService } from "src/app/common/h/service/AgentAuthService";
import { Router } from "@angular/router";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Agent } from '../entities/Agent';

@Component({
  selector: "app-agent-dashboard",
  templateUrl: "./agent-dashboard.component.html",
  styleUrls: ["./agent-dashboard.component.css"],
})
export class AgentDashboardComponent implements OnInit {
  selectTravelerForm = new FormGroup({
    username: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
  });

  createTravelerForm = new FormGroup({
    name: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    username: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    passwordCheck: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
  });

  creditCardForm = new FormGroup({
    cardNumber: new FormControl('', [<any>Validators.required]),
    expMonth: new FormControl('', [<any>Validators.required]),
    expYear: new FormControl('', [<any>Validators.required]),
    cvc: new FormControl('', [<any>Validators.required]),
  });

  createTraveler: any;
  usernameTaken: any;
  traveler: any;
  flights: any;
  airports: any;
  airportsMap: Map<Number, String>;
  bookings: any;
  bookFlightPage: any;
  cancelFlightPage: any;
  agent: any;
  username: any;
  invalidLogin: any;
  customPrice: number;
  minValue: number;
  maxValue: number;
  selectedFlight: any;

  // Date Picker
  date: NgbDateStruct;
  
  // Pagination
  page = 1;
  pageSize = 10;
  filterMetadata = { count: 0 };

  constructor(
    private service: AgentUtopiaService,
    private authService: AgentAuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.createSelectTravelerForm;
  }

  ngOnInit() {
    document.getElementById("nav-agent").classList.add("active");
    this.agent = {
      username: localStorage.getItem("username"),
    }

    if (this.agent.username == null) {
      this.router.navigate(["/agent/login"]);
      return;
    }
  
    this.airportsMap = new Map();

    this.loadAirports();
    this.loadFlights();
    this.loadAgent();
    
    this.bookFlightPage = true;
    this.cancelFlightPage = false;

    this.createTraveler = false;

    //slider
    this.customPrice = 100;
    this.minValue = 1;
    this.maxValue = 100;

    this.creditCardForm = this.formBuilder.group({
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvc: ''
    })

  }
  // *************************
  // INITIALIZE THE DASHBOARD
  // *************************

  loadAgent() {
    this.service
      .get(
        `${environment.agentBackendUrl}${environment.usernameUri}/${this.agent.username}`
      )
      .subscribe((result: Agent) => {
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
          input.flight.departTimeFormatted = moment(input.flight.departTime).format(
            "MMMM Do YYYY, h:mm a"
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

          this.formatFlights();
          this.changePaginationCount()
    
        },
        (error) => {
          alert(error);
        }
      )
  }

  formatFlights() {
    this.flights.forEach((element) => {
      element.departTimeFormatted = moment(element.departTime).format(
        "MMMM Do YYYY, h:mm a"
      );
      element.airportDepart = this.airports.find(
        (record) => record.airportId === element.departId
      ).name;
      element.airportArrive = this.airports.find(
        (record) => record.airportId === element.arriveId
      ).name;
    });
  }

  // *************************
  // END INITIALIZE THE DASHBOARD
  // *************************

  // *************************
  // SELECT A TRAVELER
  // *************************

  createSelectTravelerForm() {
    this.selectTravelerForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  checkTraveler() {
    let travelerBody = {
      name: " ",
      username: this.selectTravelerForm.value.username,
      password: " ",
      role: "TRAVELER"
    }

    this.service.get(`${environment.agentBackendUrl}${environment.usernameUri}/${travelerBody.username}`).subscribe(
      (result: any) => {
        if (result != null) {
          this.traveler = result;
          return;
        } 

        this.invalidLogin = true;

        },(error) => {
          alert(error)
        });
  }

  setupCreateTraveler() {
    this.createTraveler = true;

    this.createTravelerForm = this.formBuilder.group({
      name: '',
      username: '',
      password: ''
    })
  }

  createNewTraveler() {
    let travelerBody = {
      name: this.createTravelerForm.value.name,
      username: this.createTravelerForm.value.username,
      password: this.createTravelerForm.value.password,
      role: "TRAVELER"
    };

    this.service.get(`${environment.agentBackendUrl}${environment.usernameUri}/${travelerBody.username}`).subscribe(
      (result: any) => {
        if (result != null) {
          this.usernameTaken = true;
          return;
        };

        this.service.post(`${environment.agentBackendUrl}${environment.userUri}`, travelerBody).subscribe(
          (result: any) => {
            this.traveler = result;
            this.createTraveler = false;
          }, (error => {
            alert(error);
          })
        )
      },
      (error) => {
        alert(error);
      }
    )
  }

  // *************************
  // END SELECT A TRAVELER
  // *************************

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
    this.loadFlights();
    this.changeBookFlightClass();
  }

  bookFlight() {
    
    let booking = {
      active: true,
      flightId: this.selectedFlight.flightId,
      bookerId: this.agent.userId,
      travelerId: this.traveler.userId,
      stripeId: null,
    };


    (<any>window).Stripe.card.createToken(
      {
        number: this.creditCardForm.value.cardNumber,
        exp_month: this.creditCardForm.value.expMonth,
        exp_year: this.creditCardForm.value.expYear,
        cvc: this.creditCardForm.value.cvc,
      },
      (status: number, response: any) => {
        if (status === 200) {
          let token = response.id;
          booking.stripeId = token;

          console.log(booking);
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

  openCancelBooking() {
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
    this.loadAgent();  
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

  newTraveler() {
    this.traveler = null;
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

  changePaginationCount() {
    this.filterMetadata.count = this.flights.length;
  }

  // **********************************************
  // Book flight modal
  // **********************************************

  initializeBookFlightForm(flight: any) {
    let booking = {
      active: true,
      flightId: flight.flightId,
      bookerId: this.traveler.bookerId,
      travelerId: this.traveler.travelerId,
      stripeId: null,
    };

  }

  openBookFlightModal(modal: any, flight: any) {
    this.selectedFlight = flight;
    this.initializeBookFlightForm(flight);
    this.modalService.open(modal);
  }

}