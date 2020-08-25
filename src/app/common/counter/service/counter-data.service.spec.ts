import { TestBed } from "@angular/core/testing";

import { CounterDataService } from "./counter-data.service";

describe("CounterDataService", () => {
  let service: CounterDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CounterDataService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set & get the counter attendant", () => {
    const mockCounter = {
      userId: 1,
      name: "Mock Counter",
      username: "MockCounter",
      password: null,
      role: "COUNTER",
    };
    expect(service.getCounter()).toBeFalsy();
    service.setCounter(mockCounter);
    expect(service.getCounter()).toEqual(mockCounter);
  });

  it("should set & get the traveler", () => {
    const mockTraveler = {
      userId: 1,
      name: "Mock Traveler",
      username: "MockTraveler",
      password: null,
      role: "TRAVELER",
    };
    let traveler: any;
    service.travelerObservable.subscribe(
      (thisTraveler) => (traveler = thisTraveler)
    );
    expect(traveler).toBeFalsy()
    expect(service.getTraveler()).toBeFalsy();
    service.setTraveler(mockTraveler);
    expect(service.getTraveler()).toEqual(mockTraveler);
    expect(traveler).toEqual(mockTraveler);
  });
});
