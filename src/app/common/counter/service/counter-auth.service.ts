import { Injectable } from "@angular/core";
import { CounterHttpService } from "./counter-http.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CounterAuthService {
  constructor(
    private httpService: CounterHttpService,
  ) {}

  checkAuth() {
    return this.httpService.get(
      environment.counterUrl + environment.counterCheckAuthUri
    );
  }
}
