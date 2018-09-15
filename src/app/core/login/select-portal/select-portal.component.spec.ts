import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPortalComponent } from './select-portal.component';

describe('SelectPortalComponent', () => {
  let component: SelectPortalComponent;
  let fixture: ComponentFixture<SelectPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
