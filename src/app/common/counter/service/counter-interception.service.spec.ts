import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { CounterInterceptionService } from "./counter-interception.service";
import { CounterHttpService } from "./counter-http.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

describe("CounterInterceptionService", () => {
  let service: CounterHttpService;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CounterHttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CounterInterceptionService,
          multi: true,
        },
      ],
    });
    service = TestBed.get(CounterHttpService);
    mockHttp = TestBed.get(HttpTestingController);
  });

  it("should be created", () => {
    const service: CounterInterceptionService = TestBed.get(
      CounterInterceptionService
    );
    expect(service).toBeTruthy();
  });

  
});
