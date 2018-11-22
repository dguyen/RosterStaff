import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftDashboardCardComponent } from './shift-dashboard-card.component';

describe('ShiftDashboardCardComponent', () => {
  let component: ShiftDashboardCardComponent;
  let fixture: ComponentFixture<ShiftDashboardCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftDashboardCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftDashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
