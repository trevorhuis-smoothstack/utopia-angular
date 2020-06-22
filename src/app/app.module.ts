import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AgentLoginComponent } from "./agent/agent-login/agent-login.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { AgentAuthService } from "../common/h/service/AgentAuthService";
import { AgentAuthInterceptor } from "../common/h/service/AgentAuthInterceptor";
import { AgentDashboardComponent } from './agent/agent-dashboard/agent-dashboard.component';

@NgModule({
  declarations: [AppComponent, AgentLoginComponent, AgentDashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [AgentAuthService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AgentAuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
