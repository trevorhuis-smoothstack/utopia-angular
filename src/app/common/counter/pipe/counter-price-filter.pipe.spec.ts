import { CounterPriceFilterPipe } from "./counter-price-filter.pipe";

describe("CounterPriceFilterPipe", () => {
  it("create an instance", () => {
    const pipe = new CounterPriceFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it("should select only flights with prices less than or equal to the selected maximum", () => {
    const pipe = new CounterPriceFilterPipe(),
      maxPrice = 100,
      cheaperFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 1,
        price: maxPrice - 0.01,
        seatsAvailable: 20,
      },
      maxPriceFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 2,
        price: maxPrice,
        seatsAvailable: 20,
      },
      tooExpensiveFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 3,
        price: maxPrice + 0.01,
        seatsAvailable: 20,
      },
      moreExpensiveFlight = {
        departId: 1,
        arriveId: 2,
        departTime: "2020-11-23T14:00:00.000+00:00",
        flightId: 4,
        price: maxPrice + 0.02,
        seatsAvailable: 20,
      },
      input = [
        cheaperFlight,
        maxPriceFlight,
        tooExpensiveFlight,
        moreExpensiveFlight,
      ];
    let actual = pipe.transform(input, maxPrice),
      expected = [cheaperFlight, maxPriceFlight];
    expect(actual).toEqual(expected);
  });
});
