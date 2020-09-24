import { TestBed } from "@angular/core/testing";

import * as moment from "moment";

import { AgentAuthService } from './AgentAuthService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { componentFactoryName } from '@angular/compiler';

describe("AgentAuthService", () => {
  let service: AgentAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AgentAuthService]
    });
    service = TestBed.get(AgentAuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should remove items from local storage with logout", () => {
    localStorage.setItem("token", "testToken");
    localStorage.setItem("expires_at", "testExpires");
    localStorage.setItem("username", "testUsername");
    expect(localStorage.getItem("token")).toEqual("testToken");
    expect(localStorage.getItem("expires_at")).toEqual("testExpires");
    expect(localStorage.getItem("username")).toEqual("testUsername");
    service.logout();
    expect(localStorage.getItem("token")).toEqual(null);
    expect(localStorage.getItem("expires_at")).toEqual(null);
    expect(localStorage.getItem("username")).toEqual(null);
  });

  it("should return a moment for getExpiration", () => {
    localStorage.setItem("expires_at", "123");
    let testMomentVal = moment(JSON.parse("123"));
    let expirationVal = service.getExpiration();
    expect(testMomentVal).toEqual(expirationVal);
  });

  it("should return true for a good login", () => {
    let now = moment(Date.now());
    spyOn(service, "getExpiration").and.returnValue(now);
    let isLoggedIn = service.isLoggedIn();
    expect(isLoggedIn).toEqual(true);
  });

  it("should return true for a good login", () => {
    let now = moment(Date.now());
    spyOn(service, "getExpiration").and.returnValue(now);
    let isLoggedOut = service.isLoggedOut();
    expect(isLoggedOut).toEqual(false);
  });

//   it("should set & get the counter attendant", () => {
//     expect(service.getCounter()).toBeFalsy();
//     service.setCounter(mockCounter);
//     expect(service.getCounter()).toEqual(mockCounter);
//   });

//   it("should set & get the traveler", () => {
//     let traveler: any;
//     service.travelerObservable.subscribe(
//       (thisTraveler) => (traveler = thisTraveler)
//     );
//     expect(traveler).toBeFalsy()
//     expect(service.getTraveler()).toBeFalsy();
//     service.setTraveler(mockTraveler);
//     expect(service.getTraveler()).toEqual(mockTraveler);
//     expect(traveler).toEqual(mockTraveler);
//   });
});