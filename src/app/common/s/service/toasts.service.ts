import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message, title) {
      this.toastr.success(message, title);
  }

  showError(message, title) {
    this.toastr.error(message, title);
}
}
