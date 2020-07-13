import { Component, OnInit } from "@angular/core";
import { CounterAuthService } from "src/app/common/counter/service/counter-auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { uncheckedErrorMessage } from "src/app/common/counter/counter-globals";

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
    private toastr: ToastrService,
    private dataService: CounterDataService,
    private authService: CounterAuthService
  ) {}

  ngOnInit() {
    this.counter = this.dataService.getCounter();
    this.authService.checkAuth().subscribe(
      () => {
        this.authorized = true;
      },
      (error) => {
        if (![401, 403, 500].includes(error.error.status))
          this.toastr.error(
            uncheckedErrorMessage,
            "Error checking authorization: Status " + error.error.status
          );
        this.router.navigate(["/counter/login"]);
      }
    );
    this.dataService.travelerObservable.subscribe((traveler) => {
      this.traveler = traveler;
    });
  }

  logOut() {
    localStorage.removeItem("token");
    this.dataService.setCounter(null);
  }

}
