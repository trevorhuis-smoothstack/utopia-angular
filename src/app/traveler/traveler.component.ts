import { Component, OnInit } from '@angular/core';
import { TravelerService } from '../common/s/service/traveler.service';
import { environment } from 'src/environments/environment';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TravelerAuthService } from '../common/s/service/traveler-auth-service.service';

@Component({
  selector: 'app-traveler',
  templateUrl: './traveler.component.html',
  styleUrls: ['./traveler.component.css']
})
export class TravelerComponent implements OnInit {

  bookableFlights: any;
  flights: any;
  myActiveFlights: any;
  myPreviousFlights: any;
  airports: any;
  currentUser: any; // contains username userId name and role.
  dropdownSettings: any;
  pickDepartureForm: FormGroup;
  pickArrivalForm: FormGroup;
  arrival: any;
  departure: any;
  authorized = false;
  username: string;
  showFlights = true;


  constructor(
    private travelerService: TravelerService,
    private travelerAuthService: TravelerAuthService,
    private router: Router
  ) {
    this.loadAirports();
    this.dropdownSettings = {
      singleSelection: true,
      textField: 'name',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.loadAirports();
    this.initializeFormGroup();

    this.username = localStorage.getItem('username');
    if (!localStorage.getItem('username')) {
      console.log(localStorage.getItem('username'));
      this.router.navigate(['/traveler/login']);
    }
    // this.currentUser = {
    //   userId: 1,
    //   username: 'sean',
    //   name: 'sean',
    //   role: 'TRAVELER'
    // };
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.travelerService
    .get(`${environment.travelerBackendUrl}${environment.usernameUri}/${this.username}`)
    .subscribe((res) => {
      this.currentUser = res;
      console.log(res);
    },
    (error) => {
      alert(error);
    }
    );
  }

  loadAirports() {
    this.travelerService
      .get(`${environment.travelerBackendUrl}${environment.readTravelerAirports}`)
      .subscribe(
        (res) => {
          this.airports = res;
          console.log(res);
        },
        (error) => {
          alert(error);
        }
      );
  }

  initializeFormGroup() {
    this.pickDepartureForm = new FormGroup({
        departure: new FormControl(this.departure),
    });
    this.pickArrivalForm = new FormGroup({
      arrival: new FormControl(this.arrival),
    });
  }

  showArrivalDeparture() {
    console.log(this.arrival);
    console.log(this.departure);
  }

  toggleFlights() {
    this.showFlights = !this.showFlights;
  }

  logout() {
    this.travelerAuthService.logout();
    this.router.navigate(['/traveler/login']);
  }
}
