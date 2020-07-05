import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';
import { Flight } from 'src/app/agent/entities/Flight';

@Pipe({
  name: "sortFlightsByDepartureAirport",
})
export class SortFlightsByDepartureAirport implements PipeTransform {
  transform(items: Flight[], term, filterMetadata): any {
    if (term === "All Airports") {
      filterMetadata.count = items.length;
      return items;
    }

    if (term) {
      let filteredArray = items.filter(
        (item) => item.departAirport.indexOf(term) !== -1
      );
      filterMetadata.count = filteredArray.length;
      return filteredArray;
    } else {
      return items;
    }
  }
}

@Pipe({
    name: "sortFlightsByArrivalAirport",
  })
export class SortFlightsByArrivalAirport implements PipeTransform {
    transform(items: Flight[], term, filterMetadata): any {
      if (term === "All Airports") {
        filterMetadata.count = items.length;
        return items;
      }
  
      if (term) {
        let filteredArray = items.filter(
          (item) => item.arriveAirport.indexOf(term) !== -1
        );
        filterMetadata.count = filteredArray.length;
        return filteredArray;
      } else {
        return items;
      }
    }
  }

@Pipe({
name: "sortByFlightPrice",
})
export class SortByFlightPrice implements PipeTransform {
    transform(items: Flight[], price, filterMetadata): any {
        if (price === 100) {
            filterMetadata.count = items.length;
            return items;
        }

      if (price) {
        let filteredArray = items.filter(
          (item) => item.price < price
        );
        filterMetadata.count = filteredArray.length;
        return filteredArray;
      } else {
        return items;
      }
    }
  }

  @Pipe({
    name: "sortByDepartureDate",
    })
    export class SortByDepartureDate implements PipeTransform {
        transform(items: Flight[], date, filterMetadata): any {
            if (date === null) {
                filterMetadata.count = items.length;
                return items;
            }
            
          if (date) {
            let filteredArray = items.filter(
              (item) => (date.year == moment(item.departTime).year() && date.month ==  (moment(item.departTime).month() + 1) && date.day ==  moment(item.departTime).date())
            );
            filterMetadata.count = filteredArray.length;
            return filteredArray;
          } else {
            return items;
          }
        }
      }