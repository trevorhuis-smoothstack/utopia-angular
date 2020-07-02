import { Component, OnInit } from "@angular/core";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

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

  createTraveler() {}
}
