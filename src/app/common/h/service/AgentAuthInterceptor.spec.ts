import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from "@angular/common/http/testing";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AgentUtopiaService } from '../agent-utopia.service';
import { AgentAuthInterceptor } from './AgentAuthInterceptor';

describe("AgentAuthInterceptor", () => {
  let service: AgentUtopiaService;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AgentUtopiaService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AgentAuthInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.get(AgentUtopiaService);
    mockHttp = TestBed.get(HttpTestingController);
  });

  it("should be created", () => {
    const service: AgentAuthInterceptor = TestBed.get(
      AgentAuthInterceptor
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