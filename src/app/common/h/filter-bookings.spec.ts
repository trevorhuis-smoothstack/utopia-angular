import { FilterBookingsByDepartureAirportPipe, FilterBookingsByArrivalAirportPipe, FilterByDepartureDatePipe, FilterBookingsByTravelerPipe } from "./filter-bookings.pipe";
import { mockBookings } from "../../agent/mock-data";

describe("test FilterBookingsByDepartureAirportPipe", () => {
  it("create an instance", () => {
    const pipe = new FilterBookingsByDepartureAirportPipe();
    expect(pipe).toBeTruthy();
  });

  it("should select only bookings departing from austin", () => {
    const pipe = new FilterBookingsByDepartureAirportPipe();
    const houstonBooking = mockBookings[0], dallasBooking = mockBookings[1], austinBooking = mockBookings[2];
    const filterMetadata = { count: 3 };
    const input = [houstonBooking, dallasBooking, austinBooking];
    let actual = pipe.transform(input, "Austin", filterMetadata);
    let expected = [austinBooking];
    expect(actual).toEqual(expected);
  });

  it("should select only bookings departing from everywhere using null", () => {
    const pipe = new FilterBookingsByDepartureAirportPipe();
    const houstonBooking = mockBookings[0], dallasBooking = mockBookings[1], austinBooking = mockBookings[2];
    const filterMetadata = { count: 3 };
    const input = [houstonBooking, dallasBooking, austinBooking];
    let actual = pipe.transform(input, null, filterMetadata);
    let expected = input;
    expect(actual).toEqual(expected);
  });

  it("should select only bookings departing from everywhere using all airports", () => {
    const pipe = new FilterBookingsByDepartureAirportPipe();
    const houstonBooking = mockBookings[0], dallasBooking = mockBookings[1], austinBooking = mockBookings[2];
    const filterMetadata = { count: 3 };
    const input = [houstonBooking, dallasBooking, austinBooking];
    let actual = pipe.transform(input, "All Airports", filterMetadata);
    let expected = input;
    expect(actual).toEqual(expected);
  });
});

describe("FilterBookingsByArrivalAirportPipe", () => {
    it("create an instance", () => {
      const pipe = new FilterBookingsByArrivalAirportPipe();
      expect(pipe).toBeTruthy();
    });
  
    it("should select only bookings arriving in austin", () => {
      const pipe = new FilterBookingsByArrivalAirportPipe();
      const austinBooking = mockBookings[0], houstonBooking = mockBookings[1], dallasBooking = mockBookings[2];
      const filterMetadata = { count: 3 };
      const input = [houstonBooking, dallasBooking, austinBooking];
      let actual = pipe.transform(input, "Austin", filterMetadata);
      let expected = [austinBooking];
      expect(actual).toEqual(expected);
    });

    it("should select only bookings arriving everywhere using null", () => {
      const pipe = new FilterBookingsByArrivalAirportPipe();
      const austinBooking = mockBookings[0], houstonBooking = mockBookings[1], dallasBooking = mockBookings[2];
      const filterMetadata = { count: 3 };
      const input = [houstonBooking, dallasBooking, austinBooking];
      let actual = pipe.transform(input, null, filterMetadata);
      let expected = input;
      expect(actual).toEqual(expected);
    });

    it("should select only bookings arriving everywhere using All Airports", () => {
      const pipe = new FilterBookingsByArrivalAirportPipe();
      const austinBooking = mockBookings[0], houstonBooking = mockBookings[1], dallasBooking = mockBookings[2];
      const filterMetadata = { count: 3 };
      const input = [houstonBooking, dallasBooking, austinBooking];
      let actual = pipe.transform(input, "All Airports", filterMetadata);
      let expected = input;
      expect(actual).toEqual(expected);
    });
  });
  
  describe("FilterByDepartureDatePipe", () => {
    it("create an instance", () => {
      const pipe = new FilterByDepartureDatePipe();
      expect(pipe).toBeTruthy();
    });
  
    it("should select only booking on december 13th, 2020", () => {
      const pipe = new FilterByDepartureDatePipe();
      const earlyBooking = mockBookings[0], rightBooking = mockBookings[1], lateBooking = mockBookings[2];
      earlyBooking.flight.departTime =  "2020-12-12T00:00:00.000-07:00";
      rightBooking.flight.departTime =  "2020-12-13T00:00:00.000-07:00";
      lateBooking.flight.departTime =  "2020-12-14T00:00:00.000-07:00";
      const date = {day: 13, month: 12, year: 2020};
      const filterMetadata = { count: 3 };
      const input = [earlyBooking, rightBooking, lateBooking];
      let actual = pipe.transform(input, date, filterMetadata);
      let expected = [rightBooking];
      expect(actual).toEqual(expected);
    });

    it("should select all dates with input of null", () => {
      const pipe = new FilterByDepartureDatePipe();
      const earlyBooking = mockBookings[0], rightBooking = mockBookings[1], lateBooking = mockBookings[2];
      earlyBooking.flight.departTime =  "2020-12-12T00:00:00.000-07:00";
      rightBooking.flight.departTime =  "2020-12-13T00:00:00.000-07:00";
      lateBooking.flight.departTime =  "2020-12-14T00:00:00.000-07:00";
      const date = {day: 13, month: 12, year: 2020};
      const filterMetadata = { count: 3 };
      const input = [earlyBooking, rightBooking, lateBooking];
      let actual = pipe.transform(input, null, filterMetadata);
      let expected = input;
      expect(actual).toEqual(expected);
    });

    it("should select all dates with input of undefined", () => {
      const pipe = new FilterByDepartureDatePipe();
      const earlyBooking = mockBookings[0], rightBooking = mockBookings[1], lateBooking = mockBookings[2];
      earlyBooking.flight.departTime =  "2020-12-12T00:00:00.000-07:00";
      rightBooking.flight.departTime =  "2020-12-13T00:00:00.000-07:00";
      lateBooking.flight.departTime =  "2020-12-14T00:00:00.000-07:00";
      const date = {day: 13, month: 12, year: 2020};
      const filterMetadata = { count: 3 };
      const input = [earlyBooking, rightBooking, lateBooking];
      let actual = pipe.transform(input, undefined, filterMetadata);
      let expected = input;
      expect(actual).toEqual(expected);
    });
  });

  describe("FilterBookingsByTravelerPipe", () => {
    it("create an instance", () => {
      const pipe = new FilterBookingsByTravelerPipe();
      expect(pipe).toBeTruthy();
    });
  
    it("should select only bookings for Trevor Huis in 't Veld", () => {
      const pipe = new FilterBookingsByTravelerPipe();
      const trevorBookingOne = mockBookings[0], trevorBookingTwo = mockBookings[1], otherBooking = mockBookings[2];
      otherBooking.name =  "other";
      const filterMetadata = { count: 3 };
      const input = [trevorBookingOne, trevorBookingTwo, otherBooking];
      let actual = pipe.transform(input, "Trevor Huis in 't Veld", filterMetadata);
      let expected = [trevorBookingOne, trevorBookingTwo];
      expect(actual).toEqual(expected);
    });

    it("should select all bookings with null input", () => {
      const pipe = new FilterBookingsByTravelerPipe();
      const trevorBookingOne = mockBookings[0], trevorBookingTwo = mockBookings[1], otherBooking = mockBookings[2];
      otherBooking.name =  "other";
      const filterMetadata = { count: 3 };
      const input = [trevorBookingOne, trevorBookingTwo, otherBooking];
      let actual = pipe.transform(input, null, filterMetadata);
      let expected = input;
      expect(actual).toEqual(expected);
    });
  });