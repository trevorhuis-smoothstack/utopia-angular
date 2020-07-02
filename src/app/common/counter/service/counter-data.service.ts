import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class CounterDataService {
  counter: any;

  constructor() {}

  private travelerSource = new Subject<any>();

  travelerObservable = this.travelerSource.asObservable();

  setCounter(counter: any) {
    this.counter = counter;
  }

  getCounter() {
    return this.counter;
  }

  newTraveler(traveler: any) {
    this.travelerSource.next(traveler);
  }
}
