import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentAuthService } from '../../../common/h/service/AgentAuthService';


@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.css']
})
export class AgentLoginComponent implements OnInit {
  form:FormGroup;

  constructor(private fb:FormBuilder, 
    private authService: AgentAuthService, 
    private router: Router) {

  this.form = this.fb.group({
  username: ['',Validators.required],
  password: ['',Validators.required]
  });
  }

  ngOnInit() {
    
  }

  login() {
    const val = this.form.value;

    if (val.username && val.password) {
        this.authService.login(val.username, val.password);
    }
}
}