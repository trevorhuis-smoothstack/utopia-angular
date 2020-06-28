import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgentLoginComponent } from "./agent/agent-login/agent-login.component";
import { AgentDashboardComponent } from "./agent/agent-dashboard/agent-dashboard.component";
import { CounterLoginComponent } from "./counter-login/counter-login.component";

const routes: Routes = [
  { path: "agent/login", component: AgentLoginComponent },
  { path: "agent/dashboard", component: AgentDashboardComponent },
  { path: "counter/login", component: CounterLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
