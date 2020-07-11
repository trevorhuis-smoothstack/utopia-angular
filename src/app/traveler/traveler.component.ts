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
import { TravelerDataService } from '../common/s/service/traveler-data.service';

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
    private travelerDataService: TravelerDataService,
    private authService: TravelerAuthService,
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
      this.router.navigate(['/traveler/login']);
    }
<<<<<<< HEAD

    // this.authService.checkAuth().subscribe(
    //   () => (this.authorized = true),
    //   (error) => {
    //     if (![401, 403].includes(error.error.status)) {
    //       alert('Error checking authorization: Status ' + error.error.status);
    //     }
    //     this.router.navigate(['/traveler/login']);
    //   }
    // );

    // this.loadCurrentUser();
    this.currentUser = this.travelerDataService.getCurrentUser();
    if (this.currentUser === undefined) {
      this.router.navigate(['/traveler/login']);
    }
=======
    this.loadCurrentUser();
>>>>>>> 7995af5cdccb88d426cb2287c81f7acc1551a208
  }

  loadCurrentUser() {
    this.travelerService
    .get(`${environment.travelerBackendUrl}${environment.usernameUri}/${this.username}`)
    .subscribe((res) => {
      this.currentUser = res;
      this.travelerDataService.setCurrentUser(this.currentUser);
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

  toggleFlights() {
    this.showFlights = !this.showFlights;
  }

  logout() {
    this.travelerAuthService.logout();
    this.router.navigate(['/traveler/login']);
  }
}
