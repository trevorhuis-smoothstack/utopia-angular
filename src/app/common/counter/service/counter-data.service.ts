import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CounterDataService {
  counter: any;
  traveler: any;

  constructor() {}

  private travelerSource = new Subject<any>();

  travelerObservable = this.travelerSource.asObservable();

  getCounter() {
    return this.counter;
  }

  setCounter(counter: any) {
    this.counter = counter;
  }

  getTraveler() {
    return this.traveler;
  }

  setTraveler(traveler: any) {
    this.traveler = traveler;
    this.travelerSource.next(traveler);
  }
}
