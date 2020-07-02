import { Component, OnInit } from "@angular/core";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { error } from "protractor";

@Component({
  selector: "app-counter-create-traveler",
  templateUrl: "./counter-create-traveler.component.html",
  styleUrls: ["./counter-create-traveler.component.css"],
})
export class CounterCreateTravelerComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  constructor(
    private httpService: CounterHttpService,
    private dataService: CounterDataService
  ) {}

  ngOnInit() {}

  createTraveler() {
    const traveler = {
      name: this.form.value.name,
      username: this.form.value.username,
      password: this.form.value.password,
      role: "TRAVELER",
    };
    this.httpService
      .post(environment.counterUrl + environment.counterCreateUserUri, traveler)
      .subscribe(
        (result) => this.dataService.setTraveler(result.body),
        (error) =>
          alert("Error creating traveler: Status " + error.error.status)
      );
  }
}
