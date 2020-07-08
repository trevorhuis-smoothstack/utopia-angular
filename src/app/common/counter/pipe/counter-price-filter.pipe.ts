import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "counterPriceFilter",
})
export class CounterPriceFilterPipe implements PipeTransform {
  transform(input: any[], maxPrice: number): any {
    return input.filter((flight) => flight.price <= maxPrice);
  }
}
