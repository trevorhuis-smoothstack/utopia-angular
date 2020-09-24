import { CounterDateFilterPipe } from "./counter-date-filter.pipe";

describe("CounterDateFilterPipe", () => {
  it("create an instance", () => {
    const pipe = new CounterDateFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it("should select only flights within the selected date range", () => {
    const pipe = new CounterDateFilterPipe(),
      minDate = { year: 2020, month: 12, day: 14 },
      maxDate = { year: 2020, month: 12, day: 16 },
      tooEarlyFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-12-13T00:00:00.000-07:00",
        flightId: 1,
        price: 100,
        seatsAvailable: 20,
      },
      minDateFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-12-14T00:00:00.000-07:00",
        flightId: 2,
        price: 100,
        seatsAvailable: 20,
      },
      midDateFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-12-15T00:00:00.000-07:00",
        flightId: 3,
        price: 100,
        seatsAvailable: 20,
      },
      maxDateFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-12-16T00:00:00.000-07:00",
        flightId: 4,
        price: 100,
        seatsAvailable: 20,
      },
      tooLateFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-12-17T00:00:00.000-07:00",
        flightId: 5,
        price: 100,
        seatsAvailable: 20,
      },
      input = [
        tooEarlyFlight,
        minDateFlight,
        midDateFlight,
        maxDateFlight,
        tooLateFlight,
      ];
    let output = pipe.transform(input, minDate, maxDate),
      expectedOutput = [minDateFlight, midDateFlight, maxDateFlight];
    expect(output).toEqual(expectedOutput);
    output = pipe.transform(input, null, maxDate);
    expectedOutput = [
      tooEarlyFlight,
      minDateFlight,
      midDateFlight,
      maxDateFlight,
    ];
    expect(output).toEqual(expectedOutput);
    output = pipe.transform(input, minDate, null);
    expectedOutput = [
      minDateFlight,
      midDateFlight,
      maxDateFlight,
      tooLateFlight,
    ];
    expect(output).toEqual(expectedOutput);
  });
});
