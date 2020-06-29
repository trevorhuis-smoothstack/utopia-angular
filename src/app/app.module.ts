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
import { CounterLoginComponent } from './counter/counter-login/counter-login.component';
import { CounterHttpService } from './common/counter/service/counter-http.service';
import { CounterDashboardComponent } from './counter/counter-dashboard/counter-dashboard.component';
import { CounterInterceptionService } from './common/counter/service/counter-interception.service';
import { CounterTravelerTypeComponent } from './counter/booking/counter-traveler-type/counter-traveler-type.component';
import { CounterSelectTravelerComponent } from './counter/counter-select-traveler/counter-select-traveler.component';

@NgModule({
  declarations: [AppComponent, AgentLoginComponent, AgentDashboardComponent, CounterLoginComponent, CounterDashboardComponent, CounterTravelerTypeComponent, CounterSelectTravelerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
  ],
  providers: [
    AgentAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AgentAuthInterceptor,
      multi: true,
    },
    AgentUtopiaService,
    CounterHttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CounterInterceptionService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
