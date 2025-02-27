import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSensorComponent } from './get-sensor.component';

describe('GetSensorComponent', () => {
  let component: GetSensorComponent;
  let fixture: ComponentFixture<GetSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSensorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
