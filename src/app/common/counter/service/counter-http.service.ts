import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CounterHttpService {
  constructor(private http: HttpClient) {}

  head(url: string) {
    return this.http.head(url);
  }

  get(url: string) {
    return this.http.get(url);
  }

  post(url: string, body: any) {
    return this.http.post(url, body, { observe: "response" });
  }

  put(url: string) {
    return this.http.put(url,null);
  }
}
