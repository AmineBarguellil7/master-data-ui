import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBusinessPartnerComponent } from './get-business-partner.component';

describe('GetBusinessPartnerComponent', () => {
  let component: GetBusinessPartnerComponent;
  let fixture: ComponentFixture<GetBusinessPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetBusinessPartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetBusinessPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
