import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpContractsComponent } from './bp-contracts.component';

describe('BpContractsComponent', () => {
  let component: BpContractsComponent;
  let fixture: ComponentFixture<BpContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpContractsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BpContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
