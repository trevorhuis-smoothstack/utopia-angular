// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  agentBackendUrl: "http://127.0.0.1:8080/agent",
  agentUserIdUri: "/user/id",
  agentUsernameUri: "/user/username",
  agentUserUri: "/user",
  agentTravelerUri: "/traveler",
  agentFlightUri: "/flight",
  agentPremierUri: "/premier",
  agentBookingsUri: "/bookings",
  agentFlightsUri: "/flights",
  agentAirportsUri: "/airports",
  agentBookingUri: "/booking",
  travelerBackendUrl: 'http://localhost:8080/traveler',
  readTravelerAirports: '/airports',
  usernameUri: '/users',
  userUri: '/users',
  CheckAuthUri: '/authorized',
  counterUrl: "http://localhost:8080/counter",
  loginUrl: "http://localhost:8080/login",
  counterCancellablyBookedUri: "/flights/cancellable/traveler/",
  counterCancelUri: "/bookings",
  counterAirportUri: "/airports",
  counterBookableUri: "/flights/bookable",
  counterBookUri: "/booking",
  counterCheckAuthUri: "/authorized",
  counterCreateUserUri: "/user",
  counterGetUserUri: "/users/",
  counterTravelerUri: "/traveler/",
  counterUsernameUri: "/user/",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
