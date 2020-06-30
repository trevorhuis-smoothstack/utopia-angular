import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.css"],
})
export class CounterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  logOut() {
    localStorage.removeItem("token");
  }

  startBook() {
    document.getElementById("cancel").classList.remove("side-link-active");
    document.getElementById("book").classList.add("side-link-active");
  }

  startCancel() {
    document.getElementById("book").classList.remove("side-link-active");
    document.getElementById("cancel").classList.add("side-link-active");
  }
}
