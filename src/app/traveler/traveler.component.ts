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

  constructor(
    private travelerService: TravelerService,
  ) {
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
  }

  loadCurrentUser() {

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

  loadFlights() {

  }

  loadActiveFlights() {

  }

  loadPreviousFlights() {

  }
}
