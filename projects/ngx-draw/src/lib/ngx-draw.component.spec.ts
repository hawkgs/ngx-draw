import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDrawComponent } from './ngx-draw.component';

describe('NgxDrawComponent', () => {
  let component: NgxDrawComponent;
  let fixture: ComponentFixture<NgxDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDrawComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
