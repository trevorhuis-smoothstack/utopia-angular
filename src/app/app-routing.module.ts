import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgentLoginComponent } from "./agent/agent-login/agent-login.component";
import { AgentDashboardComponent } from "./agent/agent-dashboard/agent-dashboard.component";
import { CounterLoginComponent } from "./counter/counter-login/counter-login.component";
import { CounterDashboardComponent } from "./counter/counter-dashboard/counter-dashboard.component";

const routes: Routes = [
  { path: "agent/login", component: AgentLoginComponent },
  { path: "agent/dashboard", component: AgentDashboardComponent },
  { path: "counter/login", component: CounterLoginComponent },
  { path: "counter", component: CounterDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
