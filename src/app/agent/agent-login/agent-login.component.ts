import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentAuthService } from '../../common/h/service/AgentAuthService';
import * as moment from 'moment';


@Component({
  selector: 'agent-dashboard',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.css']
})
export class AgentLoginComponent implements OnInit {
  form:FormGroup;
  invalidLogin: boolean;

  constructor(private fb:FormBuilder, 
    private authService: AgentAuthService, 
    private router: Router) {

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
      this.authService.login(val.username, val.password).then(
        (response: any) => {
          console.log(response);
          const expiresAt = moment().add(response.headers.get('expires'), "second");
  
          localStorage.setItem("username", val.username);
          localStorage.setItem("id_token_agent", response.headers.get('Authorization'));
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
          
          this.router.navigate(['/agent/dashboard']);
        }).catch(error => {
          if (error.error.status == 401) {
            this.setInvalidLogin();
          } else {
            alert(error);
          }
          
        })
    }
  }

  setInvalidLogin() {
    this.invalidLogin = true;
  }
}