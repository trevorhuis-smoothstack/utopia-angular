import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterBookingComponent } from "./counter-booking.component";
import { CounterPriceFilterPipe } from "src/app/common/counter/pipe/counter-price-filter.pipe";
import { CounterAirportFilterPipe } from "src/app/common/counter/pipe/counter-airport-filter.pipe";
import { CounterDateFilterPipe } from "src/app/common/counter/pipe/counter-date-filter.pipe";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CounterHttpService } from "src/app/common/counter/service/counter-http.service";
import { CounterDataService } from "src/app/common/counter/service/counter-data.service";
import { StripeService, NgxStripeModule } from "ngx-stripe";
import { FormsModule } from "@angular/forms";
import { InjectionToken } from "@angular/core";

describe("CounterBookingComponent", () => {
  let component: CounterBookingComponent;
  let fixture: ComponentFixture<CounterBookingComponent>;
  let router: Router,
    toastr: ToastrService,
    stripe: StripeService,
    modalService: NgbModal,
    httpService: CounterHttpService,
    dataService: CounterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CounterBookingComponent,
        CounterAirportFilterPipe,
        CounterDateFilterPipe,
        CounterPriceFilterPipe,
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "**", redirectTo: "" }]),
        NgbModule,
        ToastrModule.forRoot(),
        NgxStripeModule.forRoot(),
      ],
    }).compileComponents();
    toastr = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
    httpService = TestBed.get(CounterHttpService);
    dataService = TestBed.get(CounterDataService);
    component = new CounterBookingComponent(
      modalService,
      router,
      toastr,
      stripe,
      httpService,
      dataService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterBookingComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
