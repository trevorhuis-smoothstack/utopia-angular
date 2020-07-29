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


describe('TravelerLoginComponent', () => {
  let component: TravelerLoginComponent;
  let fixture: ComponentFixture<TravelerLoginComponent>;
  let toastsService: ToastsService;
  let travelerDataService: TravelerDataService;
  let fb: FormBuilder;
  let authService: TravelerAuthService;
  let travelerService: TravelerService;

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
      ],
      providers: [
        TravelerDataService,
        TravelerAuthService,
        ToastsService,
      ]

    })
    .compileComponents();
    travelerDataService = new TravelerDataService();
    travelerService = new TravelerService(null);
    toastsService = new ToastsService(null);
    authService = new TravelerAuthService(null, null, travelerDataService, null);
    fb = new FormBuilder();
    component = new TravelerLoginComponent(toastsService, travelerDataService, fb, authService, travelerService, null);
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
    // const mockUser = {
    //   username: 'username',
    //   name: 'name',
    //   userId: 1
    // };

    // spyOn(travelerService, 'get').and.returnValue(mockUser);
    // spyOn(travelerService, 'post').and.returnValue(mockUser);

    // component.createNewTraveler();
    // expect(component.usernameTaken).toEqual(true);
    // expect(component.traveler.username).toEqual(mockUser.username);
  });

  it('should load Current User', () => {
    const mockUser = {
      username: 'username',
      name: 'name',
      userId: 1
    };

    spyOn(travelerService, 'get').and.returnValue(mockUser);

    component.loadCurrentUser(mockUser.username);
    expect(component.createTraveler).toEqual(true);
    // expect(component.traveler).toEqual(mockUser);
  });

  it('should login if the user is authenticated', () => {

  });

  it('should toggle create traveler boolean', () => {
    expect(component.createTraveler).toEqual(false);
    component.toggleCreateTraveler();
    expect(component.createTraveler).toEqual(true);
  });
});
