import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTransferPasswordComponent } from './change-transfer-password.component';

describe('ChangeTransferPasswordComponent', () => {
  let component: ChangeTransferPasswordComponent;
  let fixture: ComponentFixture<ChangeTransferPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeTransferPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTransferPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
