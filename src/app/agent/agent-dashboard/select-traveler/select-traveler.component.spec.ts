import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";

import { SelectTravelerComponent } from "./select-traveler.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockTraveler } from "../../mock-data";
import { of, throwError } from "rxjs";

describe("SelectTravelerComponent", () => {
  let component: SelectTravelerComponent;
  let fixture: ComponentFixture<SelectTravelerComponent>;
  let service: AgentUtopiaService;
  let fb: FormBuilder;
  let toastService: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SelectTravelerComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        HttpClientModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [AgentUtopiaService],
    }).compileComponents();
    service = new AgentUtopiaService(null);
    toastService = TestBed.get(ToastrService);
    fb = new FormBuilder();
    component = new SelectTravelerComponent(service, fb, toastService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTravelerComponent);
    fixture.detectChanges();
    
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should change create traveler to true", () => {
    component.createTraveler = false;
    expect(component.createTraveler).toEqual(false);
    component.setCreateTraveler();
    expect(component.createTraveler).toEqual(true);
  });

  it("should emit a new traveler", () => {
    spyOn(component.travelerChanged, "emit");
    component.changeTraveler(mockTraveler);
    expect(component.travelerChanged.emit).toHaveBeenCalled();
  });

  it("should try to create a new traveler but username is taken", fakeAsync(() => {
    component.ngOnInit();
    spyOn(service, "get").and.returnValues(of({}));
    component.createTravelerForm.value.name = mockTraveler.name;
    component.createTravelerForm.value.username = "trevorhuis";
    component.createNewTraveler();
    tick();
    expect(component.usernameTaken).toEqual(true);
  }));

  it("should try to see that username is available and call helper function", fakeAsync(() => {
    component.ngOnInit();
    spyOn(service, "get").and.returnValues(of(null));
    spyOn(component, "createNewTravelerHelper").and.callFake(() => {});
    component.createTravelerForm.value.name = mockTraveler.name;
    component.createTravelerForm.value.username = "trevorhuis";
    component.createNewTraveler();
    tick();
    expect(component.createNewTravelerHelper).toHaveBeenCalled();
  }));

  it("should try to see that username is available but get an error in get call and call toaster", fakeAsync(() => {
    component.ngOnInit();
    spyOn(service, "get").and.returnValue(throwError({status: 404}));
    spyOn(toastService, "error");
    component.createTravelerForm.value.name = mockTraveler.name;
    component.createTravelerForm.value.username = "trevorhuis";
    component.createNewTraveler();
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should use a post request to create and retrieve a new traveler", fakeAsync(() => {
    component.ngOnInit();
    let travelerBody = {
      name: mockTraveler.name,
      username: "trevorhuis",
      password: "",
      role: "TRAVELER",
    };

    spyOn(service, "post").and.returnValue(of(mockTraveler));
    component.createNewTravelerHelper(travelerBody);
    tick();
    expect(component.createTraveler).toEqual(false);
    expect(component.traveler).toEqual(mockTraveler);
  }));


  it("should use a post request to create and retrieve but handles an error", fakeAsync(() => {
    component.ngOnInit();
    let travelerBody = {
      name: mockTraveler.name,
      username: "trevorhuis",
      password: "",
      role: "TRAVELER",
    };

    spyOn(service, "post").and.returnValue(throwError({status: 404}));
    spyOn(toastService, "error");
    component.createNewTravelerHelper(travelerBody);
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should check traveler and set a new one", fakeAsync(() => {
    component.ngOnInit();
    spyOn(service, "get").and.returnValue(of(mockTraveler));
    component.selectTravelerForm.value.username = "trevorhuis";
    component.checkTraveler();
    tick();
    expect(component.traveler).toEqual(mockTraveler);

  }));

  it("should check traveler and set a new one", fakeAsync(() => {
    component.ngOnInit();
    spyOn(service, "get").and.returnValue(of(null));
    component.selectTravelerForm.value.username = "trevorhuis";
    component.checkTraveler();
    tick();
    expect(component.invalidLogin).toEqual(true);
    
  }));

  it("should check traveler and handle an error", fakeAsync(() => {
    component.ngOnInit();
    spyOn(service, "get").and.returnValue(throwError({status: 404}));
    spyOn(toastService, "error");
    component.selectTravelerForm.value.username = "trevorhuis";
    component.checkTraveler();
    tick();
    expect(toastService.error).toHaveBeenCalled();
  }));

  it("should setup create traveler form", () => {
    component.createTraveler = true;
    component.setupCreateTravelerForm();
    component.createTravelerForm.controls['username'].markAsDirty();
    expect(component.errorsDirtyCreateTraveler('username')).toEqual(true);
  });

});
