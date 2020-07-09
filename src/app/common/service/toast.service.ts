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
}
