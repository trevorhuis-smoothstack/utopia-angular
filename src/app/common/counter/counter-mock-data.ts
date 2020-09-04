import { FormControl } from "@angular/forms";

export const mockToken = "Mock Token",
  mockUsername = "Mock Counter",
  mockPassword = "Mock Password",
  mockCounter = {
    userId: 1,
    name: "Mock Counter",
    username: "MockCounter",
    password: null,
    role: "COUNTER",
  },
  mockTraveler = {
    userId: 1,
    name: "Mock Traveler",
    username: "MockTraveler",
    password: null,
    role: "TRAVELER",
  },
  mockDepartAirport = {
    airportId: 1,
    name: "Mock Depart Airport",
  },
  mockArriveAirport = {
    airportId: 2,
    name: "Mock Arrive Airport",
  },
  mockFlight = {
    departId: 1,
    arriveId: 2,
    departTime: "2021-11-23T14:00:00.000+00:00",
    flightId: 1,
    price: 100,
    seatsAvailable: 20,
  },
  mockFlightTwo = {
    departId: 2,
    arriveId: 1,
    departTime: "2021-11-23T14:00:00.000+00:00",
    flightId: 2,
    price: 100,
    seatsAvailable: 20,
  },
  mockAirports = [mockDepartAirport, mockArriveAirport],
  mockControl = new FormControl("Mock Input");
