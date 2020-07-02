import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CounterDataService {
  counter: any;

  constructor() {}

  setCounter(counter: any) {
    this.counter = counter;
  }

  getCounter() {
    return this.counter;
  }
}
