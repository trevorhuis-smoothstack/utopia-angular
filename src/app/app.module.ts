import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AgentLoginComponent } from "./agent/agent-login/agent-login.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { AgentAuthService } from "./common/h/service/AgentAuthService";
import { AgentAuthInterceptor } from "./common/h/service/AgentAuthInterceptor";
import { AgentDashboardComponent } from "./agent/agent-dashboard/agent-dashboard.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgentUtopiaService } from "./common/h/agent-utopia.service";
import {
  SortFlightsByDepartureAirport,
  SortFlightsByArrivalAirport,
  SortByFlightPrice,SortByDepartureDate
} from "./common/h/sort-flights-airports";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CancelBookingComponent } from './agent/agent-dashboard/cancel-booking/cancel-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    AgentLoginComponent,
    AgentDashboardComponent,
    SortFlightsByDepartureAirport,
    SortFlightsByArrivalAirport,
    SortByFlightPrice,
    SortByDepartureDate,
    CancelBookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule
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
  bootstrap: [AppComponent]
})
export class AppModule {}
