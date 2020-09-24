import { CounterAirportFilterPipe } from "./counter-airport-filter.pipe";

describe("CounterAirportFilterPipe", () => {
  it("create an instance", () => {
    const pipe = new CounterAirportFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it("should return only flights with the specified arrival & departure airports", () => {
    const pipe = new CounterAirportFilterPipe(),
      departAirport = { airportId: 1, name: "Arrive" },
      arriveAirport = { airportId: 2, name: "Depart" },
      matchingFlightOne = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 1,
        price: 100,
        seatsAvailable: 20,
      },
      matchingFilghtTwo = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-11-24T14:00:00.000+00:00",
        flightId: 2,
        price: 100,
        seatsAvailable: 20,
      },
      transposedAirportsFlight = {
        departId: 2,
        arriveId: 1,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 2,
        price: 100,
        seatsAvailable: 20,
      },
      wrongArriveFlight = {
        departId: 1,
        arriveId: 3,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 3,
        price: 100,
        seatsAvailable: 20,
      },
      wrongDepartFlight = {
        departId: 3,
        arriveId: 2,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 4,
        price: 100,
        seatsAvailable: 20,
      },
      bothAirportsWrongFlight = {
        departId: 3,
        arriveId: 4,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 4,
        price: 100,
        seatsAvailable: 20,
      },
      input = [
        transposedAirportsFlight,
        matchingFlightOne,
        wrongArriveFlight,
        wrongDepartFlight,
        matchingFilghtTwo,
        bothAirportsWrongFlight,
      ];
    let result = pipe.transform(input, departAirport, arriveAirport),
      expectedOutput = [matchingFlightOne, matchingFilghtTwo];
    expect(result).toEqual(expectedOutput);
    result = pipe.transform(input, null, arriveAirport);
    expectedOutput = [matchingFlightOne, wrongDepartFlight, matchingFilghtTwo];
    expect(result).toEqual(expectedOutput);
    result = pipe.transform(input, departAirport, null);
    expectedOutput = [matchingFlightOne, wrongArriveFlight, matchingFilghtTwo];
    expect(result).toEqual(expectedOutput);
  });
});
