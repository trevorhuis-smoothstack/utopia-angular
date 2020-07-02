import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CounterDataService {
  counter: any;
  traveler: any;

  constructor() {}

  setCounter(counter: any) {
    this.counter = counter;
  }

  getCounter() {
    return this.counter;
  }

  setTraveler(traveler: any) {
    this.traveler = traveler;
  }

  getTraveler() {
    return this.traveler;
  }
}
