import { Injectable, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { Toast } from "./entities/Toast";

@Injectable({ providedIn: "root" })
export class ToastService {
  
  toast: any;

  constructor() {}

  private toastSource = new Subject<any>();

  toastObservable = this.toastSource.asObservable();

  newToast(toast: Toast) {
    this.toastSource.next(toast);
  }

  newInternalErrorToast() {
    let toast: Toast = {
      body:
        "Our servers are experiencing difficulties at this time, please contact IT support or try again later.",
      header: "Internal Server Error",
      status: "Status: 500",
    };
    this.toastSource.next(toast);
  }

  newBadRequestToast(body: string) {
    let toast: Toast = {
      body: body,
      header: "Bad Request",
      status: "Status: 400",
    };
    this.toastSource.next(toast);
  }

  newFlightBookedToast() {
    let toast: Toast = {
      body: "We are sorry but all the seats for that flight are booked.",
      header: "No Seats Available",
      status: "",
    };
    this.toastSource.next(toast);
  }
}
