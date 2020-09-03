import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {environment} from 'src/environments/environment';
import { Router, Route, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TravelerAuthService } from '../common/s/service/traveler-auth-service.service';
import { TravelerDataService } from '../common/s/service/traveler-data.service';
import { TravelerService } from '../common/s/service/traveler.service';
import { ToastsService } from '../common/s/service/toasts.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs/internal/observable/of';

import { TravelerComponent } from './traveler.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ToastInjector, ToastrService, ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';

describe('TravelerComponent', () => {
  let component: TravelerComponent;
  let fixture: ComponentFixture<TravelerComponent>;

  let toastsService: ToastsService;
  let modalService: NgbModal;
  let travelerDataService: TravelerDataService;
  let authService: TravelerAuthService;
  let travelerService: TravelerService;
  let router: Router;
  let fb: FormBuilder;
  let errorSpy: any;

  const routes: Routes = [
      {path: 'traveler/login', component: TravelerComponent}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TravelerComponent ],
      imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          ReactiveFormsModule,
          HttpClientModule,
          NgbModule,
          ToastrModule.forRoot(),
          RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        ToastsService,
        TravelerService,
        TravelerDataService,
        TravelerAuthService,
      ]
    })
    .compileComponents();
    toastsService = TestBed.get(ToastsService);
    modalService = TestBed.get(NgbModal);
    travelerDataService = TestBed.get(TravelerDataService);
    authService = TestBed.get(TravelerAuthService);
    travelerService = TestBed.get(TravelerService);
    router = TestBed.get(Router);
    fb = new FormBuilder();
    errorSpy = spyOn(toastsService, 'showError').and.callFake(() => {});
    spyOn(toastsService, 'showSuccess').and.callFake(() => {});
    component = new TravelerComponent(toastsService,
                                      modalService,
                                      travelerDataService,
                                      authService,
                                      travelerService,
                                      router);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authorize user', () => {
    const authSpy = spyOn(authService, 'checkAuth').and.returnValue(of({}));
    component.authorizeUser();
    expect(authSpy).toHaveBeenCalled();
    expect(component.authorized).toEqual(true);
  });

  it('should fail to refuse unauthorized users', () => {
    const authSpy = spyOn(authService, 'checkAuth').and.returnValue(throwError({error: {status: 401}}));
    const navSpy = spyOn(router, 'navigate').and.callFake(() => {});
    component.authorizeUser();
    expect(authSpy).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/traveler/login']);
    expect(errorSpy).toHaveBeenCalledWith('Error checking authorization: Status ' + 401, 'Login Error');
  });

  it('should load current user', () => {
    const mockUser = {
      username: 'username',
      name: 'name',
      userId: 1
    };

    const getSpy = spyOn(travelerService, 'get').and.returnValue(of(mockUser));
    component.loadCurrentUser();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should show error if cannot find user', () => {
    const getSpy = spyOn(travelerService, 'get').and.returnValue(throwError({error: {status: 404}}));
    component.loadCurrentUser();
    expect(getSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('login error', 'Error');
  });

  it('should load airports', () => {
    const mockAirports = [
      {
        airportId: 1,
        city: 'name'
      },
      {
        airportId: 2,
        city: 'another city'
      }
    ];

    const getSpy = spyOn(travelerService, 'get').and.returnValue(of(mockAirports));
    component.loadAirports();
    expect(component.airports).toEqual(mockAirports);
  });

  it('should error if flights not found', () => {
    const getSpy = spyOn(travelerService, 'get').and.returnValue(throwError({error: {status: 404}}));
    component.loadAirports();
    expect(getSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('problem loading airports', 'Database Error');
  });

  it('should toggle flights', () => {
    expect(component.flightButtonText).toEqual('My Bookings');
    component.toggleFlights();
    expect(component.flightButtonText).toEqual('Search Flights');
  });

  it('should logout', () => {
    const authSpy = spyOn(authService, 'logout').and.callFake(() => {});
    const navigateSpy = spyOn(router, 'navigate').and.callFake(() => {});
    component.logout();
    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/traveler/login']);
  });
});
