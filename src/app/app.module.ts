import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AgentLoginComponent } from "./agent/agent-login/agent-login.component";
import { NgxStripeModule } from "ngx-stripe";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { AgentAuthService } from "./common/h/service/AgentAuthService";
import { AgentAuthInterceptor } from "./common/h/service/AgentAuthInterceptor";
import { AgentDashboardComponent } from "./agent/agent-dashboard/agent-dashboard.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgentUtopiaService } from "./common/h/agent-utopia.service";
import {
  FilterFlightsByDepartureAirport,
  FilterFlightsByArrivalAirport,
  FilterByFlightPrice,
  FilterByDepartureDate,
} from "./common/h/filter-flights";

import {
  FilterBookingsByArrivalAirportPipe,
  FilterBookingsByDepartureAirportPipe,
  FilterBookingsByTravelerPipe,
  FilterByDepartureDatePipe,
} from "./common/h/filter-bookings";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CancelBookingComponent } from "./agent/agent-dashboard/cancel-booking/cancel-booking.component";
import { CreateBookingComponent } from "./agent/agent-dashboard/create-booking/create-booking.component";
import { SelectTravelerComponent } from "./agent/agent-dashboard/select-traveler/select-traveler.component";

@NgModule({
  declarations: [
    AppComponent,
    AgentLoginComponent,
    AgentDashboardComponent,
    FilterFlightsByDepartureAirport,
    FilterFlightsByArrivalAirport,
    FilterByFlightPrice,
    FilterByDepartureDate,
    FilterBookingsByArrivalAirportPipe,
    FilterBookingsByDepartureAirportPipe,
    FilterBookingsByTravelerPipe,
    FilterByDepartureDatePipe,
    CancelBookingComponent,
    CreateBookingComponent,
    SelectTravelerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxStripeModule.forRoot(),
  ],
  providers: [
    AgentAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AgentAuthInterceptor,
      multi: true,
    },
    AgentUtopiaService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
