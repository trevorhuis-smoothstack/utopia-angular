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
  mockAirports = [mockDepartAirport, mockArriveAirport],
  mockControl = new FormControl("Mock Input");
