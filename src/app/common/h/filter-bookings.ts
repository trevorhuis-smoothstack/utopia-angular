import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
import { Booking } from "../entities/Booking";

@Pipe({
  name: "filterBookingsByDepartureAirportPipe",
})
export class FilterBookingsByDepartureAirportPipe implements PipeTransform {
  transform(items: Booking[], term, filterMetadata): any {
    if (term === "All Airports") {
      filterMetadata.count = items.length;
      return items;
    }

    if (term) {
      let filteredArray = items.filter(
        (item) => item.flight.departAirport.indexOf(term) !== -1
      );
      filterMetadata.count = filteredArray.length;
      return filteredArray;
    } else {
      return items;
    }
  }
}

@Pipe({
  name: "filterBookingsByActivePipe",
})
export class FilterBookingsByActivePipe implements PipeTransform {
  transform(items: Booking[], hideCancelled, filterMetadata): any {

    console.log(hideCancelled);
    console.log(items);
    if (!hideCancelled) {
      return items;
    } else {
      let filteredArray = items.filter((item) => item.active === true);
      filterMetadata.count = filteredArray.length;
      return filteredArray;
    }
  }
}

@Pipe({
  name: "filterBookingsByArrivalAirportPipe",
})
export class FilterBookingsByArrivalAirportPipe implements PipeTransform {
  transform(items: Booking[], term, filterMetadata): any {
    if (term === "All Airports") {
      filterMetadata.count = items.length;
      return items;
    }

    if (term) {
      let filteredArray = items.filter(
        (item) => item.flight.arriveAirport.indexOf(term) !== -1
      );
      filterMetadata.count = filteredArray.length;
      return filteredArray;
    } else {
      return items;
    }
  }
}

@Pipe({
  name: "filterByDepartureDatePipe",
})
export class FilterByDepartureDatePipe implements PipeTransform {
  transform(items: Booking[], date, filterMetadata): any {
    if (date === null) {
      filterMetadata.count = items.length;
      return items;
    }

    if (date) {
      let filteredArray = items.filter(
        (item) =>
          date.year == moment(item.flight.departTime).year() &&
          date.month == moment(item.flight.departTime).month() + 1 &&
          date.day == moment(item.flight.departTime).date()
      );
      filterMetadata.count = filteredArray.length;
      return filteredArray;
    } else {
      return items;
    }
  }
}

@Pipe({
  name: "filterBookingsByTravelerPipe",
})
export class FilterBookingsByTravelerPipe implements PipeTransform {
  transform(items: Booking[], term, filterMetadata): any {
    if (term) {
      let filteredArray = items.filter(
        (item) => item.name.toLowerCase().indexOf(term.toLowerCase()) !== -1
      );
      filterMetadata.count = filteredArray.length;
      return filteredArray;
    } else {
      filterMetadata.count = items.length;
      return items;
    }
  }
}
