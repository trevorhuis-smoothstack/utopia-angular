import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "angular";
  resetSideLinks() {
    document.getElementById("book").classList.remove("side-link-active");
    document.getElementById("cancel").classList.remove("side-link-active");
  }
}
