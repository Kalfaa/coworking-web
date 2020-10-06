import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubComponent } from './dialog-sub.component';

describe('DialogSubComponent', () => {
  let component: DialogSubComponent;
  let fixture: ComponentFixture<DialogSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
