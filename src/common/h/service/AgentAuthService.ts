import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { tap, shareReplay } from "rxjs/operators";

import * as moment from "moment";

@Injectable()
export class AgentAuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post("http://127.0.0.1:8083/login", { username, password }, { observe: 'response' }).subscribe((response: any) =>{

        console.log(response.headers);

        localStorage.setItem("id_token", response.headers.get('Authorization'));
        
      })
  }

  private setSession(authResult) {
    console.log(authResult);

    const expiresAt = moment().add(authResult.expiresIn, "second");

    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

