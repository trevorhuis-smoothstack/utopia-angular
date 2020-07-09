import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TravelerService } from '../../common/s/service/traveler.service';
import * as moment from 'moment';
import { TravelerAuthService } from 'src/app/common/s/service/traveler-auth-service.service';
import { environment } from 'src/environments/environment';
import { TravelerDataService } from 'src/app/common/s/service/traveler-data.service';
import { ToastsService } from 'src/app/common/s/service/toasts.service';

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
  maxLength = 45;
  minLength = 1;
  travelerLoginForm: FormGroup;
  createTravelerForm: FormGroup;

  constructor(
    private toastsService: ToastsService,
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

    this.initializeFormGroups();
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
            this.toastsService.showError('incorrect username or password', 'login error');
          } else {
            this.toastsService.showError('Servers may be down. Contact support for more information.', 'Server error');
          }
        });
    }
  }

  initializeFormGroups() {
    this.travelerLoginForm = new FormGroup({
      username: new FormControl('', [Validators.required as any]),
      password: new FormControl('', [Validators.required as any]),
    });

    this.createTravelerForm = new FormGroup({
     name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(this.maxLength),
        Validators.minLength(this.minLength)
      ]),
      username: new FormControl(
        null,
        [
          Validators.required,
          Validators.required, Validators.maxLength(this.maxLength),
          Validators.minLength(this.minLength)
        ],
      ),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [
        Validators.required,
      ]),
    },
    // { validators: this.validatePasswordMatch }
    );
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
      // TODO: chanage alert to logging service call.
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
          this.toastsService.showError('Username taken', 'Error');
          return;
        }

        this.travelerService.post(`${environment.travelerBackendUrl}${environment.userUri}`, travelerBody).subscribe(
          (result: any) => {
            this.traveler = result;
            this.toggleCreateTraveler();
            this.toastsService.showSuccess('Account created. Login with your new credentials', 'Yay!');
          }, (error => {
            this.toastsService.showError('Username taken', 'Error');
          })
        );
      },
      (error) => {
        // TODO: log error in logging service.
        alert(error);
      }
    );
  }

  // validatePasswordMatch(form: FormGroup) {
  //   return form.value.password === form.value.confirmPassword
  //     ? null
  //     : { validatePasswordMatch: true };
  // }
}
