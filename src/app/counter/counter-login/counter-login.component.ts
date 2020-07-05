import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CounterHttpService } from "../../common/counter/service/counter-http.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { CounterAuthService } from "src/app/common/counter/service/counter-auth.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";

@Component({
  selector: "app-counter-login",
  templateUrl: "./counter-login.component.html",
  styleUrls: ["./counter-login.component.css"],
})
export class CounterLoginComponent implements OnInit {
  form: FormGroup;
  authorized: boolean = true;
  badCreds: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: CounterHttpService,
    private authService: CounterAuthService,
    private dataService: CounterDataService
  ) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.authService.checkAuth().subscribe(
      () => this.router.navigate(["/counter"]),
      (error) => {
        if (![401, 403].includes(error.error.status))
          alert("Error checking authorization: Status " + error.error.status);
        this.authorized = false;
      }
    );
  }

  logIn() {
    const creds = this.form.value;
    this.httpService
      .post(environment.loginUrl, {
        username: creds.username,
        password: creds.password,
      })
      .subscribe(
        (loginResponse: any) => {
          localStorage.setItem(
            "token",
            loginResponse.headers.get("Authorization")
          );
          this.httpService
            .get(
              environment.counterUrl +
                environment.counterGetUserUri +
                creds.username
            )
            .subscribe(
              (response: any) => {
                localStorage.setItem("name", response.name);
                localStorage.setItem("userId", response.userId);
                this.dataService.setCounter(response);
                this.router.navigate(["/counter/traveler"]);
              },
              (getUserError) => {
                if (getUserError.error.status === 403) {
                  this.badCreds = true;
                  localStorage.removeItem("token");
                } else alert("error getting user");
              }
            );
        },
        (loginError) => {
          if (loginError.error.status === 401) this.badCreds = true;
          else alert("error logging in");
        }
      );
  }
}
