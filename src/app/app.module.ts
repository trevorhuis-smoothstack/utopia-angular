import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgentLoginComponent } from './agent/agent-login/agent-login.component';
import { NgxStripeModule } from "ngx-stripe";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ToastrModule } from 'ngx-toastr';
import { CancelBookingComponent } from "./agent/agent-dashboard/cancel-booking/cancel-booking.component";
import { CreateBookingComponent } from "./agent/agent-dashboard/create-booking/create-booking.component";
import { SelectTravelerComponent } from "./agent/agent-dashboard/select-traveler/select-traveler.component";
import { CounterLoginComponent } from "./counter/counter-login/counter-login.component";
import { CounterHttpService } from "./common/counter/service/counter-http.service";
import { CounterInterceptionService } from "./common/counter/service/counter-interception.service";
import { CounterSelectTravelerComponent } from "./counter/counter-select-traveler/counter-select-traveler.component";
import { CounterComponent } from "./counter/counter/counter.component";
import { CounterTravelerComponent } from "./counter/counter-traveler/counter-traveler.component";
import { CounterCreateTravelerComponent } from "./counter/counter-create-traveler/counter-create-traveler.component";
import { CounterCancellationComponent } from './counter/counter-cancellation/counter-cancellation.component';
import { CounterBookingComponent } from "./counter/counter-booking/counter-booking.component";
import { TravelerComponent } from './traveler/traveler.component';
import { TravelerService } from './common/s/service/traveler.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TravelerLoginComponent } from './traveler/traveler-login/traveler-login.component';

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
    CounterLoginComponent,
    CounterSelectTravelerComponent,
    CounterComponent,
    CounterTravelerComponent,
    CounterCreateTravelerComponent,
    CounterCancellationComponent,
    CounterBookingComponent,
    TravelerComponent,
    TravelerLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxStripeModule.forRoot(),
    NgMultiSelectDropDownModule,
  ],
  providers: [
    AgentAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AgentAuthInterceptor,
      multi: true,
    },
    AgentUtopiaService,
    TravelerService,
    CounterHttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CounterInterceptionService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
