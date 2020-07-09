
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgentLoginComponent } from "./agent/agent-login/agent-login.component";
import { AgentDashboardComponent } from "./agent/agent-dashboard/agent-dashboard.component";
import { CounterLoginComponent } from "./counter/counter-login/counter-login.component";
import { TravelerComponent } from './traveler/traveler.component';
import { TravelerLoginComponent } from './traveler/traveler-login/traveler-login.component';
import { CounterComponent } from "./counter/counter/counter.component";
import { CounterTravelerComponent } from "./counter/counter-traveler/counter-traveler.component";
import { CounterCancellationComponent } from "./counter/counter-cancellation/counter-cancellation.component";
import { CounterBookingComponent } from "./counter/counter-booking/counter-booking.component";

const routes: Routes = [
  { path: "agent/login", component: AgentLoginComponent },
  { path: "agent/dashboard", component: AgentDashboardComponent },
  { path: "counter/login", component: CounterLoginComponent },
  { path: 'traveler/dashboard', component: TravelerComponent },
  { path: 'traveler/login', component: TravelerLoginComponent },
  {
    path: 'counter',
    component: CounterComponent,
    children: [
      { path: "traveler", component: CounterTravelerComponent },
      { path: "cancellation", component: CounterCancellationComponent },
      { path: "booking", component: CounterBookingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
