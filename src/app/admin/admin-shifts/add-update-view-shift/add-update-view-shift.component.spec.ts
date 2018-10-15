import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateViewShiftComponent } from './add-update-view-shift.component';

describe('AddUpdateViewShiftComponent', () => {
  let component: AddUpdateViewShiftComponent;
  let fixture: ComponentFixture<AddUpdateViewShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateViewShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateViewShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
