import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  maxLength,
  uncheckedErrorMessage,
} from "src/app/common/counter/counter-globals";
import { of } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Component({
  selector: "app-counter-select-traveler",
  templateUrl: "./counter-select-traveler.component.html",
  styleUrls: ["./counter-select-traveler.component.css"],
})
export class CounterSelectTravelerComponent implements OnInit {
  maxLength = maxLength;
  form: FormGroup;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: CounterHttpService,
    private dataService: CounterDataService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(
        null,
        [Validators.required, Validators.maxLength(maxLength)],
        [this.validateTraveler.bind(this)]
      ),
    });
  }

  validateTraveler(control: AbstractControl) {
    return this.httpService
      .get(
        environment.counterUrl + environment.counterTravelerUri + control.value
      )
      .pipe(
        map(() => null),
        catchError((error) =>
          of(error.status === 404 ? { validateTraveler: true } : null)
        )
      );
  }

  getTraveler(username: string) {
    this.httpService
      .get(environment.counterUrl + environment.counterGetUserUri + username)
      .subscribe(
        (result) => {
          this.dataService.setTraveler(result);
          this.router.navigate(["/counter"]);
        },
        (error) =>
          this.toastr.error(
            uncheckedErrorMessage,
            "Error getting traveler: Status " + error.error.status
          )
      );
  }

  errorsDirty(field: string) {
    return this.form.controls[field].errors && this.form.controls[field].dirty;
  }
}
