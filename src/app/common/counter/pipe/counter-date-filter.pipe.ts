import { Pipe, PipeTransform } from "@angular/core";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

@Pipe({
  name: "counterDateFilter",
})
export class CounterDateFilterPipe implements PipeTransform {
  transform(input: any[], minDate: any, maxDate: any): any[] {
    let output = input;
    if (minDate) {
      minDate = new Date(minDate.year, minDate.month - 1, minDate.day);
      output = output.filter(
        (flight) => Date.parse(flight.departTime) >= minDate
      );
    }
    if (maxDate) {
      maxDate = new Date(maxDate.year, maxDate.month - 1, maxDate.day + 1);
      output = output.filter(
        (flight) => Date.parse(flight.departTime) < maxDate
      );
    }
    return output;
  }
}
