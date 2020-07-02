import { Component, OnInit } from "@angular/core";
import { CounterAuthService } from "src/app/common/counter/service/counter-auth.service";
import { Router } from "@angular/router";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.css"],
})
export class CounterComponent implements OnInit {
  authorized: boolean = false;
  counter: any;
  traveler: any;

  constructor(
    private router: Router,
    private dataService: CounterDataService,
    private authService: CounterAuthService
  ) {}

  ngOnInit() {
    this.counter = this.dataService.getCounter();
    this.dataService.travelerObservable.subscribe(
      (traveler) => (this.traveler = traveler)
    );
    this.authService.checkAuth().subscribe(
      () => (this.authorized = true),
      (error) => {
        if (![401, 403].includes(error.error.status))
          alert("Error checking authorization: Status " + error.error.status);
        this.router.navigate(["/counter/login"]);
      }
    );
  }

  logOut() {
    localStorage.removeItem("token");
    this.dataService.setCounter(null);
  }

  startBook() {
    document.getElementById("cancel").classList.remove("side-link-active");
    document.getElementById("book").classList.add("side-link-active");
  }

  startCancel() {
    document.getElementById("book").classList.remove("side-link-active");
    document.getElementById("cancel").classList.add("side-link-active");
  }

  resetLinks() {
    document.getElementById("book").classList.remove("side-link-active");
    document.getElementById("cancel").classList.remove("side-link-active");
  }
}
