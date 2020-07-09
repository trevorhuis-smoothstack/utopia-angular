import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentAuthService } from '../../common/h/service/AgentAuthService';
import * as moment from 'moment';
import { ToastsService } from 'src/app/common/s/service/toasts.service';


@Component({
  selector: 'agent-dashboard',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.css']
})
export class AgentLoginComponent implements OnInit {
  form:FormGroup;
  invalidLogin: boolean;
  invalidAttempt: boolean;

  constructor(private fb:FormBuilder, 
    private authService: AgentAuthService, 
    private router: Router,
    private toastService: ToastsService) {

  this.form = this.fb.group({
  username: ['',Validators.required],
  password: ['',Validators.required]
  });
  }

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/agent/dashboard']);
    }
  }

  login() {
    const val = this.form.value;

    if (val.username && val.password) {
      this.invalidAttempt = false;
      this.authService.login(val.username, val.password).then(
        (response: any) => {
          const expiresAt = moment().add(response.headers.get('expires'), "second");
  
          localStorage.setItem("username", val.username);
          localStorage.setItem("token", response.headers.get('Authorization'));
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
          
          this.router.navigate(['/agent/dashboard']);
        }).catch(error => {
          if (error.error.status == 401) {
            this.setInvalidLogin();
          } else {
            this.toastService.showError("We are having an error with our login. Please try again later or call IT if the problem continues.", "Internal Error");
          }
          
        })
    } else {
      this.invalidAttempt = true;
    }
  }

  setInvalidLogin() {
    this.invalidLogin = true;
  }
}