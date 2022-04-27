import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersPasswordComponent } from './transfers-password.component';

describe('TransfersPasswordComponent', () => {
  let component: TransfersPasswordComponent;
  let fixture: ComponentFixture<TransfersPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfersPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
