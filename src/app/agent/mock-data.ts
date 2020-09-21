import { Airport } from "../common/entities/Airport";
import { Flight } from '../common/entities/Flight';
import { Traveler } from '../common/entities/Traveler';
import { Booking } from '../common/entities/Booking';
import { Agent } from '../common/entities/Agent';

export const mockAirports: Airport[] = [
    {
        airportId: 1,
        name: "Austin"
    },
    {
        airportId: 2,
        name: "Houston"
    },
    {
        airportId: 3,
        name: "Dallas"
    }
]

export const mockAirportMap = new Map();
mockAirportMap.set(1, mockAirports[0].name);
mockAirportMap.set(2, mockAirports[1].name);
mockAirportMap.set(3, mockAirports[2].name);

export const mockFlights: Flight[] = [
    {
        departTime: " ",
        arriveId: 1,
        departId: 2,
        arriveAirport: "Austin",
        departAirport: "Houston",
        price: 10.0,
        flightId: 1
    },
    {
        departTime: " ",
        arriveId: 2,
        departId: 3,
        arriveAirport: "Houston",
        departAirport: "Dallas",
        price: 15.0,
        flightId: 2
    },
    {
        departTime: " ",
        arriveId: 3,
        departId: 1,
        arriveAirport: "Dallas",
        departAirport: "Austin",
        price: 20.0,
        flightId: 3
    }
]

export const mockBookings: Booking[] = [
    {
        travelerId: 1,
        flightId: 1,
        bookerId: 1,
        active: true,
        stripeId: "secret",
        name: "Trevor Huis in 't Veld",
        flight: mockFlights[0]
    },
    {
        travelerId: 1,
        flightId: 2,
        bookerId: 1,
        active: true,
        stripeId: "secret",
        name: "Trevor Huis in 't Veld",
        flight: mockFlights[1]
    },
    {
        travelerId: 1,
        flightId: 3,
        bookerId: 1,
        active: true,
        stripeId: "secret",
        name: "Trevor Huis in 't Veld",
        flight: mockFlights[2]
    }
]

export const mockAgent: Agent = {
    name: "The Mock Agent",
    userId: 1,
    username: "mock_agent"
}

export const mockTraveler: Traveler = {
    name: "Trevor Huis in 't Veld",
    userId: 1
}


