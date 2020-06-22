import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit {

  flights: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.http.get("http://127.0.0.1:8083/agent/flights").subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        alert(error);
      }
    );
  }
  
}
