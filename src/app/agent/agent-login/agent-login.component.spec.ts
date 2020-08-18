import { AgentLoginComponent } from "./agent-login.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { AgentUtopiaService } from "src/app/common/h/agent-utopia.service";
import { RouterModule, Routes, Router } from '@angular/router';
import { AgentAuthService } from "src/app/common/h/service/AgentAuthService";
import { AppRoutingModule } from "src/app/app-routing.module";

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe("AgentLoginComponent", () => {
  let component: AgentLoginComponent;
  let fixture: ComponentFixture<AgentLoginComponent>;
  let service: AgentAuthService;
  let fb: FormBuilder;
  let router: Router;
  let toastService: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AgentLoginComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        HttpClientModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterModule.forRoot([]),
      ],
      providers: [AgentAuthService],
    }).compileComponents();

    router = TestBed.get(Router);
    service = new AgentAuthService(null, router);
    fb = new FormBuilder();
    component = new AgentLoginComponent(fb, service, router, toastService);
  }));

  beforeEach(() => {
    spyOn(document, "getElementById").and.callFake(function() {
        return {
            classList: {
                add: () => {

                },
                remove: () => {

                }
            },
        }
    }); 

    fixture = TestBed.createComponent(AgentLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set invalidLogin to true", () => {
      component.invalidLogin = false;
      component.setInvalidLogin();
      expect(component.invalidLogin).toEqual(true);
  })

  it("should recpgnize there are no login values", () => { 
      component.login();
      expect(component.invalidAttempt).toEqual(true);
  });
});
