import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpSensorsComponent } from './cp-sensors.component';

describe('CpSensorsComponent', () => {
  let component: CpSensorsComponent;
  let fixture: ComponentFixture<CpSensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpSensorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CpSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
