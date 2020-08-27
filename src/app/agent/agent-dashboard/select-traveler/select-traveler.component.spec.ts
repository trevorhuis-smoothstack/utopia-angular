import { async, ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";

import { SelectTravelerComponent } from "./select-traveler.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockTraveler } from '../../mock-data';
import { of } from 'rxjs/internal/observable/of';

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
    fb = new FormBuilder();
    component = new SelectTravelerComponent(service, fb, toastService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTravelerComponent);
    component = fixture.componentInstance;
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
    component.changeTraveler(mockTraveler);
    expect(component.travelerChanged.emit).toHaveBeenCalled;
  });

  // it('should try to create a new traveler but username is taken', fakeAsync(() => {
  //   spyOn(service, "get").and.returnValue(
  //       of({log: "This is the output."})
  //     );
  //   component.ngOnInit();
  //   component.createTravelerForm.value.name = mockTraveler.name;
  //   component.createTravelerForm.value.username = "trevorhuis";
  //   component.createNewTraveler();
  //   tick();
  //   expect(component.usernameTaken).toEqual(true);
  // }));

  // it("should setup create traveler form", () => {

  // });
});
