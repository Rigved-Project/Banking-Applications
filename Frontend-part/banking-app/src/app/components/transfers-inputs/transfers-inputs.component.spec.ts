import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersInputsComponent } from './transfers-inputs.component';

describe('TransfersInputsComponent', () => {
  let component: TransfersInputsComponent;
  let fixture: ComponentFixture<TransfersInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfersInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
