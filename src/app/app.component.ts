import { Component } from "@angular/core";
import { ToastService } from './common/toast-service.service';
import { Toast } from './common/entities/Toast';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  toast: Toast;

  constructor(
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.toast = {
      body: null,
      status: null,
      header: null
    }
    
    this.toastService.toastObservable.subscribe(
      (toast) => (this.handleToast(toast))
    );
  }

  title = "angular";
  resetSideLinks() {
    document.getElementById("book").classList.remove("side-link-active");
    document.getElementById("cancel").classList.remove("side-link-active");
  }
  
  handleToast(toast: Toast) {
    this.toast = toast;
    document.getElementById("toast").classList.add("show");

    setTimeout(() => this.closeToast(), 10000); 
  }

  closeToast() {
    document.getElementById("toast").classList.remove("show");
  }

}
