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
import { Traveler } from '../entities/Traveler';

@Component({
  selector: "app-agent-dashboard",
  templateUrl: "./agent-dashboard.component.html",
  styleUrls: ["./agent-dashboard.component.css"],
})
export class AgentDashboardComponent implements OnInit {
  traveler: any;
  airports: any;
  airportsMap: Map<Number, String>;
  bookFlightPage: any;
  cancelFlightPage: any;
  agent: any;
  username: any;

  constructor(
    private service: AgentUtopiaService,
    private authService: AgentAuthService,
    private router: Router,
  ) {
    
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
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(["/agent/login"]);
  }

  newTraveler() {
    this.traveler = null;
  }

  onTravelerChange(traveler: Traveler) {
    this.traveler = traveler;
  }

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

  openBookFlight() {
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