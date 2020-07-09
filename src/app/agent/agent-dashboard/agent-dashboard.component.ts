import { Component, OnInit, HostListener } from "@angular/core";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { AgentAuthService } from "src/app/common/h/service/AgentAuthService";
import { Router } from "@angular/router";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  NgForm,
} from "@angular/forms";
import { NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Agent } from "../../common/entities/Agent";
import { Traveler } from "../../common/entities/Traveler";
import { ToastsService } from 'src/app/common/s/service/toasts.service';

@Component({
  selector: "app-agent-dashboard",
  templateUrl: "./agent-dashboard.component.html",
  styleUrls: ["./agent-dashboard.component.css"],
})
export class AgentDashboardComponent implements OnInit {
  traveler: any;
  airports: any;
  airportsMap: Map<number, string>;
  bookFlightPage: any;
  cancelFlightPage: any;
  agent: any;
  username: any;
  mobile: boolean;

  constructor(
    private service: AgentUtopiaService,
    private authService: AgentAuthService,
    private modalService: NgbModal,
    private router: Router,
    private toastService: ToastsService
  ) {}

  ngOnInit() {
    document.getElementById("nav-agent").classList.add("active");
    this.agent = {
      username: localStorage.getItem("username"),
    };

    if (this.agent.username == null) {
      this.router.navigate(["/agent/login"]);
      return;
    }

    this.airportsMap = new Map();

    this.loadAirports();
    this.loadAgent();

    this.bookFlightPage = true;
    this.cancelFlightPage = false;

    this.adjustForMobile(window.innerWidth);
  }

  // RESPONSIVE DESIGN
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.adjustForMobile(event.target.innerWidth);
  }

  adjustForMobile(width) {
    if(width < 992) {
      this.mobile = true;
      this.moveSidebarToNav();
    } else if (width > 992){
      this.mobile = false;
    }
  }

  moveSidebarToNav() {
    let nav = document.getElementById("navbar-utopia");
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/agent/login"]);
  }

  openLogoutModal(modal: any) {
    this.modalService.open(modal);
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
        `${environment.agentBackendUrl}${environment.agentUsernameUri}/${this.agent.username}`
      )
      .subscribe((result: Agent) => {
        this.agent.name = result.name;
        this.agent.userId = result.userId;
      },
      (error) =>{
        this.toastService.showError("We are having an error reading your information. Please try again later or call IT if the problem continues.", "Internal Error");
      });
  }

  loadAirports() {
    this.service
      .get(`${environment.agentBackendUrl}${environment.agentAirportsUri}`)
      .subscribe((result) => {
        this.airports = result;

        this.airports.forEach((element) => {
          this.airportsMap.set(element.airportId, element.name);
        });
      }),
      (error) => {
        this.toastService.showError("We are having an error reading flight information. Please try again later or call IT if the problem continues.", "Internal Error");
      };
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
