import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor() {}

  private toastSource = new Subject<any>();

  toastObservable = this.toastSource.asObservable();

  newToast(toast: any) {
    this.toastSource.next(toast);
  }

  newUnexpectedErrorToast(header: string, status: any) {
    this.toastSource.next({
      header: header,
      body:
        "Please try again. If the problem persists, please contact the IT department.",
      status: "Status " + status,
    });
  }
}
