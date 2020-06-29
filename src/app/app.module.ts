import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TravelerComponent } from './traveler/traveler.component';
import { TravelerService } from './common/s/service/traveler.service';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TravelerLoginComponent } from './traveler/traveler-login/traveler-login.component';

@NgModule({
  declarations: [
    AppComponent,
    TravelerComponent,
    TravelerLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgMultiSelectDropDownModule
  ],
  providers: [TravelerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
