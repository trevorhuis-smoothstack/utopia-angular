import { Component, OnInit } from "@angular/core";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import {
  maxLength,
  uncheckedErrorMessage,
} from "src/app/common/counter/counter-globals";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-counter-create-traveler",
  templateUrl: "./counter-create-traveler.component.html",
  styleUrls: ["./counter-create-traveler.component.css"],
})
export class CounterCreateTravelerComponent implements OnInit {
  maxLength = maxLength;
  form = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(maxLength),
      ]),
      username: new FormControl(
        null,
        [Validators.required, Validators.maxLength(maxLength)],
        this.validateUsername.bind(this)
      ),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null),
    },
    { validators: this.validatePasswordMatch }
  );

  constructor(
    private toastr: ToastrService,
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
          this.toastr.error(
            uncheckedErrorMessage,
            "Error creating traveler: Status " + error.error.status
          )
      );
  }

  validateUsername(control: AbstractControl) {
    return this.httpService
      .getFull(
        environment.counterUrl + environment.counterUsernameUri + control.value
      )
      .pipe(
        map((response) =>
          response.status === 204 ? { validateUsername: true } : null
        ),
        catchError(() => of(null))
      );
  }

  validatePasswordMatch(form: FormGroup) {
    // debugger;
    return form.value.password === form.value.confirmPassword
      ? null
      : { validatePasswordMatch: true };
  }

  errorsDirty(field: string) {
    return this.form.controls[field].errors && this.form.controls[field].dirty;
  }
}
