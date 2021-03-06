import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  Form,
} from "@angular/forms";
import { environment } from "src/environments/environment";
import { Traveler } from "../../../common/entities/Traveler";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-agent-select-traveler",
  templateUrl: "./select-traveler.component.html",
  styleUrls: ["./select-traveler.component.css"],
})
export class SelectTravelerComponent implements OnInit {
  selectTravelerForm: FormGroup;
  createTravelerForm: FormGroup;
  traveler: Traveler;
  invalidLogin: boolean;
  createTraveler: boolean;
  usernameTaken: boolean;

  @Output() travelerChanged = new EventEmitter<Traveler>();
  invalidLoginSpace: boolean;

  constructor(
    private service: AgentUtopiaService,
    private formBuilder: FormBuilder,
    private toastService: ToastrService
  ) {
  }

  ngOnInit() {
    this.createTraveler = false;
    
    this.selectTravelerForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.maxLength(45),
      ]),
    });

    this.createTravelerForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(45),
      ]),
      username: new FormControl(null, [
        Validators.required,
        Validators.maxLength(45),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    });
  }

  changeTraveler(traveler: Traveler) {
    this.travelerChanged.emit(traveler);
  }

  checkTraveler() {
    let travelerBody = {
      name: " ",
      username: this.selectTravelerForm.value.username,
      password: " ",
      role: "TRAVELER",
    };

    this.service
      .get(
        `${environment.agentBackendUrl}${environment.agentTravelerUri}/${travelerBody.username}`
      )
      .subscribe(
        (result: any) => {
          if (result != null) {
            this.traveler = result;

            this.changeTraveler(this.traveler);
            return;
          }

          this.invalidLogin = true;
        },
        (error) => {
          this.toastService.error("We are having an error reading traveler information. Please try again later or call IT if the problem continues.", "Internal Error");
        }
      );
  }

  setupCreateTraveler() {
    this.createTraveler = true;
  }

  createNewTraveler() {
    let travelerBody = {
      name: this.createTravelerForm.value.name,
      username: this.createTravelerForm.value.username,
      password: "",
      role: "TRAVELER",
    };

    this.service
      .get(
        `${environment.agentBackendUrl}${environment.agentUsernameUri}/${travelerBody.username}`
      )
      .subscribe(
        (result: any) => {
          if (result != null) {
            this.usernameTaken = true;
            return;
          }

          this.service
            .post(
              `${environment.agentBackendUrl}${environment.agentUserUri}`,
              travelerBody
            )
            .subscribe(
              (result: any) => {
                this.traveler = result;
                this.createTraveler = false;
                this.changeTraveler(this.traveler);
              },
              (error) => {
                this.toastService.error("We are having an error creating a new traveler. Please try again later or call IT if the problem continues.", "Internal Error");
              }
            );
        },
        (error) => {
          this.toastService.error("We are having an error reading traveler information. Please try again later or call IT if the problem continues.", "Internal Error");
        }
      );
  }

 
  errorsDirtySelectTraveler(field: string) {
    return this.selectTravelerForm.controls[field].errors && this.selectTravelerForm.controls[field].dirty;
  }

  errorsDirtyCreateTraveler(field: string) {
    return this.createTravelerForm.controls[field].errors && this.createTravelerForm.controls[field].dirty;
  }
}
