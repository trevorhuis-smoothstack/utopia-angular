import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
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

  it("should add a an authorization heder with a stored token", () => {
    const token = "mockToken";
    let request: TestRequest;
    localStorage.setItem("token", token);
    service.get("").subscribe();
    request = mockHttp.expectOne("");
    expect(request.request.headers.get("Authorization")).toBe(
      "Bearer " + token
    );
    localStorage.removeItem("token");
    service.get("").subscribe();
    request = mockHttp.expectOne("");
    expect(request.request.headers.has("Authorization")).toBe(false);
  });
});
