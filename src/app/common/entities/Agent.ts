import { Booking } from './Booking';

export interface Agent {
    name: String;
    userId: Number;
    username: String;
    bookings: Booking[];
}