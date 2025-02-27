import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionPointsComponent } from './connection-points.component';

describe('ConnectionPointsComponent', () => {
  let component: ConnectionPointsComponent;
  let fixture: ComponentFixture<ConnectionPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionPointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
