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

  createTraveler: any;
  usernameTaken: any;
  traveler: any;
  airports: any;
  airportsMap: Map<Number, String>;
  bookFlightPage: any;
  cancelFlightPage: any;
  agent: any;
  username: any;
  invalidLogin: any;

  constructor(
    private service: AgentUtopiaService,
    private authService: AgentAuthService,
    private router: Router,
    private formBuilder: FormBuilder,
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
    this.loadAgent();
    
    this.bookFlightPage = true;
    this.cancelFlightPage = false;

    this.createTraveler = false;
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
        this.agent.name = result.name;
        this.agent.userId = result.userId;
      });
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
    this.changeBookFlightClass();
  }

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
    this.changeCancelFlightClass();
    
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
}