import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsComponent } from './flights.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TravelerDataService } from 'src/app/common/s/service/traveler-data.service';
import { TravelerService } from 'src/app/common/s/service/traveler.service';
import { TravelerAuthService } from 'src/app/common/s/service/traveler-auth-service.service';
import { ToastsService } from 'src/app/common/s/service/toasts.service';
import { StripeService, NgxStripeModule } from 'ngx-stripe';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FilterFlightsByDepartureAirport,
  FilterByDepartureDate,
  FilterByFlightPrice,
  FilterFlightsByArrivalAirport
} from 'src/app/common/h/filter-flights';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FlightsComponent', () => {
  let component: FlightsComponent;
  let fixture: ComponentFixture<FlightsComponent>;
  let travelerDataService: TravelerDataService;
  let toastsService: ToastsService;
  let travelerService: TravelerService;
  let formBuilder: FormBuilder;
  let modalService: NgbModal;
  let stripe: StripeService;
  let errorSpy: any;
  let successSpy: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        FlightsComponent,
        FilterFlightsByDepartureAirport,
        FilterFlightsByArrivalAirport,
        FilterByDepartureDate,
        FilterByFlightPrice,
       ],
      providers: [
          TravelerDataService,
          TravelerService,
          TravelerAuthService,
          ToastsService,
      ],
      imports: [
          BrowserAnimationsModule,
          ReactiveFormsModule,
          HttpClientModule,
          ToastrModule.forRoot(),
          NgxStripeModule.forRoot(),
          NgbModule,
          FormsModule,
      ]
    })
    .compileComponents();
    travelerDataService = TestBed.get(TravelerDataService);
    toastsService = TestBed.get(ToastsService);
    travelerService = TestBed.get(TravelerService);
    formBuilder = TestBed.get(FormBuilder);
    modalService = TestBed.get(NgbModal);
    stripe = TestBed.get(StripeService);
    errorSpy = spyOn(toastsService, 'showError');
    successSpy = spyOn(toastsService, 'showSuccess');
    component = new FlightsComponent(travelerDataService, toastsService, travelerService, formBuilder, modalService, stripe);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up stripe elements', () => {
    const mockElements = {
      elements: 1,
      create: (card: string, options: any) => {
        let element: Element;
        element = new Element();
        return element;
      },
    };
    const stripeSpy = spyOn(stripe, 'elements').and.returnValue(of(mockElements));
    component.setUpStripeConnection();
    expect(stripeSpy).toHaveBeenCalled();
  });

  it('should show error toast on stripe error', () => {
    const stripeSpy = spyOn(stripe, 'elements').and.returnValue(throwError({error: {status: 401}}));
    component.setUpStripeConnection();
    expect(stripeSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('There was a problem connecting to the payment service', 'Unknown Error!');
  });

  it('should load current user', () => {
    const mockUser = {
      username: 'username',
      name: 'name'
    };

    spyOn(localStorage, 'getItem').and.returnValue('username');
    spyOn(component, 'loadFlights').and.callFake(() => {});
    spyOn(travelerService, 'get').and.returnValue(of(mockUser));
    component.loadCurrentUser();
    expect(component.user).toEqual(mockUser);
  });

  it('should throw error when the user is not found', () => {
    spyOn(localStorage, 'getItem').and.returnValue('username');
    const getSpy = spyOn(travelerService, 'get').and.returnValue(throwError({error: {status: 401}}));
    spyOn(component, 'loadFlights').and.callFake(() => {});
    component.loadCurrentUser();
    expect(errorSpy).toHaveBeenCalledWith('login error', 'Error');
  });

  it('should load flights', () => {
    const mockFlights = [
        {flightId: 1},
        {flightId: 2},
    ];

    const mockUser = {
      userId: 1,
    };

    const mockAirports = [
      {
        airportId: 1,
        name: 'name'
      },
      {
        airportId: 2,
        name: 'name'
      }
    ];

    component.user = mockUser;
    component.airports = mockAirports;
    spyOn(travelerService, 'get').and.returnValue(of(mockFlights));
    spyOn(component, 'formatFlights').and.callFake(() => {});
    spyOn(component, 'changePaginationCount').and.callFake(() => {});
    component.loadFlights();
    expect(component.flights).toEqual(mockFlights);
  });

  it('should show error through toast service if there is a problem loading', () => {
    const getSpy = spyOn(travelerService, 'get').and.returnValue(throwError({error: {status: 401}}));
    const mockUser = {
      userId: 1,
    };

    component.user = mockUser;
    component.loadFlights();
    expect(errorSpy).toHaveBeenCalledWith('problem loading flights', 'Error');
  });

  it('should book a flihgt', () => {
    const mockUser = {
      userId: 1,
    };

    const mockFlight = {
      flightId: 1,
    };

    const mockStripeResult = {
      token: {id: 1}
    };

    let mockFlights = [
      mockFlight,
      {flightId: 2},
    ];

    const success = {
      response: 'post request',
    };

    component.user = mockUser;
    component.flights = mockFlights;
    component.selectedFlight = mockFlight;
    const stripeSpy = spyOn(stripe, 'createToken').and.returnValue(of(mockStripeResult));
    spyOn(modalService, 'dismissAll');
    spyOn(travelerService, 'post').and.returnValue(of(success));
    component.bookFlight();
    expect(successSpy).toHaveBeenCalledWith('Flight booked. View in My Bookings', 'yay!');

    mockFlights = mockFlights.filter(
      (flight) => flight !== mockFlight
    );

    expect(component.flights).toEqual(mockFlights);
  });

  // it('should fail to book flight', () => {
  //   const mockUser = {
  //     userId: 1,
  //   };

  //   const mockFlight = {
  //     flightId: 1,
  //   };

  //   const mockStripeResult = {
  //     token: {id: 1}
  //   };

  //   const mockFlights = [
  //     mockFlight,
  //     {flightId: 2},
  //   ];

  //   component.user = mockUser;
  //   component.flights = mockFlights;
  //   const stripeSpy = spyOn(stripe, 'createToken').and.returnValue(of(mockStripeResult));
  //   spyOn(travelerService, 'post').and.returnValue(throwError({error: {status: 400}}));
  //   component.bookFlight();
  //   expect(errorSpy).toHaveBeenCalledWith('Something went wrong booking flight', 'Error');
  // });
  it('should adjust pagination', () => {
    expect(component.filterMetadata.count).toEqual(0);
    const mockFlights = [
      {flightId: 1},
      {flightId: 2},
      {flightId: 3},
      {flightId: 4},
      {flightId: 5},
      {flightId: 6},
      {flightId: 7},
      {flightId: 8},
      {flightId: 1},
      {flightId: 2},
      {flightId: 3},
      {flightId: 4},
      {flightId: 5},
      {flightId: 6},
      {flightId: 7},
      {flightId: 8},
      {flightId: 1},
      {flightId: 2},
      {flightId: 3},
      {flightId: 4},
      {flightId: 5},
      {flightId: 6},
      {flightId: 7},
      {flightId: 8},
    ];
    component.flights = mockFlights;
    component.changePaginationCount();
    expect(component.filterMetadata.count).toEqual(24);
  });
});
