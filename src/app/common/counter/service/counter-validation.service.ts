import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class CounterValidationService {
  constructor() {}

  errorsDirty(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].dirty;
  }
}
