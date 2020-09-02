import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterCancellationComponent } from "./counter-cancellation.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CounterAirportFilterPipe } from "src/app/common/counter/pipe/counter-airport-filter.pipe";
import { CounterDateFilterPipe } from "src/app/common/counter/pipe/counter-date-filter.pipe";
import {
  mockAirports,
  mockDepartAirport,
  mockArriveAirport,
} from "src/app/common/counter/counter-mock-data";

describe("CounterCancellationComponent", () => {
  let component: CounterCancellationComponent;
  let fixture: ComponentFixture<CounterCancellationComponent>;
  let router: Router,
    toastr: ToastrService,
    modalService: NgbModal,
    httpService: CounterHttpService,
    dataService: CounterDataService,
    documentSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CounterCancellationComponent,
        CounterAirportFilterPipe,
        CounterDateFilterPipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
        NgbModule,
        ToastrModule.forRoot(),
      ],
    }).compileComponents();
    toastr = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
    httpService = TestBed.get(CounterHttpService);
    dataService = TestBed.get(CounterDataService);
    component = new CounterCancellationComponent(
      modalService,
      router,
      toastr,
      httpService,
      dataService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterCancellationComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get the name of the airport", () => {
    component.airports = mockAirports;
    expect(component.getAirportName(mockDepartAirport.airportId)).toBe(
      mockDepartAirport.name
    );
    expect(component.getAirportName(mockArriveAirport.airportId)).toBe(
      mockArriveAirport.name
    );
  });

  it("should remove the active class from the side link", () => {
    const mockElement = document.createElement("li");
    mockElement.id = "cancel";
    spyOn(document, "getElementById").and.returnValue(mockElement);
    mockElement.className = "side-link-active";
    expect(mockElement.className).toBe("side-link-active");
    component.ngOnDestroy();
    expect(mockElement.className).toBe("");
  });
});
