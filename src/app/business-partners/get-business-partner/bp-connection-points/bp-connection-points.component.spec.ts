import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpConnectionPointsComponent } from './bp-connection-points.component';

describe('BpConnectionPointsComponent', () => {
  let component: BpConnectionPointsComponent;
  let fixture: ComponentFixture<BpConnectionPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpConnectionPointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BpConnectionPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
