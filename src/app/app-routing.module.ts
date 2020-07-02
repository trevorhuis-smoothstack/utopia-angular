import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgentLoginComponent } from "./agent/agent-login/agent-login.component";
import { AgentDashboardComponent } from "./agent/agent-dashboard/agent-dashboard.component";
import { CounterLoginComponent } from "./counter/counter-login/counter-login.component";
import { CounterDashboardComponent } from "./counter/counter-dashboard/counter-dashboard.component";
import { CounterTravelerTypeComponent } from "./counter/booking/counter-traveler-type/counter-traveler-type.component";
import { CounterSelectTravelerComponent } from "./counter/counter-select-traveler/counter-select-traveler.component";
import { CounterComponent } from "./counter/counter/counter.component";

const routes: Routes = [
  { path: "agent/login", component: AgentLoginComponent },
  { path: "agent/dashboard", component: AgentDashboardComponent },
  { path: "counter/login", component: CounterLoginComponent },
  {
    path: "counter",
    component: CounterComponent,
    children: [
      { path: "traveler", component: CounterTravelerTypeComponent },
      {
        path: "traveler/existing",
        component: CounterSelectTravelerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
