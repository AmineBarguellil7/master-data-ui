import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetConnectionPointComponent } from './get-connection-point.component';

describe('GetConnectionPointComponent', () => {
  let component: GetConnectionPointComponent;
  let fixture: ComponentFixture<GetConnectionPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetConnectionPointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetConnectionPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
