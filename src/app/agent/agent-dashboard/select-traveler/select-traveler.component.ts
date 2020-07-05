import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Traveler } from '../../entities/Traveler';
import { AgentUtopiaService } from 'src/app/common/h/agent-utopia.service';

@Component({
  selector: 'app-agent-select-traveler',
  templateUrl: './select-traveler.component.html',
  styleUrls: ['./select-traveler.component.css']
})
export class SelectTravelerComponent implements OnInit {
  selectTravelerForm = new FormGroup({
    username: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
  });

  createTravelerForm = new FormGroup({
    name: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    username: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
    passwordCheck: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
  });

  traveler: Traveler;
  invalidLogin: boolean;
  createTraveler: boolean;
  usernameTaken: boolean;

  @Output() travelerChanged = new EventEmitter<Traveler>();

  constructor(private service: AgentUtopiaService,
    private formBuilder: FormBuilder,) {
    this.createSelectTravelerForm();
   }

  ngOnInit() {
    this.createTraveler = false;
  }

  // *************************
  // SELECT A TRAVELER
  // *************************

  createSelectTravelerForm() {
    this.selectTravelerForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  checkTraveler() {
    let travelerBody = {
      name: " ",
      username: this.selectTravelerForm.value.username,
      password: " ",
      role: "TRAVELER"
    }

    this.service.get(`${environment.agentBackendUrl}${environment.agentTravelerUri}/${travelerBody.username}`).subscribe(
      (result: any) => {
        if (result != null) {
          this.traveler = result;

          this.changeTraveler(this.traveler); 
          return;
        } 

        this.invalidLogin = true;

        },(error) => {
          alert(error)
        });
  }

  setupCreateTraveler() {
    this.createTraveler = true;

    this.createTravelerForm = this.formBuilder.group({
      name: '',
      username: '',
      password: ''
    })
  }

  createNewTraveler() {
    let travelerBody = {
      name: this.createTravelerForm.value.name,
      username: this.createTravelerForm.value.username,
      password: this.createTravelerForm.value.password,
      role: "TRAVELER"
    };

    this.service.get(`${environment.agentBackendUrl}${environment.usernameUri}/${travelerBody.username}`).subscribe(
      (result: any) => {
        if (result != null) {
          this.usernameTaken = true;
          return;
        };

        this.service.post(`${environment.agentBackendUrl}${environment.userUri}`, travelerBody).subscribe(
          (result: any) => {
            this.traveler = result;
            this.createTraveler = false;
            this.changeTraveler(this.traveler);
          }, (error => {
            alert(error);
          })
        )
      },
      (error) => {
        alert(error);
      }
    )
  }

  changeTraveler(traveler: Traveler) {
    this.travelerChanged.emit(traveler);
  }
}
