import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { maxLength } from "src/app/common/counter/counter-globals";

@Component({
  selector: "app-counter-select-traveler",
  templateUrl: "./counter-select-traveler.component.html",
  styleUrls: ["./counter-select-traveler.component.css"],
})
export class CounterSelectTravelerComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.maxLength(maxLength),
    ]),
  });

  constructor(
    private router: Router,
    private httpService: CounterHttpService,
    private dataService: CounterDataService,
  ) {}

  ngOnInit() {}

  getTraveler(username: string) {
    this.httpService
      .get(environment.counterUrl + environment.counterGetUserUri + username)
      .subscribe(
        (result) => {
          this.dataService.newTraveler(result);
          this.router.navigate(["/counter"]);
        },
        (error) => alert("Error getting traveler: Status " + error.error.status)
      );
  }

  errorsDirty(field: string) {
    return this.form.controls[field].errors && this.form.controls[field].dirty;
  }
}
