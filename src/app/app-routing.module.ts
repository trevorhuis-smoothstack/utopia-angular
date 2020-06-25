import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentLoginComponent } from './agent/agent-login/agent-login.component';
import { AgentDashboardComponent } from './agent/agent-dashboard/agent-dashboard.component';

const routes: Routes = [
  { path: 'agent/login', component: AgentLoginComponent },
  { path: 'agent/dashboard', component: AgentDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
