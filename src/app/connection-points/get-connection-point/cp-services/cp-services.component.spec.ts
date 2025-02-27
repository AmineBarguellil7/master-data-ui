import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpServicesComponent } from './cp-services.component';

describe('CpServicesComponent', () => {
  let component: CpServicesComponent;
  let fixture: ComponentFixture<CpServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CpServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
