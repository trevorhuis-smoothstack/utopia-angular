import { Injectable } from "@angular/core";
import { CounterHttpService } from "./counter-http.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CounterAuthService {
  constructor(
    private httpService: CounterHttpService,
    private router: Router
  ) {}

  checkAuth() {
    return this.httpService.get(
      environment.counterUrl + environment.counterCheckAuthUri
    );
  }
}
