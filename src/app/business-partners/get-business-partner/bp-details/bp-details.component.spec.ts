import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpDetailsComponent } from './bp-details.component';

describe('BpDetailsComponent', () => {
  let component: BpDetailsComponent;
  let fixture: ComponentFixture<BpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
