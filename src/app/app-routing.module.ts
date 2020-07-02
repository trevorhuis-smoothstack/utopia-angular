import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravelerComponent } from './traveler/traveler.component';
import { TravelerLoginComponent } from './traveler/traveler-login/traveler-login.component';

import { AgentLoginComponent } from './agent/agent-login/agent-login.component';
import { AgentDashboardComponent } from './agent/agent-dashboard/agent-dashboard.component';

const routes: Routes = [
  { path: '', component: TravelerLoginComponent},
  { path: 'agent/login', component: AgentLoginComponent },
  { path: 'agent/dashboard', component: AgentDashboardComponent },
  { path: 'traveler/dashboard', component: TravelerComponent },
  { path: 'traveler/login', component: TravelerLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
