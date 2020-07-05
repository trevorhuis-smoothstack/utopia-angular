import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TravelerDataService {

  constructor() { }

  private currentUser: any;

  setCurrentUser(user) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
