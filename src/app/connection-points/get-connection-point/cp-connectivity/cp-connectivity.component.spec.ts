import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpConnectivityComponent } from './cp-connectivity.component';

describe('CpConnectivityComponent', () => {
  let component: CpConnectivityComponent;
  let fixture: ComponentFixture<CpConnectivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpConnectivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CpConnectivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
