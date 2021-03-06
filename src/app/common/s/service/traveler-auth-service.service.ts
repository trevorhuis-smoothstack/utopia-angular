import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import * as moment from "moment";
import { TravelerService } from "./traveler.service";
import { environment } from "src/environments/environment";
import { TravelerDataService } from "./traveler-data.service";

@Injectable({
  providedIn: "root",
})
export class TravelerAuthService {
  constructor(
    private httpService: TravelerService,
    private http: HttpClient,
    private travelerDataService: TravelerDataService,
    private router: Router
  ) {}

  login(username: string, password: string) {
    return this.http
      .post(
        `${environment.loginUrl}`,
        { username, password },
        { observe: "response" }
      )
      .toPromise();
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("username");
    this.travelerDataService.setCurrentUser(null);
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

  checkAuth() {
    return this.httpService.get(
      environment.travelerBackendUrl + environment.travelerCheckAuthUri
    );
  }
}
