import { Component, OnInit } from "@angular/core";
import { CounterAuthService } from "src/app/common/counter/service/counter-auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.css"],
})
export class CounterComponent implements OnInit {
  authorized: boolean = false;

  constructor(
    private router: Router,
    private authService: CounterAuthService
  ) {}

  ngOnInit() {
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
  }

  startBook() {
    document.getElementById("cancel").classList.remove("side-link-active");
    document.getElementById("book").classList.add("side-link-active");
  }

  startCancel() {
    document.getElementById("book").classList.remove("side-link-active");
    document.getElementById("cancel").classList.add("side-link-active");
  }
}
