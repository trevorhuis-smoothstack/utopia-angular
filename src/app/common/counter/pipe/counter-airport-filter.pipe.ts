import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "counterAirportFilter",
})
export class CounterAirportFilterPipe implements PipeTransform {
  transform(input: any[], departAirport: any, arriveAirport: any): any {
    let output = input;
    if (departAirport)
      output = output.filter(
        (flight) => (flight.departId === departAirport.airportId)
      );
    if (arriveAirport)
      output = output.filter(
        (flight) => (flight.arriveId === arriveAirport.airportId)
      );
      return output;
  }
}
