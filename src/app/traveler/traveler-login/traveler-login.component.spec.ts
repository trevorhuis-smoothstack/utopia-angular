import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerLoginComponent } from './traveler-login.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastsService } from 'src/app/common/s/service/toasts.service';
import { TravelerDataService } from 'src/app/common/s/service/traveler-data.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TravelerAuthService } from 'src/app/common/s/service/traveler-auth-service.service';
import { TravelerService } from 'src/app/common/s/service/traveler.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastInjector, ToastrService, ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs/internal/observable/of';


describe('TravelerLoginComponent', () => {
  let component: TravelerLoginComponent;
  let fixture: ComponentFixture<TravelerLoginComponent>;
  let toastsService: ToastsService;
  let travelerDataService: TravelerDataService;
  let fb: FormBuilder;
  let authService: TravelerAuthService;
  let travelerService: TravelerService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TravelerLoginComponent ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        TravelerDataService,
        TravelerAuthService,
        ToastsService,
        TravelerService,
      ]

    })
    .compileComponents();
    travelerDataService = new TravelerDataService();
    toastsService = TestBed.get(ToastsService);
    authService = TestBed.get(TravelerAuthService);
    travelerService = TestBed.get(TravelerService);
    router = TestBed.get(Router);
    fb = new FormBuilder();
    component = new TravelerLoginComponent(toastsService, travelerDataService, fb, authService, travelerService, router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a traveler', () => {
    const mockUser = {
      username: 'username',
      name: 'name',
      userId: 1
    };

    const getSpy = spyOn(travelerService, 'get').and.returnValue(of(null));
    const postSpy = spyOn(travelerService, 'post').and.returnValue(of(mockUser));
    spyOn(toastsService, 'showError').and.callFake(() => {});
    spyOn(toastsService, 'showSuccess').and.callFake(() => {});

    component.createNewTraveler();
    expect(getSpy).toHaveBeenCalled();
    expect(postSpy).toHaveBeenCalled();
    expect(component.traveler).toEqual(mockUser);
  });

  it('should set username taken to false',  () => {
    const mockUser = {
      username: 'username',
      name: 'name',
      userId: 1
    };

    spyOn(toastsService, 'showError').and.callFake(() => {});
    spyOn(toastsService, 'showSuccess').and.callFake(() => {});
    const getSpy = spyOn(travelerService, 'get').and.returnValue(of(mockUser));

    component.createNewTraveler();
    expect(component.usernameTaken).toEqual(true);
  });

  it('should load Current User', () => {
    const mockUser = {
      username: 'username',
      name: 'name',
      userId: 1
    };

    component.traveler = mockUser;

    const authSpy = spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const getSpy = spyOn(travelerService, 'get').and.returnValue(of(mockUser));
    const navigateSpy = spyOn(router, 'navigate').and.callFake(() => {});

    component.checkLoginStatus();
    expect(authSpy).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalled();
    expect(component.traveler).toEqual(mockUser);
  });

  it('should login if the user is authenticated', () => {
    const mockUser = {
      username: 'username',
      name: 'name',
      userId: 1
    };

    component.traveler = mockUser;

    const authSpy = spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const getSpy = spyOn(travelerService, 'get').and.returnValue(of(mockUser));
    const navigateSpy = spyOn(router, 'navigate').and.callFake(() => {});

    component.checkLoginStatus();
    expect(authSpy).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/traveler/dashboard']);
  });

  it('should toggle create traveler boolean', () => {
    expect(component.createTraveler).toEqual(false);
    component.toggleCreateTraveler();
    expect(component.createTraveler).toEqual(true);
  });
});
