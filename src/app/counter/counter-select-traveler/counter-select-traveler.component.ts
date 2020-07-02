import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-counter-select-traveler",
  templateUrl: "./counter-select-traveler.component.html",
  styleUrls: ["./counter-select-traveler.component.css"],
})
export class CounterSelectTravelerComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl("", [<any>Validators.required]),
  });

  constructor() {}

  ngOnInit() {}
}
