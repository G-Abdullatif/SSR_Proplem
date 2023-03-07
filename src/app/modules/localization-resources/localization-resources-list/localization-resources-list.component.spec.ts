import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizationResourcesListComponent } from './localization-resources-list.component';

describe('LocalizationResourcesListComponent', () => {
  let component: LocalizationResourcesListComponent;
  let fixture: ComponentFixture<LocalizationResourcesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalizationResourcesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizationResourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
