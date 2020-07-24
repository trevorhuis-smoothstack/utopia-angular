import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBookingComponent } from './cancel-booking.component';
import { BookingsComponent } from 'src/app/traveler/bookings/bookings.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// describe('CancelBookingComponent', () => {
//   let component: CancelBookingComponent;
//   let fixture: ComponentFixture<CancelBookingComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
//       declarations: [ CancelBookingComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(CancelBookingComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should change the pagination count', () => {
//     component.filterMetadata.count = 12;
//     expect(component.filterMetadata.count).toEqual(12);
//     component.bookings[10] = null;
//     component.changePaginationCount();
//     expect(component.filterMetadata.count).toEqual(11);
//   });


// });
