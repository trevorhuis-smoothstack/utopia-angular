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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from '../common/s/service/toasts.service';

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
  flightButtonText = 'My Bookings';

  constructor(
    private toastsService: ToastsService,
    private modalService: NgbModal,
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

    this.username = localStorage.getItem('username');
    if (!this.username) {
      this.router.navigate(['/traveler/login']);
    }

    this.authorizeUser();

    this.loadCurrentUser();
    this.currentUser = this.travelerDataService.getCurrentUser();
    this.loadAirports();
    this.initializeFormGroup();
  }

  authorizeUser() {
    this.authService.checkAuth().subscribe(
      () => (this.authorized = true),
      (error) => {
        if (![401, 403, 500].includes(error.error.status)) {
          this.toastsService.showError('Error checking authorization: Status ', error.error.status);
        }
        this.router.navigate(['/traveler/login']);
      }
    );
  }

  loadCurrentUser() {
    this.travelerService
    .get(`${environment.travelerBackendUrl}${environment.usernameUri}/${this.username}`)
    .subscribe((res) => {
      this.currentUser = res;
      this.travelerDataService.setCurrentUser(this.currentUser);
    },
    (error) => {
      this.toastsService.showError('login error', 'Error');
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
          this.toastsService.showError('problem loading airports', 'Database Error');
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
    if (this.showFlights) {
      this.flightButtonText = 'My Bookings';
    } else {
      this.flightButtonText = 'Search Flights';
    }
  }

  logout() {
    this.travelerAuthService.logout();
    this.router.navigate(['/traveler/login']);
  }

  openLogoutModal(modal: any) {
    this.modalService.open(modal);
  }
}
