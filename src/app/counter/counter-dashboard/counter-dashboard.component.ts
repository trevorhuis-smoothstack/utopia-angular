import { Component, OnInit } from "@angular/core";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-counter-dashboard",
  templateUrl: "./counter-dashboard.component.html",
  styleUrls: ["./counter-dashboard.component.css"],
})
export class CounterDashboardComponent implements OnInit {
  name: string = localStorage.getItem("name");
  authorized: boolean = false;

  constructor(
    private httpService: CounterHttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.httpService
      .get(environment.counterUrl + environment.counterCheckAuthUri)
      .subscribe(
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
    this.router.navigate(["/counter/login"]);
  }
}
