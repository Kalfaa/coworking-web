import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenspaceDetailComponent } from './openspace-detail.component';

describe('OpenspaceDetailComponent', () => {
  let component: OpenspaceDetailComponent;
  let fixture: ComponentFixture<OpenspaceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenspaceDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenspaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
