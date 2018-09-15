import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrganisationComponent } from './select-organisation.component';

describe('SelectOrganisationComponent', () => {
  let component: SelectOrganisationComponent;
  let fixture: ComponentFixture<SelectOrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOrganisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
