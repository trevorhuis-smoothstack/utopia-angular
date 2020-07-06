import { Flight } from './Flight';

export interface Booking {
    travelerId: Number;
    flightId: Number;
    bookerId: Number;
    active: Boolean;
    stripeId: String;
    name: String;
    flight: Flight;
}