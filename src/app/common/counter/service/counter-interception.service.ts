import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CounterInterceptionService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    if (token) {
      const requestClone = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token),
      });
      return next.handle(requestClone);
    } else {
      return next.handle(request);
    }
  }
}
