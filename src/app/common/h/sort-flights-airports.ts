import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

// @Pipe({
//   name: "sortFlightsByAirport",
// })
// export class SortCopiesByTitlePipe implements PipeTransform {
//   transform(items: any[], term, filterMetadata): any {
//     if (term) {
//       let filteredArray = items.filter(
//         (item) =>
//           item.bookTitle.toLowerCase().indexOf(term.toLowerCase()) !== -1
//       );
//       filterMetadata.count = filteredArray.length;
//       return filteredArray;
//     } else {
//       filterMetadata.count = items.length;
//       return items;
//     }
//   }
// }

@Pipe({
  name: "sortFlightsByDepartureAirport",
})
export class SortFlightsByDepartureAirport implements PipeTransform {
  transform(items: any[], term, filterMetadata): any {
    if (term === "All Airports") {
      filterMetadata.count = items.length;
      return items;
    }

    if (term) {
      let filteredArray = items.filter(
        (item) => item.airportDepart.indexOf(term) !== -1
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
    transform(items: any[], term, filterMetadata): any {
      if (term === "All Airports") {
        filterMetadata.count = items.length;
        return items;
      }
  
      if (term) {
        let filteredArray = items.filter(
          (item) => item.airportArrive.indexOf(term) !== -1
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
    transform(items: any[], price, filterMetadata): any {
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
        transform(items: any[], date, filterMetadata): any {
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