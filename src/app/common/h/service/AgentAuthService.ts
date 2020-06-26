import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import * as moment from "moment";

@Injectable()
export class AgentAuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post(
      "http://127.0.0.1:8083/login",
      { username, password },
      { observe: "response" }
    ).toPromise();
  }

  logout() {
    localStorage.removeItem("id_token_agent");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("username");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration().add(1, "hours"));
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
