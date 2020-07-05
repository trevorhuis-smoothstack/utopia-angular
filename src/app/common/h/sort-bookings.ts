import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';
import { Booking } from '../entities/Booking';

@Pipe({
  name: "sortBookingsByDepartureAirportPipe",
})
export class SortBookingsByDepartureAirportPipe implements PipeTransform {
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
    name: "sortBookingsByArrivalAirportPipe",
  })
export class SortBookingsByArrivalAirportPipe implements PipeTransform {
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
    name: "sortByDepartureDatePipe",
    })
    export class SortByDepartureDatePipe implements PipeTransform {
        transform(items: Booking[], date, filterMetadata): any {
            if (date === null) {
                filterMetadata.count = items.length;
                return items;
            }
            
          if (date) {
            let filteredArray = items.filter(
              (item) => (date.year == moment(item.flight.departTime).year() && date.month ==  (moment(item.flight.departTime).month() + 1) && date.day ==  moment(item.flight.departTime).date())
            );
            filterMetadata.count = filteredArray.length;
            return filteredArray;
          } else {
            return items;
          }
        }
      }

      @Pipe({
        name: "sortBookingsByTravelerPipe",
      })
      export class SortBookingsByTravelerPipe implements PipeTransform {
        transform(items: Booking[], term, filterMetadata): any {
          if (term) {
            let filteredArray = items.filter(
              (item) =>
                item.name.toLowerCase().indexOf(term.toLowerCase()) !== -1
            );
            filterMetadata.count = filteredArray.length;
            return filteredArray;
          } else {
            filterMetadata.count = items.length;
            return items;
          }
        }
      }
      