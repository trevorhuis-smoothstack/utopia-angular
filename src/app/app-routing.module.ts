import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravelerComponent } from './traveler/traveler.component';
const routes: Routes = [
  {
    path: '',
    component: TravelerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
