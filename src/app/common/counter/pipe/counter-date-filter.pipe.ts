import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "counterDateFilter",
})
export class CounterDateFilterPipe implements PipeTransform {
  transform(input: any[], minDate: Date, maxDate: Date): any {
    return input.filter(
      (flight) => flight.departTime >= minDate && flight.departTime <= maxDate
    );
  }
}
