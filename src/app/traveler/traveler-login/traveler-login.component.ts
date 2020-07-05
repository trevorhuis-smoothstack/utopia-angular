import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TravelerService } from '../../common/s/service/traveler.service';
import * as moment from 'moment';
import { TravelerAuthService } from 'src/app/common/s/service/traveler-auth-service.service';
import { environment } from 'src/environments/environment';
import { TravelerDataService } from 'src/app/common/s/service/traveler-data.service';

@Component({
  selector: 'app-traveler-login',
  templateUrl: './traveler-login.component.html',
  styleUrls: ['./traveler-login.component.css']
})

export class TravelerLoginComponent implements OnInit {
  form: FormGroup;
  invalidLogin: boolean;
  usernameTaken = false;
  createTraveler = false;
  traveler: any;

  travelerLoginForm = new FormGroup({
    username: new FormControl('', [Validators.required as any, Validators.required as any]),
    password: new FormControl('', [Validators.required as any, Validators.required as any]),
  });


  createTravelerForm = new FormGroup({
    name: new FormControl('', [Validators.required as any, Validators.required as any]),
    username: new FormControl('', [Validators.required as any, Validators.required as any]),
    password: new FormControl('', [Validators.required as any, Validators.required as any]),
    passwordCheck: new FormControl('', [Validators.required as any, Validators.required as any]),
  });

  constructor(
    private travelerDataService: TravelerDataService,
    private fb: FormBuilder,
    private authService: TravelerAuthService,
    private travelerService: TravelerService,
    private router: Router
    ) {
    this.form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  }

  ngOnInit() {
    // fetch current user.
    this.traveler = {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token'),
      expires: localStorage.getItem('expires_at')
    };

    if (this.travelerDataService.getCurrentUser()) {
      this.router.navigate(['/traveler/dashboard']);
    }
  }

  login() {
    const val = this.travelerLoginForm.value;

    if (val.username && val.password) {
      this.authService.login(val.username, val.password).then(
        (response: any) => {
          const expiresAt = moment().add(response.headers.get('expires'), 'second');

          localStorage.setItem('username', val.username);
          localStorage.setItem('token', response.headers.get('Authorization'));
          localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

          this.loadCurrentUser(val.username);


        }).catch(error => {
          if (error.error.status === 401) {
            this.setInvalidLogin();
          } else {
            alert(error);
          }
        });
    }
  }

  toggleCreateTraveler() {
    this.createTraveler = !this.createTraveler;
  }

  setInvalidLogin() {
    this.invalidLogin = true;
  }

  loadCurrentUser(username: string) {
    this.travelerService
    .get(`${environment.travelerBackendUrl}${environment.usernameUri}/${username}`)
    .subscribe((res) => {
      this.travelerDataService.setCurrentUser(res);
      this.router.navigate(['/traveler/dashboard']);
    },
    (error) => {
      alert(error);
    }
    );
  }

  createNewTraveler() {
    const travelerBody = {
      name: this.createTravelerForm.value.name,
      username: this.createTravelerForm.value.username,
      password: this.createTravelerForm.value.password,
      role: 'TRAVELER'
    };

    this.travelerService.get(`${environment.travelerBackendUrl}${environment.usernameUri}/${travelerBody.username}`).subscribe(
      (result: any) => {
        if (result != null) {
          this.usernameTaken = true;
          return;
        }

        this.travelerService.post(`${environment.travelerBackendUrl}${environment.userUri}`, travelerBody).subscribe(
          (result: any) => {
            this.traveler = result;
            this.toggleCreateTraveler();
          }, (error => {
            alert(error);
          })
        );
      },
      (error) => {
        alert(error);
      }
    );
  }
}
